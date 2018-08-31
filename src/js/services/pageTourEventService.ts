import { IRootScope } from "../interfaces/IRootScope";
import { UserProfileService } from "./userProfileService";
import { AppControllerHelper } from "../factory/AppControllerHelper";

export class pageTourEventService {
	private rootScope: IRootScope;
	currentLeftNavPinState: boolean;
	isPageTourInProgress: boolean;
	constructor($rootScope: IRootScope,
		private userProfileService: UserProfileService,
		appControllerHelper: AppControllerHelper
	) {
		this.rootScope = $rootScope;
		this.isPageTourInProgress = false;
	}
	init() {
		var self = this;
		self.rootScope.$on('pageTour-initialize', function (event) {
			self.isPageTourInProgress = true;
			self.currentLeftNavPinState = self.rootScope.isLeftNavPinned;
			self.rootScope.isLeftNavOpen = true;
			self.rootScope.isLeftNavPinned = true;
			self.rootScope.isNewTabAllowed = false;
		});

		self.rootScope.$on('pageTour-Completed', function (event) {
			self.isPageTourInProgress = false;
			self.rootScope.isLeftNavPinned = self.rootScope.isLeftNavOpen = self.currentLeftNavPinState;
			self.rootScope.isNewTabAllowed = true;
		});

	}
}