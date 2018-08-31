import * as _ from 'underscore';
declare type moment= any;
declare type IStateService = any;
import { IActOnBehalfOfControllerScope } from "../interfaces/IActOnBehalfOfControllerScope";
import { ILogger } from "../interfaces/ILogger";
import { FxpMessageService } from "../services/FxpMessageService";
import { FxpConstants, ApplicationConstants } from "../common/ApplicationConstants";
import { OBOUserService } from "../services/OBOUserService";
import { IFxpContext } from "../interfaces/IFxpContext";
import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "../services/userProfileService";
import { UserInfoService } from "../services/UserInfoService";
import { LogPropertyBag } from "../telemetry/LogPropertyBag";
import { TelemetryContext } from "../telemetry/telemetrycontext";
import { FxpConfigurationService } from "../services/FxpConfiguration";
import { PageLoaderService } from "../services/pageLoaderService";
import { CommonUtils } from "../utils/CommonUtils";
import { ActOnBehalfOfHelper } from "../factory/ActOnBehalfOfHelper";
import { FxpRouteService } from "../services/FxpRouteService";
import { AdminLandingService } from "../services/AdminLandingService";
import { SettingsServiceProvider } from "../provider/SettingsServiceProvider";
import { FxpContext } from "../context/FxpContext";
import { SettingsType } from "../common/SettingsType";
import { Resiliency } from "../resiliency/FxpResiliency";
import { SYSTEM_MESSAGE_UI } from "../constants/systemMessages.constants";
import { IPersonalizationService } from "../interfaces/IPersonalizationService";
import { TimeZoneHelper } from "../services/TimeZoneHelper";
import { ISystemMessage } from "../interfaces/isystemmessage";
import { ISystemMessagesService } from "../interfaces/ISystemMessagesService";

import ng = angular;

type SystemMessagesModalTypes = "NONE" | "ADD" | "EDIT" | "DELETE";
type SortOrder = "ASC" | "DESC";
export class SystemMessagesController {
	name = 'Fxp.Controllers.SystemMessagesController';
	systemMessageCollection: Array<ISystemMessage> = [];
	systemMessage: ISystemMessage = null;
	messageCountCollection = [10, 20, 30];
	messageCount: number;
	messagePerPageCount = 10;
	pageCount: number = 1;
	currentPage: number = 1;
	validPreviousPageNumber: number = 1;
	sortOrder: SortOrder = "DESC";
	loggedInUser: string;
	modalType: SystemMessagesModalTypes = "NONE";
	businessCapabilityCollection: any;
	businessFunctionCollection: any;
	systemMessageDateStringFormat = "MM/DD/YY H:mm A";

	constructor(
		private scope: any,
		private logger: ILogger,
		private fxpMessageService: FxpMessageService,
		private TimeZoneHelper: TimeZoneHelper,
		private SystemMessagesService: ISystemMessagesService,
		private PersonalizationService: IPersonalizationService,
		private pageLoaderService: PageLoaderService,
		private UserInfoService: UserInfoService,
		public UiString: SYSTEM_MESSAGE_UI,
		private $timeout: any
	) {
		scope.smCtrl = this;
		this.loggedInUser = UserInfoService.getLoggedInUserUpn();
		this.populateSystemMessagesCollection();
		this.cacheBusinessCapabilityL0List();
	}

	private populateSystemMessagesCollection = (): void => {
		var self = this;
		self.pageLoaderService.fnShowPageLoader(SYSTEM_MESSAGE_UI.LOADING_TEXTS.FETCHING_MESSAGES);
		self.SystemMessagesService.getSystemMessagesCollectionAsync(self.messagePerPageCount, self.currentPage, self.sortOrder)
			.then(onSuccess)
			.catch(onRejected)
			.finally(() => { self.pageLoaderService.fnHidePageLoader() });

		function onSuccess(response) {
			try {
				self.systemMessageCollection = response.data.systemMessages;
				self.messageCount = response.data.recordCount;
				self.pageCount = calcuatePageCount();

				_.each(self.systemMessageCollection, (item: ISystemMessage) => {
					convertMessageUtcTimeZoneToPacificTime(item);
				});
			} catch (error) {
				onRejected(error);
			}
		}
		function calcuatePageCount() {
			return Math.ceil(self.messageCount / self.messagePerPageCount);
		}
		function convertMessageUtcTimeZoneToPacificTime(item: ISystemMessage) {

			item.startTime = self.TimeZoneHelper.convertToPacific(item.startTime);
			item.endTime = self.TimeZoneHelper.convertToPacific(item.endTime);
		}
		function updateStatus(item: ISystemMessage) {
			item.isActive = item.isActive == true ? SYSTEM_MESSAGE_UI.ACTIVE : SYSTEM_MESSAGE_UI.EXPIRED;
		}
		function onRejected(reason: any) {
			let errorMessage = SYSTEM_MESSAGE_UI.ERRORS.CANNOT_FETCH_SYSTEM_MESSAGE;
			self.fxpMessageService.addMessage(errorMessage, FxpConstants.messageType.error);
			self.logger.logError(self.name, errorMessage, "2916", reason);
		}
	}

	private cacheBusinessCapabilityL0List = (): void => {
		var self = this;
		self.PersonalizationService.getMasterLeftNavItems()
			.then(onSuccess, onError);

		function onSuccess(response) {
			try { self.businessCapabilityCollection = getL0Collection(); }
			catch (error) {
				onError(error);
			}

			function getL0Collection() {
				return _.map(response.data.result, L0Mapper);
			}

			function L0Mapper(L0) {
				return {
					'id': L0.id,
					'name': L0.displayName,
					'businessFunctionCollection': getL1Collection(L0)
				};

				function getL1Collection(L0) {
					let L1Collection = _.map(L0.children, forEachL1);
					L1Collection.unshift({ 'id': 0, 'name': "All" });
					return L1Collection;

					function forEachL1(L1) {
						return {
							'id': L1.id,
							'name': L1.displayName
						};
					}
				}
			}
		}
		function onError(error) {
			let errorMessage = SYSTEM_MESSAGE_UI.ERRORS.CANNOT_FETCH_BBUSINESS_WORKFLOW;
			self.fxpMessageService.addMessage(errorMessage, FxpConstants.messageType.error);
			self.logger.logError(self.name, errorMessage, "2917", error);
		}
	}

	showModal(modalType: SystemMessagesModalTypes, message: ISystemMessage = {} as any): void {
		var self = this;
		self.systemMessage = setDefaultValues(message);
		self.modalType = modalType;
		updateBusinessFunctionL1Collection();

		function setDefaultValues(message) {
			let systemMessage = _.defaults(angular.copy(message), getEmptyMessage());
			formatDates();
			return systemMessage;

			function getEmptyMessage() {
				return {
					id: "",
					messageType: SYSTEM_MESSAGE_UI.TYPE.INTERMITTENT,
					startTime: self.TimeZoneHelper.getCurrentPacificDateTime(),
					endTime: self.TimeZoneHelper.getCurrentPacificDateTime().add(1, 'hours'),
					businessCapability: [], businessFunction: [], startTimeString: '', endTimeString: ''
				};
			}

			function formatDates() {
				systemMessage.startTimeString = systemMessage.startTime.format(self.systemMessageDateStringFormat);
				systemMessage.endTimeString = systemMessage.endTime.format(self.systemMessageDateStringFormat);
			}
		}

		function updateBusinessFunctionL1Collection() {
			if (self.systemMessage.businessCapability.length > 0) {
				var businessCapability:any = _.find(self.businessCapabilityCollection, (item) => { return item.id == self.systemMessage.businessCapability[0].id });
				if (businessCapability && businessCapability.businessFunctionCollection) {
					self.businessFunctionCollection = businessCapability.businessFunctionCollection;
				}
			}
		}
	}
	hideModal(): void {
		this.modalType = "NONE";
		this.systemMessage = null;
	}
	addSystemMessage = (): void => {
		var self = this;

		self.systemMessage.createdBy = self.systemMessage.lastModifiedBy = this.loggedInUser;
		delete self.systemMessage.businessCapability[0].businessFunctionCollection;
		var request = angular.copy(self.systemMessage);
		request.startTime = self.TimeZoneHelper.convertToUtc(self.TimeZoneHelper.changeTimeZoneComponentToPacific(request.startTime));
		request.endTime = self.TimeZoneHelper.convertToUtc(self.TimeZoneHelper.changeTimeZoneComponentToPacific(request.endTime));
		self.pageLoaderService.fnShowPageLoader(SYSTEM_MESSAGE_UI.LOADING_TEXTS.ADDING_MESSAGE);
		self.SystemMessagesService.saveSystemMessageAsync(request)
			.then(successCallback, onRejected)
			.finally(popupDestroy);

		function successCallback(response: any) {
			let successMessage = SYSTEM_MESSAGE_UI.SUCCESS.SYSTEM_MESSAGE_ADDED;
			self.$timeout(function () {
				self.fxpMessageService.addMessage(successMessage, FxpConstants.messageType.success)
			});
			self.logger.logInformation(self.name, "System Messages successfully added with id:" + response.data.id);
			self.populateSystemMessagesCollection();
		}

		function onRejected(reason: any) {
			let errorMessage = SYSTEM_MESSAGE_UI.ERRORS.CANNOT_ADD_SYSTEM_MESSAGE;
			self.fxpMessageService.addMessage(errorMessage, FxpConstants.messageType.error);
			self.logger.logError(self.name, errorMessage, "2918", reason);
		}
		function popupDestroy() {
			self.hideModal.bind(self)();
			self.pageLoaderService.fnHidePageLoader();
		}
	}
	updateSystemMessage = (): void => {
		var self = this;
		self.systemMessage.lastModifiedBy = this.loggedInUser;

		var request = angular.copy(self.systemMessage);
		delete request.businessCapability[0].businessFunctionCollection;
		delete request.endTimeString;
		delete request.startTimeString;

		request.startTime = self.TimeZoneHelper.convertToUtc(self.TimeZoneHelper.changeTimeZoneComponentToPacific(request.startTime));
		request.endTime = self.TimeZoneHelper.convertToUtc(self.TimeZoneHelper.changeTimeZoneComponentToPacific(request.endTime));

		self.pageLoaderService.fnShowPageLoader(SYSTEM_MESSAGE_UI.LOADING_TEXTS.UPDATING_MESSAGE);
		self.SystemMessagesService.saveSystemMessageAsync(request)
			.then(successCallback, onRejected)
			.finally(popupDestroy);

		function successCallback(response: any) {
			let successMessage = SYSTEM_MESSAGE_UI.SUCCESS.SYSTEM_MESSAGE_UPDATED;
			self.$timeout(function () {
				self.fxpMessageService.addMessage(successMessage, FxpConstants.messageType.success);
			});
			self.logger.logInformation(self.name, "System Message with id:" + response.data.id + " updated");
			self.populateSystemMessagesCollection();
		}
		function onRejected(reason: any) {
			let errorMessage = SYSTEM_MESSAGE_UI.ERRORS.CANNOT_UPDATE_SYSTEM_MESSAGE;
			self.fxpMessageService.addMessage(errorMessage, FxpConstants.messageType.error);
			self.logger.logError(self.name, errorMessage, "2919", reason);
		}

		function popupDestroy() {
			self.hideModal.bind(self)();
			self.pageLoaderService.fnHidePageLoader();
		}
	}
	deleteSystemMessage = (): void => {
		var self = this;
		self.pageLoaderService.fnShowPageLoader(SYSTEM_MESSAGE_UI.LOADING_TEXTS.DELETING_MESSAGE);
		self.SystemMessagesService.deleteSystemMessageAsync(self.systemMessage.id)
			.then(successCallback, onRejected)
			.finally(popupDestroy);

		function successCallback() {
			let successMessage = SYSTEM_MESSAGE_UI.SUCCESS.SYSTEM_MESSAGE_DELETED;
			self.$timeout(function () {
				self.fxpMessageService.addMessage(successMessage, FxpConstants.messageType.success);
			});
			self.logger.logInformation(self.name, "System Message with " + self.systemMessage.id + " Deleted Successfuly");
			if (areAllMessagesOfCurrentPageDeleted()) {
				self.currentPage--;
				self.changePage();
			}
			self.populateSystemMessagesCollection();

			function areAllMessagesOfCurrentPageDeleted() {
				return (self.currentPage > Math.ceil((self.messageCount - 1) / self.messagePerPageCount)) &&
					self.currentPage > 1;
			}
		}
		function onRejected(reason: any) {
			let errorMessage = SYSTEM_MESSAGE_UI.ERRORS.CANNOT_DELETE_SYSTEM_MESSAGE;
			self.fxpMessageService.addMessage(errorMessage, FxpConstants.messageType.error);
			self.logger.logError(self.name, errorMessage, "2920", reason);
		}

		function popupDestroy() {
			self.hideModal.bind(self)();
			self.pageLoaderService.fnHidePageLoader();
		}
	}
	updateBusinessFunctionCollection = (): void => {
		if (this.systemMessage.businessCapability[0]) {
			this.businessFunctionCollection = angular.copy(this.systemMessage.businessCapability[0].businessFunctionCollection);
			this.systemMessage.businessFunction[0] = this.businessFunctionCollection[0];
		}
		else {
			this.businessFunctionCollection = this.systemMessage.businessFunction[0] = [];
		}
	}
	updateMessagePerPageCount = (): void => {
		this.currentPage = this.validPreviousPageNumber = 1;
		this.populateSystemMessagesCollection();
	}

	changePageOnKeydown() {
		if (angular.isDefined(this.currentPage) && this.currentPage !== null && this.currentPage > 0) {
			this.changePage();
		}
	}
	resetPageNumberOnBlur() {
		if (this.currentPage != this.validPreviousPageNumber) {
			this.currentPage = this.validPreviousPageNumber;
		}
	}

	changePage() {
		if (this.currentPage > this.pageCount) {
			this.currentPage = this.pageCount;
		}
		this.validPreviousPageNumber = this.currentPage;
		this.populateSystemMessagesCollection();
	}

	loadNextPage = () => {
		this.currentPage = this.currentPage + 1;
		this.changePage();
	}

	loadPrevPage = () => {
		this.currentPage = this.currentPage - 1;
		this.changePage();
	}
	toggleSortOrder() {
		this.sortOrder = (this.sortOrder == "DESC") ? "ASC" : "DESC";
		this.populateSystemMessagesCollection();
	}
	getStatusText(status) {
		return status ? SYSTEM_MESSAGE_UI.ACTIVE : SYSTEM_MESSAGE_UI.EXPIRED;
	}
}