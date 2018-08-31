/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {AuthorNotificationController,AuthorNotificationConfirmationController} from '../js/controllers/authorNotificationController';
import { CommonUtils } from '../js/utils/CommonUtils';
declare var angular:any;
describe("Given AuthorNotificationController", function () {
	var $scope, $rootScope, uibModal, userProfileService, fxpLoggerService, fxpRouteService, notificationStore, fxpMessage, fxpConfigurationService, $q, authorNotificationController, $timeout, fxpUIConstants, pageLoaderService, authorNotificationConstants, $window, personalizationService, authorNotificationRoleGroupHelper;
	var Audience = [
		{
			"Type": "Role",
			"DisplayText": "Role groups and roles"
		},
		{
			"Type": "User",
			"DisplayText": "Individual users"
		}
	];
	var roleGroupDetails = [
		{
			"RoleGroupId": 1,
			"RoleGroupName": "Delivery Manager",
			"BusinessRoles": [
				{
					"BusinessRoleId": 73,
					"BusinessRoleName": "Project Manager"
				},
				{
					"BusinessRoleId": 89,
					"BusinessRoleName": "Services Delivery Manager"
				},
				{
					"BusinessRoleId": 47,
					"BusinessRoleName": "Intl Project Manager"
				}
			]
		},
		{
			"RoleGroupId": 4,
			"RoleGroupName": "Leader",
			"BusinessRoles": [
				{
					"BusinessRoleId": 32,
					"BusinessRoleName": "CVP"
				},
				{
					"BusinessRoleId": 90,
					"BusinessRoleName": "Services Leader"
				},
				{
					"BusinessRoleId": 29,
					"BusinessRoleName": "Country General Manager"
				}
			]
		}
	];
	beforeEach(angular.mock.module('FxPApp'));
	beforeEach(angular.mock.module('ui.router'));
	beforeEach(function () {
		var propBag = function () {
			return {
				addToBag: function (a, b) {
					console.log('propbag =>' + a + ':' + b);
				}
			};
		};
		angular.mock.module(function ($provide) {
			$provide.service("$uibModal", function () {
				this.open = jasmine.createSpy("open").and.callFake(function () {
					return {
						result: {
							then: function (callback) {
								return callback({ "Success": true });
							}
						}
					};
				});
			});
			$provide.service("FxpConfigurationService", function () {
				this.FxpAppSettings = {
					"FxPAdminName": "FxPAdmin",
					"UPNCorpnet": "@microsoft.com",
					"UPNPartner": "@partners.microsoft.net"
				};
			});
			$provide.service("UserProfileService", function () {
				this.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({ data: [{ Test: "Test" }] });
						}
					};
				});
			});
			$provide.service("NotificationStore", function () {
				this.publishNotifications = jasmine.createSpy("getRoleGroupDetails").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({ "data": [{ "PublishedUtcDate": "2017-06-20" }] });
						}
					};
				});
				this.publishNotificationsRolesRoleGroup = jasmine.createSpy("getRoleGroupDetails").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({ "data": [{ "PublishedUtcDate": "2017-06-20" }] });
						}
					};
				});
			});
			$provide.service("AuthorNotificationRoleGroupHelper", function () {
				this.manageRoleItems = jasmine.createSpy("manageRoleItems").and.callFake(function (a) {
					this.selectedRoles.push(29);
					this.selectedRoleGroups.push(3, 1);
				});
				this.manageRoleGroupItems = jasmine.createSpy("manageRoleGroupItems").and.callFake(function (a) {
					this.selectedRoles.push(29);
					this.selectedRoleGroups.push(3, 1);
				});
				this.selectedRolesforAddButton = [];
				this.selectedRolesforRemoveButton = [];
				this.selectedRoles = [29];
				this.selectedRoleGroups = [];
				this.isRolesRoleGroupAvailableToAdd = jasmine.createSpy("isRolesRoleGroupAvailableToAdd").and.callFake(function (a) {
					return true;
				});
				this.isRolesRoleGroupAvailableToRemove = jasmine.createSpy("isRolesRoleGroupAvailableToRemove").and.callFake(function (a) {
					return true;
				});
				this.resetSelectedRolesAddButton = jasmine.createSpy("resetSelectedRolesAddButton").and.callFake(function (a) {
					return true;
				});
				this.resetSelectedRolesRemoveButton = jasmine.createSpy("resetSelectedRolesRemoveButton").and.callFake(function (a) {
					return true;
				});
				this.resetSelectedRolesRoleGroupArray = jasmine.createSpy("resetSelectedRolesRoleGroupArray").and.callFake(function (a) {
					return true;
				});
				this.addRemoveRolesRoleGroup = jasmine.createSpy("addRemoveRolesRoleGroup").and.callFake(function (a) {
					return [];
				});
				this.isRolesInReciepientList = jasmine.createSpy("isRolesInReciepientList").and.callFake(function (a) {
					return true;
				});
			});
			$provide.service("PersonalizationService", function () {
				this.getRoleGroupDetails = jasmine.createSpy("publishNotifications").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({
								"data": roleGroupDetails
							});
						}
					};
				});
			});
			$provide.service("FxpLoggerService", function () {
				this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
					console.log(a + ' - ' + b);
					return propBag();
				});
				this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
					console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
				});
				this.logEvent = jasmine.createSpy("logEvent ").and.callFake(function (a, b, c) {
					console.log('logEvent  : ' + a + ',' + b + ',' + c);
				});
				this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function (a) {
					console.log('logPageLoadMetrics  : ' + a);
				});
			});
			$provide.service("FxpMessageService", function () {
				this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
					console.log('addMessage: ' + a + '' + b);
				});
			});
			$provide.service("FxpRouteService", function () {
				this.navigatetoSpecificState = jasmine.createSpy("navigatetoSpecificState").and.callFake(function (a, b) {
					console.log('navigatetoSpecificState: ' + a + '' + b);
				});
			});
			$provide.service("PageLoaderService", function () {
				this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function (a) {
					console.log(a);
				});
				this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a) {
					console.log(a);
				});
			});
			$provide.service("AuthorNotificationConstant", function () {
				return {
					ConfirmationOptions: {
						templateUrl: "../../templates/author-notification/confirmationPopup.html",
						windowClass: "author-notification-confirmation-popup",
						keyboard: false,
						backdrop: "static"
					}
				};
			});
			fxpUIConstants = {
				"UIMessages": {
					AuthorNotificationPublishServiceError: {
						ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
						ErrorMessageTitle: "An Error Ocurred while fetching Notifications."
					},
					AuthorNotificationProfileServiceError: {
						ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
						ErrorMessageTitle: "An Error Ocurred while fetching Unread Notifications count."
					},
					AuthorNotificationProfileMissing: {
						ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
						ErrorMessageTitle: "An Error Ocurred while Deleting Notification."
					},
					GeneralExceptionError: {
						ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
						ErrorMessageTitle: "An Error Ocurred while Deleting Notification."
					},
					RoleGroupsPersonalisationExceptionError: {
						ErrorMessage: "Notification service is down. Please create a support ticket for this issue.",
						ErrorMessageTitle: "An Error Ocurred while Deleting Notification."
					},
					"AuthorNotificationPublishRoleGroupServiceError": {
						"ErrorMessage": "Author notification was not successful. Please retry.",
						"ErrorMessageTitle": "An Error occured while publishing notification."
					},
					"AuthorNotificationPublishUnauthorizedError": {
						"ErrorMessage": "An Error Occurred and publish notification was not successful. Please try again.",
						"ErrorMessageTitle": "An Error occured while publishing notification."
					}
				},
				"UIStrings": {
					AuthorNotificationStrings: {
						SuccessMessage: "Notification sent successfully."
					}
				}
			};
		});
	});
	beforeEach(angular.mock.inject(function (_$rootScope_, FxpConfigurationService, NotificationStore, FxpLoggerService, FxpMessageService, UserProfileService, FxpRouteService, _$timeout_, _$q_, _$controller_, $uibModal, PageLoaderService, PersonalizationService, _$window_, AuthorNotificationRoleGroupHelper, AuthorNotificationConstant) {
		$scope = _$rootScope_.$new();
		$rootScope = _$rootScope_;
		uibModal = $uibModal;
		$rootScope.fxpUIConstants = fxpUIConstants;
		fxpConfigurationService = FxpConfigurationService;
		notificationStore = NotificationStore;
		fxpLoggerService = FxpLoggerService;
		fxpMessage = FxpMessageService;
		userProfileService = UserProfileService;
		fxpRouteService = FxpRouteService;
		$timeout = _$timeout_;
		$q = _$q_;
		authorNotificationController = _$controller_;
		pageLoaderService = PageLoaderService;
		personalizationService = PersonalizationService;
		authorNotificationConstants = AuthorNotificationConstant;
		$window = _$window_;
		authorNotificationRoleGroupHelper = AuthorNotificationRoleGroupHelper;
	}));
	describe("When AuthorNotificationController is loaded", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
		});
		it("then slected audience type should be empty", function () {
			expect(controller.selectedAudienceType).toEqual(null);
		});
		it("then slected users should be empty", function () {
			expect(controller.selectedUsers).toEqual([]);
		});
		it("then notification message should be empty", function () {
			expect(controller.notificationMessage).toEqual("");
		});
		it("then pervious audience type should be empty", function () {
			expect(controller.previousAudienceType).toEqual(null);
		});
	});
	describe("When AuthorNotificationController is loaded and $stateChangeStart is fired", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			spyOn(controller, "confirmNavigation").and.callThrough();
			controller.notificationMessage = "Test";
			$rootScope.$broadcast('$stateChangeStart', "Test", { Test: "Test" }, "", {});
		});
		it('confirmNavigation to be called', function () {
			expect(controller.confirmNavigation).toHaveBeenCalled();
		});
	});
	describe("searchUser method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.searchUser("abc");
		});
		it("searchProfile is to be called", function () {
			expect(userProfileService.searchProfile).toHaveBeenCalled();
		});
		it("typeAheadHasError is to be false", function () {
			expect(controller.typeAheadHasError).toEqual(false);
		});
		it("typeAheadErrorMessage is to be empty", function () {
			expect(controller.typeAheadErrorMessage).toEqual("");
		});
		it("logEvent is to be called", function () {
			expect(fxpLoggerService.logEvent).toHaveBeenCalled();
		});
	});
	describe("searchUser method is called and it does not return data", function () {
		var controller;
		beforeEach(function () {
			userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
				return {
					then: function (callback) {
						return callback({ data: [] });
					}
				};
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.searchUser("abc");
		});
		it("searchProfile is to be called", function () {
			expect(userProfileService.searchProfile).toHaveBeenCalled();
		});
		it("typeAheadHasError is to be true", function () {
			expect(controller.typeAheadHasError).toEqual(true);
		});
		it("typeAheadErrorMessage is not empty", function () {
			expect(controller.typeAheadErrorMessage).not.toEqual("");
		});
		it("logEvent is to be called", function () {
			expect(fxpLoggerService.logEvent).toHaveBeenCalled();
		});
	});
	describe("searchUser method is called and it throws error with error code 112", function () {
		var controller;
		beforeEach(function () {
			userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
				var defer = $q.defer();
				var error = {
					data: { ErrorCode: 112 }
				};
				defer.reject(error);
				return defer.promise;
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.searchUser("abc");
			$timeout.flush();
		});
		it("searchProfile is to be called", function () {
			expect(userProfileService.searchProfile).toHaveBeenCalled();
		});
		it("typeAheadHasError is to be true", function () {
			expect(controller.typeAheadHasError).toEqual(true);
		});
		it("typeAheadErrorMessage is not empty", function () {
			expect(controller.typeAheadErrorMessage).not.toEqual("");
		});
		it("logEvent is to be called", function () {
			expect(fxpLoggerService.logEvent).toHaveBeenCalled();
		});
	});
	describe("searchUser method is called and it throws error", function () {
		var controller;
		beforeEach(function () {
			userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
				var defer = $q.defer();
				var error = {
					data: { ErrorCode: 100 }
				};
				defer.reject(error);
				return defer.promise;
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.searchUser("abc");
			$timeout.flush();
		});
		it("searchProfile is to be called", function () {
			expect(userProfileService.searchProfile).toHaveBeenCalled();
		});
		it("typeAheadHasError is to be true", function () {
			expect(controller.typeAheadHasError).toEqual(true);
		});
		it("typeAheadErrorMessage is not empty", function () {
			expect(controller.typeAheadErrorMessage).not.toEqual("");
		});
		it("logEvent is to be called", function () {
			expect(fxpLoggerService.logError).toHaveBeenCalled();
		});
	});
	describe("addUser method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.selectedUsers = [{
				Alias: "TestUser1",
				Domain: "corpnet",
				EmailName: "TestUser1"
			}];;
			controller.addUser({ EmailName: "TestUser" });
		});
		it("selectedUsers is not to be empty", function () {
			expect(controller.selectedUsers.length).not.toEqual(0);
		});
		it("selectedUsers is not to be empty", function () {
			expect(controller.typeAheadValue).toEqual("");
		});
	});
	describe("removeUser  method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.selectedUsers = [{
				Alias: "TestUser1",
				Domain: "corpnet",
				EmailName: "TestUser1"
			}];;
			controller.removeUser(0);
		});
		it("selectedUsers is not to be empty", function () {
			expect(controller.selectedUsers.length).toEqual(0);
		});
	});
	describe("confirmNavigation method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.confirmNavigation();
		});
		it("then slected users should be empty", function () {
			expect(controller.selectedUsers).toEqual([]);
		});
		it("then notification message should be empty", function () {
			expect(controller.notificationMessage).toEqual("");
		});
	});
	describe("leaveAuthorNotification method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.toState = "Test";
			controller.toParams = { test: "test" };
			controller.leaveAuthorNotification();
		});
		it("then slected users should be empty", function () {
			expect(controller.selectedAudienceType).toEqual(null);
		});
		it("then navigatetoSpecificState should be called", function () {
			expect(fxpRouteService.navigatetoSpecificState).toHaveBeenCalled();
		});
	});
	describe("publishNotification  method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.selectedAudienceType = Audience[1];
			controller.selectedUsers = [{
				Alias: "TestUser1",
				Domain: "corpnet",
				EmailName: "TestUser1"
			}];
			controller.notificationMessage = "Test";
			controller.publishNotification();
			$timeout.flush();
		});
		it("then addMessage should be called", function () {
			expect(fxpMessage.addMessage).toHaveBeenCalled();
		});
		it("then logEvent should be called", function () {
			expect(fxpLoggerService.logEvent).toHaveBeenCalled();
		});
	});
	describe("publishNotification  method is called and publishNotifications of notification store throws error", function () {
		var controller;
		beforeEach(function () {
			notificationStore.publishNotifications = jasmine.createSpy("publishNotifications").and.callFake(function (a) {
				var defer = $q.defer();
				var error = {
					message: "Test"
				};
				defer.reject(error);
				return defer.promise;
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.selectedAudienceType = Audience[1];
			controller.selectedUsers = [{
				Alias: "TestUser1",
				Domain: "corpnet",
				EmailName: "TestUser1"
			}];
			controller.notificationMessage = "Test";
			controller.publishNotification();
			$timeout.flush();
		});
		it("then addMessage should be called", function () {
			expect(fxpMessage.addMessage).toHaveBeenCalled();
		});
		it("then logEvent should be called", function () {
			expect(fxpLoggerService.logError).toHaveBeenCalled();
		});
	});
	describe("When addRolesRoleGroupNotification method calling selected parent to be added with child links", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				},
				{
					"RoleGroupId": 4,
					"RoleGroupName": "Leader",
					"isParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 32,
							"BusinessRoleName": "CVP",
							"isChildSelected": true,
						},
						{
							"BusinessRoleId": 90,
							"BusinessRoleName": "Services Leader",
							"isChildSelected": true,
						}
					]
				}
			];
			controller.addRolesRoleGroupNotification();
		});
		it('Then AuthorNotificationRoleGroupHelper.addRemoveRolesRoleGroup should be called', function () {
			$scope.$apply();
			expect(authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup).toHaveBeenCalled();
		});
	});
	describe("When removeRolesRoleGroupNotification method calling selected parent to be added with child links", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": false,
					"isRecipientsItem": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				},
				{
					"RoleGroupId": 4,
					"RoleGroupName": "Leader",
					"isParentSelected": true,
					"isRecipientsItem": true,
					"isSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 32,
							"BusinessRoleName": "CVP",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						},
						{
							"BusinessRoleId": 90,
							"BusinessRoleName": "Services Leader",
							"isChildSelected": true,
							"isRecipientsItem": true,
							"isRecepientsChildSelected": true
						}
					]
				}
			];
			controller.removeRolesRoleGroupNotification();
		});
		it('Then AuthorNotificationRoleGroupHelper.addRemoveRolesRoleGroup should be called', function () {
			$scope.$apply();
			expect(authorNotificationRoleGroupHelper.addRemoveRolesRoleGroup).toHaveBeenCalled();
		});
	});
	describe("When selectedRoleGroupRecepientsItems method is called and parent is selected", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true,
					"isRecipientsItem": true,
					"isSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager",
							"isRecipientsItem": true,
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager",
							"isRecipientsItem": true,
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			];
			controller.selectedRoleGroupRecepientsItems(controller.roleGroupDetails[0], true);
		});
		it('Then all items should be selected including parents and child', function () {
			$scope.$apply();
			expect(controller.isRemoveButtonEnabled).toEqual(true);
		});
	});
	describe("When selectedRolesRoleGroupItems method is called parent is selected", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.roleGroupDetails = [
				{
					"RoleGroupId": 1,
					"RoleGroupName": "Delivery Manager",
					"isParentSelected": true,
					"BusinessRoles": [
						{
							"BusinessRoleId": 73,
							"BusinessRoleName": "Project Manager"
						},
						{
							"BusinessRoleId": 89,
							"BusinessRoleName": "Services Delivery Manager"
						},
						{
							"BusinessRoleId": 47,
							"BusinessRoleName": "Intl Project Manager"
						}
					]
				}
			];
			controller.selectedRolesRoleGroupItems(controller.roleGroupDetails[0], null);
		});
		it('Then isAddButtonEnabled should be enabled', function () {
			$scope.$apply();
			expect(controller.isAddButtonEnabled).toEqual(true);
		});
	});
	describe("When getRoleGroupDetails  method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.getRoleGroupDetails();
		});
		it('Then all child items should be added along with parent and checkbox should be checked', function () {
			$scope.$apply();
			expect(controller.roleGroupDetails.length).toEqual(2);
		});
	});
	describe("When getRoleGroupDetails  method is called and it throws error", function () {
		var controller;
		beforeEach(function () {
			personalizationService.getRoleGroupDetails = jasmine.createSpy("publishNotifications").and.callFake(function (a) {
				var defer = $q.defer();
				var error = {
					message: "Test",
					status: "404",
					statusText: "Test",
					config: {
						url: "test"
					}
				};
				defer.reject(error);
				return defer.promise;
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			controller.getRoleGroupDetails();
		});
		it('Then roleGroupDetails will be null', function () {
			$scope.$apply();
			expect(controller.roleGroupDetails.length).toEqual(0);
		});
		it('Then pageLoaderService will be called', function () {
			$scope.$apply();
			expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
		});
	});
	describe("When publishNotificationsRolesRoleGroup method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			spyOn(controller, "resetToIntialState");
			controller.authorNotificationRoleGroupHelper.selectedRoleGroups.push(roleGroupDetails[0]);
			controller.authorNotificationRoleGroupHelper.selectedRoles.push(roleGroupDetails[1].BusinessRoles[0], roleGroupDetails[1].BusinessRoles[1]);
			controller.publishNotificationRolesRoleGroup();
		});
		it('Then resetToIntialState will be called', function () {
			$scope.$apply();
			expect(controller.resetToIntialState).toHaveBeenCalled();
		});
	});
	describe("When publishNotificationRolesRoleGroup method is called and it throws error", function () {
		var controller;
		beforeEach(function () {
			notificationStore.publishNotificationsRoleaRoleGroup = jasmine.createSpy("publishNotificationsRoleaRoleGroup").and.callFake(function (a) {
				var defer = $q.defer();
				var error = {
					message: "Test",
					status: "404",
					statusText: "Test",
					config: {
						url: "test"
					}
				};
				defer.reject(error);
				return defer.promise;
			});
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			spyOn(controller, "resetToIntialState");
			controller.authorNotificationRoleGroupHelper.selectedRoleGroups.push(roleGroupDetails[0]);
			controller.authorNotificationRoleGroupHelper.selectedRoles.push(roleGroupDetails[1].BusinessRoles[0], roleGroupDetails[1].BusinessRoles[1]);
			controller.publishNotificationRolesRoleGroup();
		});
		it('Then resetToIntialState will be called', function () {
			$scope.$apply();
			expect(controller.resetToIntialState).toHaveBeenCalled();
		});
	});	
	describe("When pullFocusToElement  method is called in roleGroup block", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationController('AuthorNotificationController', {
				$scope: $scope,
				FxpConfigurationService: fxpConfigurationService,
				NotificationStore: notificationStore,
				UserProfileService: userProfileService,
				$timeout: $timeout
			});
			$scope.navItem = { isFocused: true };
			controller.pullFocusToElement("RoleGid1", $scope.navItem, "roleGroupList");
		});
		it('Then Fxp.Utils.CommonUtils.pullFocusToElemente will be called', function () {
			$scope.$apply();
			expect($scope.navItem.isFocused).toEqual(false);
		});
	});
});
describe("Given AuthorNotificationConfirmationController", function () {
	var uibModalInstance, authorNotificationConfirmationController;
	beforeEach(angular.mock.module('FxPApp'));
	beforeEach(angular.mock.module('ui.router'));
	beforeEach(function () {
		angular.mock.module(function ($provide) {
			$provide.service("$uibModalInstance", function () {
				this.dismiss = jasmine.createSpy("dismiss").and.callFake(function () {
					return {
						result: {
							then: function (callback) {
								return callback({ "Success": true });
							}
						}
					};
				});
				this.close = jasmine.createSpy("close").and.callFake(function () {
					return {
						result: {
							then: function (callback) {
								return callback({ "Success": true });
							}
						}
					};
				});
			});
		});
	});
	beforeEach(angular.mock.inject(function ($uibModalInstance, _$controller_) {
		uibModalInstance = $uibModalInstance;
		authorNotificationConfirmationController = _$controller_;
	}));
	describe("leave method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationConfirmationController('AuthorNotificationConfirmationController', {
				$uibModalInstance: uibModalInstance
			});
			controller.leave();
		});
		it("$uibModalInstance.dismiss is to be called", function () {
			expect(uibModalInstance.dismiss).toHaveBeenCalled();
		});
	});
	describe("stay method is called", function () {
		var controller;
		beforeEach(function () {
			controller = authorNotificationConfirmationController('AuthorNotificationConfirmationController', {
				$uibModalInstance: uibModalInstance
			});
			controller.stay();
		});
		it("$uibModalInstance.dismiss is to be called", function () {
			expect(uibModalInstance.close).toHaveBeenCalled();
		});
	});
});
