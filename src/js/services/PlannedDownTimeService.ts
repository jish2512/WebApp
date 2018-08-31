import { ISystemMessage } from "../interfaces/isystemmessage";
import { FxpConstants } from "../common/ApplicationConstants";
import { FxpConfigurationService } from "./FxpConfiguration";
import { SYSTEM_MESSAGE_UI } from "../constants/systemMessages.constants";
import { ILogger } from "../interfaces/ILogger";
import { TimeZoneHelper } from "./TimeZoneHelper";
import { SystemMessagesService } from "./SystemMessagesService";
import * as _ from "underscore";
import moment from "moment/src/moment";

export class PlannedDownTimeService {
	private intervalTimeMinutes: number;
	private displayFlashBeforeMinutes: number;
	private errorCount = 0;
	private loadPromise: angular.IPromise<any>;
	private plannedDownTimeCollection: Array<ISystemMessage> = [];
	private isFlashVisible: boolean = false;
	private flashMesage: string;
	private currentLeftNavItem: any;
	private systemDownMessage: string;
	private timeFormat = "MM/DD/YYYY h:mm a z";

	constructor(private $timeout: any,
		private fxpConfiguration: FxpConfigurationService,
		private SystemMessagesService: SystemMessagesService,
		private TimeZoneHelper: TimeZoneHelper,
		private moment: moment,
		private UiString: SYSTEM_MESSAGE_UI,
		private logger: ILogger,
		private $window: angular.IWindowService) {

		this.intervalTimeMinutes = fxpConfiguration.FxpAppSettings.FlashPollingIntervalInMinutes;
		this.displayFlashBeforeMinutes = fxpConfiguration.FxpAppSettings.DisplayFlashBeforeMinutes;
		
		angular.element($window).on("blur", this.pausePlannedDownTimesPoll.bind(this));
		angular.element($window).on("focus", this.resumePlannedDownTimesPoll.bind(this));
	}

	pollForPlannedDownTimesandUpdateFlash() {
		let self = this;
		self.SystemMessagesService.getPlannedDownTimeCollection()
			.then(onSuccess.bind(self))
			.then(self.updateFlash.bind(self))
			.catch(onRejected.bind(self))
			.finally(self.nextLoad.bind(self));

		function onSuccess(response) {
			let self = this;

			if (!response.data || !response.data.systemMessages)
				return;

			self.plannedDownTimeCollection = response.data.systemMessages;

			_.each(self.plannedDownTimeCollection, (item: ISystemMessage) => {
				item.startTime = self.TimeZoneHelper.convertUtcToLocal(self.moment.utc(item.startTime));
				item.endTime = self.TimeZoneHelper.convertUtcToLocal(self.moment.utc(item.endTime));
			});
		};

		function onRejected(error) {
			let self = this;
			let errorMessage = self.UiString.ERRORS.CANNOT_FETCH_SYSTEM_MESSAGE;
			var propbag = self.logger.createPropertyBag();
			propbag.addToBag(FxpConstants.metricConstants.Status, error.status);
			propbag.addToBag(FxpConstants.metricConstants.StatusText, error.statusText);
			propbag.addToBag(FxpConstants.metricConstants.ErrorUrl, error.config ? error.config.url : '');
			self.logger.logError("Fxp.Services.PlannedDownTimeService", errorMessage, "2930", "", propbag);
		};
	};

	cancelNextLoad() {
		let self = this;
		self.$timeout.cancel(self.loadPromise);
	};

	nextLoad() {
		let self = this;
		self.cancelNextLoad();
		self.loadPromise = self.$timeout(self.pollForPlannedDownTimesandUpdateFlash.bind(self), self.intervalTimeMinutes * 60 * 1000);
	};

	pausePlannedDownTimesPoll() {
		var self = this;
		if (self.loadPromise) {
			self.cancelNextLoad();
		}
	};

	resumePlannedDownTimesPoll() {
		var self = this;
		self.pollForPlannedDownTimesandUpdateFlash();
	};

	updateFlash() {
		let self = this;
		if (!self.plannedDownTimeCollection || !self.currentLeftNavItem)
			return;

		var item = self.currentLeftNavItem;
		this.flashMesage = '';
		this.isFlashVisible = false;

		try {
			_.each(self.plannedDownTimeCollection, (downTime: ISystemMessage) => {
				var now = this.moment();

				if (self.isDownTimeConfigured(item, downTime)) {
					//Intermittent Message or Flash
					var tempTime = downTime.startTime.clone();
					if (now.isSameOrAfter(tempTime.subtract(self.displayFlashBeforeMinutes, "minutes"))
						&& now.isSameOrBefore(downTime.endTime)) {

						this.flashMesage = self.getFlashMessage(item, downTime);
						this.isFlashVisible = true;
					}
					else {
						this.isFlashVisible = false;
						this.flashMesage = '';
					}
					if (self.isSystemDown(item, downTime)) {
						this.isFlashVisible = false;
						var end = this.moment.tz(downTime.endTime, this.moment.tz.guess()).format(this.timeFormat);
						this.systemDownMessage = `We expect to resume at ${end}`;
					}
				}
			});
		}
		catch (e) {
			self.logger.logError("Fxp.Services.PlannedDownTimeService", "checkForPlannedDownTimes", "2931", e);
			console.error(e);
		}
	};

	isDownTimeConfigured(item: any, downTime: ISystemMessage) {

		if (item.id == downTime.businessCapability[0].id
			|| (downTime.businessFunction.length > 0
				&& item.id == downTime.businessFunction[0].id)
			|| (item.parentId == downTime.businessCapability[0].id
				&& downTime.businessFunction[0].id == 0)) {

			return true;
		}
		return false;
	}

	isSystemDown(item: any, downTime: ISystemMessage) {
		var now = this.moment();

		if (downTime.messageType == "SystemDown"
			&& now.isAfter(downTime.startTime)
			&& now.isSameOrBefore(downTime.endTime))
			return true;

		return false;
	}

	getFlashMessage(item: any, downTime: ISystemMessage) {
		var tempMessage = this.flashMesage;

		if (tempMessage != '')
			tempMessage = tempMessage + '<br/>';

		if (item.id == downTime.businessCapability[0].id
			|| downTime.businessFunction[0].id == 0)
			tempMessage = tempMessage + downTime.businessCapability[0].name + ' > ';
		else if (item.id == downTime.businessFunction[0].id)
			tempMessage = tempMessage + downTime.businessFunction[0].name + ' > ';

		tempMessage = tempMessage + downTime.message;

		var start = this.moment.tz(downTime.startTime, this.moment.tz.guess()).format(this.timeFormat);
		var end = this.moment.tz(downTime.endTime, this.moment.tz.guess()).format(this.timeFormat);

		var formatString = ` Start Date/Time: ${start} - End Date/Time: ${end}`;
		tempMessage = tempMessage + formatString;

		return tempMessage;
	}

	isStateDown(stateName) {
		var self = this;

		if (!self.plannedDownTimeCollection || !self.currentLeftNavItem)
			return false;

		var item = self.currentLeftNavItem;
		var systemDown = false;

		_.each(self.plannedDownTimeCollection, (downTime: ISystemMessage) => {

			if (self.isDownTimeConfigured(item, downTime)) {
				if (self.isSystemDown(item, downTime)) {

					var downStateName = item.targetUIStateName || item.targetURL || item.targetEventName;

					if (stateName == downStateName) {
						systemDown = true;
						return true;
					}
				}
			}
		});
		return systemDown;
	}
}