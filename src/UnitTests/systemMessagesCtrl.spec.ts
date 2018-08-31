import {SystemMessagesController} from '../js/controllers/systemMessagesController';
declare var angular:any;
describe("Given SystemMessagesController Unit Test Suite", () => {

	var $scope;
	var $rootScope;
	var $q;
	var $controller;
	var fxpLoggerService;
	var fxpMessageService;
	var personalizationAdminCntrl;
	var RoleNavPersonalizationController;
	var fxpConfigurationService;
	var pageLoaderService;
	var personalizationService;
	var timeout;
	var deferredflag = true;
	var nodata = true;
	var witherrorcode = true;
	var deffered;
	var moment;
	var fpMessageService;
	var timeZoneHelper;
	var systemMessagesService;
	var userInfoService;
	var systemMessagesController;
	var systemMessagesConsts;
	var $log;
	var momentObject;
	var $timeout;

	var globalMasterNavList = {
		"data": {
			"result": [
				{
					"isPersonalizationAllowed": false,
					"children": null,
					"id": 1,
					"displayName": "Dashboard",
					"targetUIStateName": "Dashboard",
					"hasChildren": false,
					"sortOrder": 1,
					"parentId": 0
				},
				{
					"id": 15,
					"displayName": "Resource Management",
					"hasChildren": true,
					"sortOrder": 3,
					"parentId": null,
					"isPersonalizationAllowed": true,
					"targetUIStateName": "Dashboard",
					"children": [
						{
							"isPersonalizationAllowed": true,
							"id": 16,
							"displayName": "Resource Manager View",
							"targetUIStateName": "Dashboard",
							"sortOrder": 1,
							"parentId": 15
						}, {
							"id": 17,
							"displayName": " Resource Test",
							"targetUIStateName": "Dashboard",
							"sortOrder": 2,
							"isPersonalizationAllowed": true,
							"parentId": 15
						}
					],

				}
			]
		}
	};
	var personaNavList = {
		"data": {
			"result": [
				{
					"id": 1,
					"displayName": "Dashboard",
					"hasChildren": false,
					"sortOrder": 1,
					"isPersonaDefault": true,
					"targetUIStateName": "Dashboard",
				},
				{
					"id": 15,
					"displayName": "Resource Management",
					"hasChildren": true,
					"sortOrder": 2,
					"targetUIStateName": "Dashboard",
					"isPersonaDefault": false,
					"children": [
						{
							"id": 16,
							"displayName": "Resource Manager View",
							"hasChildren": false,
							"sortOrder": 1,
							"isPersonaDefault": false,
							"targetUIStateName": "Dashboard",
							"parentId": 15
						},
						{
							"id": 17,
							"displayName": " Resource Test",
							"hasChildren": false,
							"targetUIStateName": "Dashboard",
							"sortOrder": 2,
							"isPersonaDefault": true,
							"parentId": 15
						}]
				}]
		}
	};
	var roleGroup = [
		{
			"RoleGroupId": 1,
			"RoleGroupName": "Delivery Manager",
			"BusinessRoles": [
				{
					"BusinessRoleName": "DM",
					"BusinessRoleId": 1
				},
				{
					"BusinessRoleName": "TAM",
					"BusinessRoleId": 2
				},
				{
					"BusinessRoleName": "DMAS",
					"BusinessRoleId": 3
				}
			]
		},
		{
			"RoleGroupId": 2,
			"RoleGroupName": "Delivery Resource",
			"BusinessRoles": [
				{
					"BusinessRoleName": "DM",
					"BusinessRoleId": 1
				},
				{
					"BusinessRoleName": "EM",
					"BusinessRoleId": 2
				}
			]
		},
		{
			"RoleGroupId": 3,
			"RoleGroupName": "Functional Manager",
			"BusinessRoles": [
				{
					"BusinessRoleName": "DM",
					"BusinessRoleId": 1
				}

			]
		},
		{
			"RoleGroupId": 4,
			"RoleGroupName": "Leader",
			"BusinessRoles": [
			]
		}
	];
	var UIStrings = {
		SYSTEM_MESSAGE: "System Message",
		SYSTEM_MESSAGES: "System Messages",
		ADD: "Add",
		EDIT: "Edit",
		SAVE: "Save",
		DELETE: "Delete",
		CANCEL: "CANCEL",
		ADD_MESSAGES: "Message",
		SYSTEM_MESSAGE_DESC: "Create and manage . The alert messages can be set to show up for all pages or only on a specified page.",
		ITEMS_TO_DISPLAY: "Items to display:",
		MESSAGE: {
			TYPE: "Type",
			MESSAGE: "MESSAGE",
			WORKFLOW: "Workflow(L0)",
			FUNCTION: "Function(L1)",
			START: "Start Date/Time",
			END: "End Date/Time"
		},

		TYPE: {
			INTERMITTENT: "Intermittent",
			SYSTEM_DOWN: "System Down"
		},
		BUSINESS_CAPABILITY: "Business capability (L0)",
		BUSINESS_FUNCTION: "Business function (L1)",
		MESSAGE_TO_USER: "Message to User",
		ADD_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.ADD} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
		EDIT_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.EDIT} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
		DELETE_SYSTEM_MESSAGE: "${SYSTEM_MESSAGE_UI.DELETE} ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",

		DELETE_CONFIRMATION: "Are you sure you want to delete this",

		ERRORS: {
			CANNOT_FETCH_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}s could not be fetched.",
			CANNOT_FETCH_BBUSINESS_WORKFLOW: "The business Workflows could not be fetched.",
			CANNOT_ADD_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be added.",
			CANNOT_UPDATE_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be updated.",
			CANNOT_DELETE_SYSTEM_MESSAGE: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be deleted.",
			CANNOT_FETCH_PLANEDDOWNTIME: "The planned downtime messages could not be fetched.",

			BUSINESS_CAPABILITY_REQUIRED: "${SYSTEM_MESSAGE_UI.BUSINESS_CAPABILITY} is Required.",
			BUSINESS_FUNCTION_REQUIRED: "${SYSTEM_MESSAGE_UI.BUSINESS_FUNCTION} is Required.",
			MESSAGE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE_TO_USER} is Required.",
			START_DATE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE.START} is Required.",
			END_DATE_REQUIRED: "${SYSTEM_MESSAGE_UI.MESSAGE.END} is Required.",
			END_DATE_MIN: "${SYSTEM_MESSAGE_UI.MESSAGE.END} must be after ${SYSTEM_MESSAGE_UI.MESSAGE.START}."
		},

		SUCCESS: {
			SYSTEM_MESSAGE_ADDED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully added.",
			SYSTEM_MESSAGE_UPDATED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully updated.",
			SYSTEM_MESSAGE_DELETED: "The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} was successfully deleted."
		},

		LOADING_TEXTS: {
			FETCHING_MESSAGES: "Loading ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGES}",
			ADDING_MESSAGE: "Adding ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
			UPDATING_MESSAGE: "Updating ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}",
			DELETING_MESSAGE: "Deleting ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE}"
		},

		PAGINATION: { PREV: "Prev", NEXT: "Next" }
	};

	var systemMessages =
		{
			"systemMessages": [
				{
					"id": "1",
					"messageType": "Intermittent",
					"message": "Intermittent issue",
					"businessCapability": "Profile",
					"businessFunction": "Data",
					"startTime": "2017-04-04 12:30",
					"startTimeString": "2017-04-04 12:30",
					"endTime": "2017-04-05 12:30",
					"endTimeString": "2017-04-05 12:30",
					"createdOn": "2017-04-03 12:30",
					"createdBy": "abgul@microsoft.com",
					"lastModifiedBy": "ch@microsoft.com"
				},
				{
					"id": "2",
					"messageType": "Intermittent",
					"message": "Intermittent issue",
					"businessCapability": "Profile",
					"businessFunction": "Data",
					"startTime": "2017-05-05 12:30",
					"startTimeString": "2017-05-05 12:30",
					"endTime": "2017-05-06 12:30",
					"endTimeString": "2017-05-06 12:30",
					"createdOn": "2017-05-03 12:30",
					"createdBy": "abgul@microsoft.com",
					"lastModifiedBy": "ch@microsoft.com"
				},
				{
					"id": "3",
					"messageType": "SystemDown",
					"message": "System would be down",
					"businessCapability": "Profile",
					"businessFunction": "Data",
					"startTime": "2017-05-06 12:30",
					"startTimeString": "2017-05-06 12:30",
					"endTime": "2017-05-07 12:30",
					"endTimeString": "2017-05-07 12:30",
					"createdOn": "2017-05-02 12:30",
					"createdBy": "abgul@microsoft.com",
					"lastModifiedBy": "ch@microsoft.com"
				}

			],
			"recordCount": "30"
		};
	var SYSTEM_MESSAGE_UI = UIStrings;

	beforeEach(angular.mock.module('FxPApp'));
	beforeEach(angular.mock.module('ui.router'));

	beforeEach(function () {
		angular.mock.module(function ($provide) {
			$provide.service("FxpLoggerService", function () {
				this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
					console.log('logInformation : ' + a + ',' + b);
				});
				this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
					return {
						addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
							console.log('propbag =>' + a + ':' + b);
						})
					};
				});
				this.createMetricBag = jasmine.createSpy("createMetricBag").and.callFake(function () {
					return {
						addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
							console.log('propbag =>' + a + ':' + b);
						})
					};
				});

				this.logTrace = jasmine.createSpy("logTrace").and.callFake(function (a, b) {
					console.log('logTrace : ' + a + ',' + b);
				});
				this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
					console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
				});
				this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
					console.log('logMetric : ' + a + ',' + b + ',' + c + ',' + d);
				});
				this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function () {
					console.log('logPageLoadMetrics');
				});
			});

			$provide.service("PageLoaderService", function () {
				this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function () {
					console.log('hided');
				});
				this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a) {
					console.log('hided');
				});
			});

			$provide.service("PersonalizationService", function () {
				this.getRoleGroupDetails = jasmine.createSpy("getRoleGroupDetails").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({
								data: roleGroup
							}
							);

						}
					}
				});
				this.getRolePersonalizedNavItems = jasmine.createSpy("getRoleGroupDetails").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({
								"data":
								personaNavList
							}
							);

						}
					}
				});
				this.getMasterLeftNavItems = jasmine.createSpy("getMasterLeftNavItems").and.callFake(function () {
					return {
						then: function (callback) {
							return callback(
								globalMasterNavList
							);

						}
					}
				});

				this.getPersonalizedNavItems = jasmine.createSpy("getPersonalizedNavItems").and.callFake(function () {
					return {
						then: function (callback) {
							return callback(
								personaNavList
							);
						}
					}
				});
			});

			$provide.service("SystemMessagesService", function () {
				this.getSystemMessagesCollectionAsync = jasmine.createSpy("getSystemMessagesCollectionAsync").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({
								data: systemMessages
							}
							);

						}
					}
				});

				this.getRolePersonalizedNavItems = jasmine.createSpy("getRoleGroupDetails").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({
								"data":
								personaNavList
							}
							);

						}
					}
				});
			});

			$provide.service("TimeZoneHelper", function () {
				this.convertToPacific = jasmine.createSpy("convertToPacific").and.callFake(function (a) {
					return new Date();
				});
				this.convertToUtc = jasmine.createSpy("convertToUtc").and.callFake(function (a) {
					return momentObject;
				});
				this.changeTimeZoneComponentToPacific = jasmine.createSpy("changeTimeZoneComponentToPacific").and.callFake(function (a) {
					return momentObject;
				});
				this.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
					return momentObject;
				});
			});

			$provide.service("FxpMessageService", function () {
				this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
					console.log(a + '' + b);
				});
			});

			$provide.service("SYSTEM_MESSAGE_UI", function () {
				return UIStrings;
			});

			$provide.service("UserInfoService", function () {
				this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function (a) {
					return a;
				});
				this.setCurrentUserUpn = jasmine.createSpy("setCurrentUserUpn").and.callFake(function (a) {
					return a;
				});
				this.setLoggedInUser = jasmine.createSpy("setLoggedInUser").and.callFake(function (a) {
					return a;
				});
				this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function (a) {
					return true;
				});
				this.getLoggedInUserUpn = jasmine.createSpy("getLoggedInUserUpn").and.callFake(function (a) {
					return "akhan@microsoft.com";
				});
			});

		});
	});

	beforeEach(angular.mock.inject(function (_$rootScope_, _$q_, FxpLoggerService, FxpMessageService, TimeZoneHelper, SystemMessagesService, PersonalizationService, _PageLoaderService_, UserInfoService, SYSTEM_MESSAGE_UI, _$timeout_, _$controller_) {
		$scope = _$rootScope_;
		$rootScope = _$rootScope_;
		$q = _$q_;
		deffered = _$q_.defer();
		fxpLoggerService = FxpLoggerService;
		fxpMessageService = FxpMessageService;
		timeZoneHelper = TimeZoneHelper;
		systemMessagesService = SystemMessagesService;
		personalizationService = PersonalizationService;
		pageLoaderService = _PageLoaderService_;
		userInfoService = UserInfoService;
		systemMessagesConsts = SYSTEM_MESSAGE_UI;
		$timeout = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
		$controller = _$controller_;
	}));

	beforeEach(function () {
		$rootScope.UiString = UIStrings;
	});

	beforeEach(angular.mock.inject(function (_$q_) {
		$q = _$q_;
		deffered = _$q_.defer();
		systemMessagesService.getSystemMessagesCollectionAsync = jasmine.createSpy("getSystemMessagesCollectionAsync").and.returnValue(deffered.promise);
	}));

	beforeEach(function () {

		systemMessagesController = $controller('SystemMessagesController', {
			_$rootScope_: $rootScope,
			$scope: $scope,
			FxpLoggerService: fxpLoggerService,
			FxpMessageService: fxpMessageService,
			TimeZoneHelper: timeZoneHelper,
			SystemMessagesService: systemMessagesService,
			PersonalizationService: personalizationService,
			PageLoaderService: pageLoaderService,
			UserInfoService: userInfoService,
			$timeout: $timeout,
			SYSTEM_MESSAGE_UI: systemMessagesConsts
		});

	});

	describe("When SystemMessagesController is loaded", () => {

		it("Then it populateSystemMessagesCollection should have been called and return system Messages", () => {
			deffered.resolve({
				data: systemMessages
			}
			);
			$scope.$apply();
			expect($scope.smCtrl.systemMessageCollection.length).toBeGreaterThan(0);
		});
		it("Then it populateSystemMessagesCollection should have been called and return system Messages with messages count.", () => {
			deffered.resolve({
				data: systemMessages
			}
			);
			$scope.$apply();
			expect($scope.smCtrl.messageCount).toEqual("30");
		});
	});

	describe("When showModal method is called", () => {
		var date = new Date();
		//momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1
			}],
			"businessFunction": "Data",
			"startTime": new Date(),
			"startTimeString": "2017-04-04 12:30",
			"endTime": new Date(),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": new Date(),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return new Date();
			});
			systemMessagesController.showModal("Add", systemMessage);
		})

		it("Then businessCapabilityCollection should be populated and its length should be greated than zero.", () => {
			expect($scope.smCtrl.businessCapabilityCollection.length).toBeGreaterThan(0);
		});

		it("Then businessCapabilityCollection should be populated - verify property.", () => {
			expect($scope.smCtrl.businessCapabilityCollection[0].id).toEqual(1);
		});
		it("Then businessFunctionCollection should be populated - verify property id.", () => {
			expect($scope.smCtrl.businessFunctionCollection[0].id).toEqual(0);
		});
		it("Then businessFunctionCollection should be populated - verify property name.", () => {
			expect($scope.smCtrl.businessFunctionCollection[0].name).toEqual("All");
		});
		it("Then modalType should be populated", () => {
			expect($scope.smCtrl.modalType).toEqual("Add");
		});
	});

	describe("When hideModal is called", () => {
		beforeEach(function () {
			systemMessagesController.hideModal();
		})

		it("Then modalType should be None", () => {
			expect($scope.smCtrl.modalType).toEqual("NONE");
		});
		it("Then it populateSystemMessagesCollection should have been called and return system Messages with messages count.", () => {
			expect($scope.smCtrl.systemMessage).toBeNull();
		});
	});

	describe("When Add System Message method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1
			}],
			"businessFunction": "Data",
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});
			systemMessagesService.saveSystemMessageAsync = jasmine.createSpy("saveSystemMessageAsync").and.returnValue(deffered.promise);
			systemMessagesController.showModal("Add", systemMessage);
			systemMessagesController.addSystemMessage();
		});

		it("Then if the promise is resolved the successCallback method should be called.", function () {
			deffered.resolve(
				{
					data: systemMessage
				}
			);
			$scope.$apply();
			expect(systemMessage).not.toBeNull();
		});

		it("Then if the promise is resolved the onRejected method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.fxpMessageService.addMessage).toHaveBeenCalledWith("The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be added.", "error");
		});

		it("Then if the promise is rejected the logError method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.logger.logError).toHaveBeenCalledWith("Fxp.Controllers.SystemMessagesController",
				"The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be added.", "2918", "Record not available");
		});

		it("The the CreatedBy should be set to the logged in user credentials.", function () {
			expect($scope.smCtrl.systemMessage.createdBy).toEqual("akhan@microsoft.com");
		});
	});

	describe("When Update System Message method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1
			}],
			"businessFunction": "Data",
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});
			systemMessagesService.saveSystemMessageAsync = jasmine.createSpy("saveSystemMessageAsync").and.returnValue(deffered.promise);
			systemMessagesController.showModal("Upadate", systemMessage);
			systemMessagesController.updateSystemMessage();
		});

		it("Then if the promise is resolved the successCallback method should be called.", function () {
			deffered.resolve({
				data: systemMessage
			});
			$scope.$apply();
			expect(systemMessage).not.toBeNull();
		});

		it("Then if the promise is rejected the onRejected method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.fxpMessageService.addMessage).toHaveBeenCalledWith("The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be updated.", "error");
		});

		it("Then if the promise is rejected the logError method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.logger.logError).toHaveBeenCalledWith("Fxp.Controllers.SystemMessagesController",
				"The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be updated.", "2919", "Record not available");
		});

		it("The the CreatedBy should be set to the logged in user credentials.", function () {
			expect($scope.smCtrl.systemMessage.createdBy).toEqual("abgul@microsoft.com");
		});
	});

	describe("When Delete System Message method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1
			}],
			"businessFunction": "Data",
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});
			systemMessagesService.deleteSystemMessageAsync = jasmine.createSpy("deleteSystemMessageAsync").and.returnValue(deffered.promise);
			systemMessagesController.showModal("Delete", systemMessage);
			systemMessagesController.deleteSystemMessage();
		});

		it("Then if the promise is resolved the successCallback method should be called.", function () {
			deffered.resolve("Promise");
			$scope.$apply();
			expect(systemMessagesController.fxpMessageService.addMessage).toHaveBeenCalled();
		});

		it("Then if the promise is rejected the onRejected method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.fxpMessageService.addMessage).toHaveBeenCalledWith("The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be deleted.", "error");
		});

		it("Then if the promise is rejected the logError method should be called.", function () {
			deffered.reject("Record not available");
			$scope.$apply();
			expect(systemMessagesController.logger.logError).toHaveBeenCalledWith("Fxp.Controllers.SystemMessagesController",
				"The ${SYSTEM_MESSAGE_UI.SYSTEM_MESSAGE} could not be deleted.", "2920", "Record not available");
		});

		it("The the CreatedBy should be set to the logged in user credentials.", function () {
			expect($scope.smCtrl.systemMessage.createdBy).toEqual("abgul@microsoft.com");
		});
	});

	describe("When Update System Message Collection method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1,
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			}],
			"businessFunction": {
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			},
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});

			systemMessagesController.showModal("Update", systemMessage);
			systemMessagesController.updateBusinessFunctionCollection();
		});

		it("Then updateBusinessFunctionCollection should be called and the collection length should be greater than zero.", function () {
			expect(systemMessagesController.businessFunctionCollection.length).toBeGreaterThan(0);
		});

		it("Then updateBusinessFunctionCollection should be called and business Function array should be populated.", function () {
			expect(systemMessagesController.systemMessage.businessFunction[0].id).toEqual(1);
			expect(systemMessagesController.systemMessage.businessFunction[0].name).toEqual("khan");
		});

	});

	describe("When Change Page method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "Intermittent",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1,
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			}],
			"businessFunction": {
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			},
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});

			systemMessagesController.showModal("Update", systemMessage);
			systemMessagesController.changePage();
		});

		it("Then updateMessagePerPageCount should be called and the current page should be 0.", function () {
			expect(systemMessagesController.currentPage).toEqual(1);
		});
	});

	describe("When load Next Page method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "SystemDown",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1,
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			}],
			"businessFunction": {
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			},
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});

			systemMessagesController.showModal("Update", systemMessage);
			spyOn(systemMessagesController, "changePage").and.callThrough();
			systemMessagesController.loadNextPage();
		});

		it("Then currentPage Value should be set.", function () {
			expect(systemMessagesController.currentPage).toEqual(1);
		});

		it("Then changePage should be called.", function () {
			expect(systemMessagesController.changePage).toHaveBeenCalled();
		});
	});

	describe("When load Previous Page method is called", () => {
		var date = new Date();
		var result;
		momentObject = this.moment(date);
		var systemMessage = {
			"id": "1",
			"messageType": "SystemDown",
			"message": "Intermittent issue",
			"businessCapability": [{
				"Profile": "Profile",
				"id": 1,
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			}],
			"businessFunction": {
				"businessFunctionCollection": [{
					"id": 1,
					"name": "khan"
				}]
			},
			"startTime": this.moment(date),
			"startTimeString": "2017-04-04 12:30",
			"endTime": this.moment(date),
			"endTimeString": "2017-04-05 12:30",
			"createdOn": this.moment(date),
			"createdBy": "abgul@microsoft.com",
			"lastModifiedBy": "ch@microsoft.com"
		};

		beforeEach(function () {
			timeZoneHelper.getCurrentPacificDateTime = jasmine.createSpy("getCurrentPacificDateTime").and.callFake(function (a) {
				return momentObject;
			});

			systemMessagesController.showModal("Update", systemMessage);
			spyOn(systemMessagesController, "changePage").and.callThrough();
			systemMessagesController.loadPrevPage();
		});

		it("Then currentPage Value should be set.", function () {
			expect(systemMessagesController.currentPage).toEqual(0);
		});

		it("Then changePage should be called.", function () {
			expect(systemMessagesController.changePage).toHaveBeenCalled();
		});
	});
});

