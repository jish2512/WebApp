/// <chutzpah_reference path="../testlink.js" />
import{LeftNavPersonalizationController}from '../js/controllers/leftNavPersonalizationController';
declare var angular:any;
describe("Given LeftNavPersonalizationController", () => {
    var $state;
    var $scope;
    var $rootScope;
    var $q;
    var $controller;
    var fxpLoggerService;
    var fxpMessageService;
    var personalizationAdminCntrl;
    var leftNavPersonalizationController;
    var pageLoaderService;
    var fxpContextService;
    var userInfoService;
    var userProfileService;
    var personalizationService;
    var deferredflag = true;
    var nodata = true;
    var witherrorcode = true;
    var deferred;
	var fxpRouteService;
	var notificationStore;
	var timeout;
	var fxpConfigurationService;
    var userData = { "alias": "v-jimazu", "firstName": "Jishnu", "middleName": null, "lastName": "Mazumdar", "displayName": "Jishnu Mazumdar", "preferredFirstName": null, "reportsTo": "vemami", "reportsToDisplayName": "Veera Mamilla", "businessDomain": null, "reportsToFullName": "Mamilla, Veera Reddy", "businessRoleId": 59, "seniority": null, "businessRole": "Non Services User", "standardTitle": "XR - MSR IT Operations", "email": "v-jimazu@microsoft.com", "roleGroupId": 5, "roleGroupName": "Non Services User", "fullName": "Jishnu Mazumdar", "businessRoleDisplayName": "Non Services User" };
    var selectedUser = { "Alias": "v-sekond", "RoleGroupID": 1, "DisplayName": "Seetha", "BusinessRole": "Manager", "BusinessRoleId": 59, "Domain": "corpnet"};
    var globalMasterNavList = {
        "data": {
            "result": [
                {
                    "isPersonalizationAllowed": false,
                    "children": null,
                    "id": 1,
                    "displayName": "Dashboard",
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
                    "children": [
                        {
                            "isPersonalizationAllowed": true,
                            "id": 16,
                            "displayName": "Resource Manager View",
                            "sortOrder": 1,
                            "parentId": 15
                        }, {
                            "id": 17,
                            "displayName": " Resource Test",
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
                    "isPersonaDefault": true
                },
                {
                    "id": 15,
                    "displayName": "Resource Management",
                    "hasChildren": true,
                    "sortOrder": 2,
                    "isPersonaDefault": false,
                    "children": [
                        {
                            "id": 16,
                            "displayName": "Resource Manager View",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "isPersonaDefault": false,
                            "parentId": 15
                        },
                        {
                            "id": 17,
                            "displayName": " Resource Test",
                            "hasChildren": false,
                            "sortOrder": 2,
                            "isPersonaDefault": true,
                            "parentId": 15
                        }]
                }]
        }
    };
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
                $provide.service("FxpRouteService", function () {
                    this.navigatetoSpecificState = jasmine.createSpy("navigatetoSpecificState").and.callFake(function (a, b) {
                        console.log('navigatetoSpecificState : ' + a + ', ' + b);
                    });
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

            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage : ' + a + ', ' + b);
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
            $provide.service("UserProfileService", function () {
                this.getBasicUserProfile = jasmine.createSpy("getBasicUserProfile").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback(
                                userData
                            );

                        }
                    }
                });

			});

            $provide.service("PersonalizationService", function () {
                this.getPersistedPersonalization = jasmine.createSpy("getPersistedPersonalization").and.callFake(function () {
                    return selectedUser ;
                });
                this.removePersistedUserPersonalization = jasmine.createSpy("removePersistedUserPersonalization").and.callFake(function () {
                    console.log("Remove Persisted User Personalization");
                });
                this.persistUserPersonalization = jasmine.createSpy("persistUserPersonalization").and.callFake(function (a, b) {
                    console.log("persistUserPersonalization" + a + b);
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
                this.savePersonalizedNavItems = jasmine.createSpy("getPersonalizedNavItems").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                "success"
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
            $provide.service("FxpContextService", function () {
                this.readContext = jasmine.createSpy("readContext").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    "Result": {
                                        "Id": "2",
                                        "DisplayName": "Resource Management",
                                        "HasChildren": true,
                                        "IsPersonaDefault": true,
                                        "Children": [
                                            {
                                                "Id": "3",
                                                "DisplayName": " Resource Manager View",
                                                "SortOrder": 1,
                                                "IsPersonaDefault": true
                                            },
                                            {
                                                "Id": "4",
                                                "DisplayName": "Resource Calendar",
                                                "SortOrder": 2,
                                                "IsPersonaDefault": true
                                            }
                                        ]
                                    }
                                });

                        }
                    }
                });
            });
            $provide.service("UserInfoService", function () {
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    console.log('getLoggedInUser');
                });
			});
			$provide.service("NotificationStore", function () {
				this.publishNotifications = jasmine.createSpy("publishNotifications").and.callFake(function (a) {
					return {
						then: function (callback) {
							return callback({ "data": [{ "PublishedUtcDate": "2017-06-20" }] });
						}
					}
				});
			});
			$provide.service("FxpConfigurationService", function () {
				this.FxpAppSettings = {
					"FxPAdminName": "FxPAdmin"
				};
			});
        });

        sessionStorage.setItem("seletedUserInfo", JSON.stringify(selectedUser));
    });

	beforeEach(angular.mock.inject(function (_$rootScope_, _$q_, _$state_, FxpLoggerService, _PageLoaderService_, _FxpMessageService_, PersonalizationService, _$controller_, _FxpContextService_, _UserInfoService_, _UserProfileService_, FxpRouteService, NotificationStore, _$timeout_, FxpConfigurationService) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $state = _$state_;
        fxpLoggerService = FxpLoggerService;
        pageLoaderService = _PageLoaderService_;
        fxpMessageService = _FxpMessageService_;
        personalizationService = PersonalizationService;
        fxpRouteService = FxpRouteService;
        fxpContextService = _FxpContextService_;
        userInfoService = _UserInfoService_;
        userProfileService = _UserProfileService_
        $controller = _$controller_;
        $q = _$q_;
		deferred = _$q_.defer();
		notificationStore = NotificationStore;
		timeout = _$timeout_;
		fxpConfigurationService = FxpConfigurationService;
    }));

    beforeEach(function () {
        jasmine.clock().install();
        $rootScope.fxpUIConstants = {
            UIMessages:
            {

                GeneralExceptionError:
                { ErrorMessage: 'System Error has occurred. Please try again. If the problem persists, please contact IT support.' },
                UserProfileDoesNotExist:
                { ErrorMessage: 'There are no profiles for the search criteria. Please enter a valid user name or alias to proceed.' },
                UserProfileBusinessRoleIdErrorMessage:
                { ErrorMessage: 'His profile is missing Business role association.' },
                UserProfilePersonaIdErrorMessage: { ErrorMessage: 'This profile is missing Persona association.' },
                UserNavigationListSaved: {
                    SuccessMessage: "User navigation saved for"
                },
                UserNavigationListNotSaved: {
                    ErrorMessage: "Submit was not successful. Please retry."

                },
                ErrorOccuredInUserSpecificLeftNav: {
                    ErrorMessage: "An Error Occurred and Configure user specific left nav was not successful. Please try again.",

                },
                roleGroupExceptionMessage: {
                    ErrorMessage: "Selected user's Navigation for RoleGroup is unavailable hence personalization is not possible, please contact IT support."
                },
                AuthanticationExceptionMessage: {
                    ErrorMessage: "You do not have sufficient privileges to perform this operation, please contact IT support."

				},
				AuthorNotificationPublishServiceError: {
					ErrorMessageTitle: "An error has occured while publishing notification."
				}
            },
            UIStrings: {
                AdminUIStrings: {
                    PersonalizeUserNavigation: "Personalize User Navigation",
                    InstructionalText: "Search for the user below whose navigation you would like to override.",
                    InstructionalTextPersonalizeScreen: "Use this screen to make changes to the user’s navigation by adding to or removing from the user navigation list.",
                    Placeholder: "Start typing user or alias",
                    Next: "Next",
                    UnsubmittedChangesAlertMessage: "Any unsubmitted changes will not be saved, would you like to exit anyway",
                    Cancel: "Cancel",
                    Submit: "Submit",
                    Yes: "Yes",
                    No: "No",
                    UserNavigationList: "User Navigation List",
                    GlobalNavigationMasterList: "Global Navigation Master List",
                    Add: "Add",
                    Remove: "Remove"
                }
            }
        };
    })
    afterEach(function () {
        jasmine.clock().uninstall();
    });
    describe("When LeftNavPersonalizationController Loaded", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
        })
        it('Then adminUIStrings should be defined', function () {
            jasmine.clock().tick(101);
            $scope.$apply();
            expect($scope.adminUIStrings).toBeDefined();
        });

    });

    describe("When getGlobalNavMasterList method calling and api returns data", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.personalizationUser = { "Alias": "v-sekond", "RoleGroupID": 1 };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });

            leftNavPersonalizationController.getGlobalNavMasterList();
        })
        it('Then it should get the Global Navigation Master List', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.globalNavMasterList.length).toBeGreaterThan(0);
        });

    });

    describe("When getGlobalNavMasterList method calling and api returns exception", () => {
        var errwithoutcode;
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            // #region 'Mock Global Navigation L0L1 Data'
            personalizationService.getMasterLeftNavItems = jasmine.createSpy("getMasterLeftNavItems").and.callFake(function () {
                var defer = $q.defer();
                errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });

            $scope.personalizationUser = { "Alias": "v-sekond", "RoleGroupID": 1 };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            spyOn(leftNavPersonalizationController, "showErrorMsgNavigateToUserLookUp").and.callThrough();
            leftNavPersonalizationController.getGlobalNavMasterList();
        })

        it('Then it should call showErrorMsgNavigateToUserLookUp function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.showErrorMsgNavigateToUserLookUp).toHaveBeenCalled();
        });
    });

    describe("When getUserNavList method  calling and api returns data", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};

            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.globalNavMasterList = globalMasterNavList.data.result;
            leftNavPersonalizationController.getUserNavList("v-sekond", 1001);
        })
        it('Then add the user Navigation Preferences Data to userNavPersonalizationList', function () {
            expect(leftNavPersonalizationController.userNavPersonalizationList.length).toBeGreaterThan(0);
        });
        it('Then it should call LogInformation', function () {
            expect(leftNavPersonalizationController.fxpLogger.logInformation).toHaveBeenCalledWith("Fxp.LeftNavPersonalizationController", "PersonalizationService GetPersonalizedNavItems Success");
        });

    });

    describe("When getUserNavList method  calling and api returns exception", () => {
        var errwithoutcode;
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};

            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            personalizationService.getPersonalizedNavItems = jasmine.createSpy("getPersonalizedNavItems").and.callFake(function (a, b) {
                var defer = $q.defer();
                errwithoutcode = { data: { ErrorCode: '' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            spyOn(leftNavPersonalizationController, "showErrorMsgNavigateToUserLookUp").and.callThrough();
            spyOn(leftNavPersonalizationController, "navigateToUserLookup").and.callThrough();
            leftNavPersonalizationController.getUserNavList();
        })
        it('Then it should call showErrorMsgNavigateToUserLookUp function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.showErrorMsgNavigateToUserLookUp).toHaveBeenCalled();
        });
        it('Then it should call navigateToUserLookup function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.navigateToUserLookup).toHaveBeenCalled();
        });
        it('Then it should call fxpMessage.addMessage function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.fxpMessage.addMessage).toHaveBeenCalledWith("System Error has occurred. Please try again. If the problem persists, please contact IT support.", "error");
        });
        it('Then it should call fxpLogger.logError function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.fxpLogger.logError).toHaveBeenCalled();
        });

    });
    describe("When getUserPersonalization  method  calling and its  returns user", () => {
        var errwithoutcode;
        beforeEach(function () {
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.getUserPersonalization();
        })
        it('Then personalizationUser should be defined', function () {
            $scope.$apply();
            expect($scope.personalizationUser).toBeDefined();
        });
    });
    describe("When getUserPersonalization  method  calling and its  returns null", () => {
        var errwithoutcode;
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            personalizationService.getPersistedPersonalization = jasmine.createSpy("getPersistedPersonalization").and.callFake(function (a) {
                return undefined;
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            spyOn(leftNavPersonalizationController, "navigateToUserLookup").and.callThrough();
            leftNavPersonalizationController.getUserPersonalization();
        })

        it('Then it should call navigateToUserLookup function ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.navigateToUserLookup).toHaveBeenCalled();
        });
    });
    describe("When mergeGlobalAndUserPreferenceNavigationList is called", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};

            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            spyOn(leftNavPersonalizationController, "setFocusToGlobalNavMasterItem").and.callThrough();
            spyOn(leftNavPersonalizationController, "logPageLoadMetricsForCurrentPage").and.callThrough();
            leftNavPersonalizationController.globalNavMasterList = globalMasterNavList.data.result;
            leftNavPersonalizationController.userNavPersonalizationList = personaNavList.data.result;
            leftNavPersonalizationController.mergeGlobalAndUserPreferenceNavigationList();
        });
        it("Then it should merge two data", () => {
            expect(leftNavPersonalizationController.setFocusToGlobalNavMasterItem).toHaveBeenCalledWith(true);
        });
        it("Then logPageLoadMetricsForCurrentPage method should have been called", () => {
            expect(leftNavPersonalizationController.logPageLoadMetricsForCurrentPage).toHaveBeenCalled();
        });
    });


    describe("When mergeGlobalAndUserPreferenceNavigationList gets called", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var store = {};
            var globalMasterNavItemsList = [               
                {
                    "id": 101,
                    "displayName": "Profile",
                    "hasChildren": false,
                    "sortOrder": 3,
                    "parentId": null,
                    "isPersonalizationAllowed": true,
                    "applicableDevice": "All"
                }, {
                    "id": 400,
                    "displayName": "Help",
                    "hasChildren": false,
                    "sortOrder": 4,
                    "parentId": null,
                    "isPersonalizationAllowed": false,
                    "applicableDevice": "Mobile"
                }];
            var personaNavItemsList = [{
                "id": 101,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 3,
                "parentId": null,
                "isPersonalizationAllowed": true,
                "isPersonaDefault": false,
                "applicableDevice": "All"
            },{
                    "id": 400,
                    "displayName": "Help",
                    "hasChildren": false,
                    "sortOrder": 4,
                    "parentId": null,
                    "isPersonalizationAllowed": false,
                    "isPersonaDefault": false,
                    "applicableDevice":"Mobile"
            }];
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            spyOn(leftNavPersonalizationController, "setFocusToGlobalNavMasterItem").and.callThrough();
            leftNavPersonalizationController.globalNavMasterList = globalMasterNavItemsList;
            leftNavPersonalizationController.userNavPersonalizationList = personaNavItemsList;
            leftNavPersonalizationController.mergeGlobalAndUserPreferenceNavigationList();
        });
        it("Then isUserLeftNavItem should be defined for non mobile items", () => {
            expect($scope.navigationList[0].isUserLeftNavItem).toBeDefined();
        });
        it("Then isUserLeftNavItem should not be defined for mobile items", () => {
            expect($scope.navigationList[1].isUserLeftNavItem).not.toBeDefined();
        });
    });

    describe("When selectedGlobalLeftNavItems method calling and parent item selected", () => {
        var parentItem;  
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            parentItem = {
                "id": "15",
                "displayName": "Profile",
                "hasChildren": true,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "parentId": true,
                "children": [
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": false,
                        "id": "16",
                        "displayName": "Skill Assessment",
                        "sortOrder": 1,
                        "isPersonalizationAllowed": true
                    },
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": false,
                        "id": "17",
                        "displayName": "Test Assessment",
                        "sortOrder": 2,
                        "isPersonalizationAllowed": true
                    }
                ]
            };
            var childItem = null;
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = [parentItem];
            leftNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        })
        it('Then child items should select under parent/L0', function () {
            $scope.$apply();
            expect(parentItem.children[0].isChildSelected).toEqual(true);

        });
        it('Then Add button should enable', function () {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(true);
        });

    });
    describe("When selectedGlobalLeftNavItems method calling and child item selected", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var parentItem = {
                "id": "15",
                "displayName": "Profile",
                "hasChildren": true,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": false,
                "parentId": true,
                "children": [
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": true,
                        "id": "16",
                        "displayName": "Skill Assessment",
                        "sortOrder": 1,
                        "isPersonalizationAllowed": true
                    },
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": false,
                        "id": "17",
                        "displayName": "Test Assessment",
                        "sortOrder": 2,
                        "isPersonalizationAllowed": true
                    }
                ]
            }
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": true,
                "id": "16",
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = [parentItem];
            leftNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        })
        it('Then Add button should enable', function () {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(true);
        });

    });

    describe("When selectedGlobalLeftNavItems method calling and Parent existing but one or more child not exists in UserNavList", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var parentItem = {
                "id": "15",
                "displayName": "Profile",
                "hasChildren": true,
                "sortOrder": 5,
                "isPersonaDefault": false,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "parentId": true,
                "children": [
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": true,
                        "id": "16",
                        "displayName": "Skill Assessment",
                        "sortOrder": 1,
                        "isPersonalizationAllowed": true
                    },
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": true,
                        "id": "17",
                        "displayName": "Test Assessment",
                        "sortOrder": 2,
                        "isPersonalizationAllowed": true
                    }
                ]
            }
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": true,
                "id": "16",
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = [parentItem];
            leftNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        })
        it('Then Add button should enable', function () {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(true);
        });

    });

    describe("When selectedGlobalLeftNavItems method calling and we uncheck a child item from Global Nav List", () => {
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            var parentItem = {
                "id": 15,
                "displayName": "Profile",
                "hasChildren": true,
                "sortOrder": 5,
                "isPersonaDefault": false,
                "isPersonalizationAllowed": true,
                "isParentSelected": false,
                "parentId": null,
                "children": [
                    {
                        "parentId": 15,
                        "children": null,
                        "isChildSelected": false,
                        "id": 16,
                        "displayName": "Skill Assessment",
                        "sortOrder": 1,
                        "isPersonalizationAllowed": true
                    }
                ]
            }
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": false,
                "id": 16,
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            }; 
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            }); 
            $scope.navigationList = [parentItem];
            leftNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        })
        it('Then child item should be add to  selectedNavItems', function () {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(false);

        });

    });

    describe("When selectedUserNavItems  method calling and Parent items selected", () => {
        var parentItem = {
            "id": "15",
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": true,
            "isSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": "16",
                    "isPersonaDefault": false,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isPersonalizationAllowed": true,
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": "17",
                    "isPersonaDefault": false,
                    "displayName": "Test Assessment",
                    "sortOrder": 2,
                    "isPersonalizationAllowed": true
                }
            ]
        }
        var navList = [{
            "id": "15",
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": true,
            "isSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": "16",
                    "isPersonaDefault": false,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isPersonalizationAllowed": true,
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": "17",
                    "isPersonaDefault": false,
                    "displayName": "Test Assessment",
                    "sortOrder": 2,
                    "isPersonalizationAllowed": true
                }
            ]
        }];
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = navList;
            leftNavPersonalizationController.selectedUserNavItems(parentItem, true);
        })
        it('Then all child items should be selected', function () {
            $scope.$apply();
            expect(parentItem.children[0].isChildSelected).toEqual(true);
            expect($scope.isRemovePersonalizeAllow).toEqual(true);

        });
    });
    describe("When selectedUserNavItems  method calling and all child items selected", () => {
        var parentItem = {
            "id": "15",
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": true,
            "isSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isSelected": true,
                    "id": "16",
                    "isPersonaDefault": false,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isPersonalizationAllowed": true,
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isSelected": true,
                    "id": "17",
                    "isPersonaDefault": false,
                    "displayName": "Test Assessment",
                    "sortOrder": 2,
                    "isPersonalizationAllowed": true
                }
            ]
        }
        var navList = [{
            "id": "15",
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": true,
            "isSelected": false,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isSelected": true,
                    "id": "16",
                    "isPersonaDefault": false,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isPersonalizationAllowed": true,
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isSelected": true,
                    "id": "17",
                    "isPersonaDefault": false,
                    "displayName": "Test Assessment",
                    "sortOrder": 2,
                    "isPersonalizationAllowed": true
                }
            ]
        }];
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = navList;
            spyOn(leftNavPersonalizationController, "setFocusToGlobalNavMasterItem").and.callThrough();
            leftNavPersonalizationController.selectedUserNavItems(parentItem, false);
        })
        it('Then parent item should be selected', function () {
            $scope.$apply();
            expect(parentItem.isSelected).toEqual(true);
            expect($scope.isRemovePersonalizeAllow).toEqual(true);

        });
        it("Then setFocusToGlobalNavMasterItem is called with false", () => {
            expect(leftNavPersonalizationController.setFocusToGlobalNavMasterItem).toHaveBeenCalledWith(false);
        });

    });

    describe("When addToUserNavPersonalizationList method calling selected parent to be added with child links", () => {
        var navList = [{
            "id": 15,
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "isParentSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": 16,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": 17,
                    "displayName": "Test Assessment",
                    "sortOrder": 2
                }
            ]
        }];
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = navList;
            leftNavPersonalizationController.addToUserNavPersonalizationList();
        })
        it('Then child items should be push  to personalizedUserNav Add List ', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.personalizedUserNav.AddedItems.length).toBeGreaterThan(0);
        });

    });

    describe("When call addToUserNavPersonalizationList method and there is no child item", () => {

        var navList = [{
            "id": 15,
            "displayName": "Profile",
            "hasChildren": false,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": 15,
            "isParentSelected": true,
            "children": null
        }];

        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = navList;
            leftNavPersonalizationController.addToUserNavPersonalizationList();
        })
        it('Then child item should be push  to personalizedUserNav', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.personalizedUserNav.AddedItems.length).toBeGreaterThan(0);
        });

    });

    describe("When removeUserNavPreferences  method calling with parent and child item", () => {
        var parentItem = [{
            "id": 15,
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isUserLeftNavItem": true,
            "isParentSelected": true,
            "isPersonaDefault": false,
            "parentId": true,
            "isSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": false,
                    "id": 16,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isUserLeftNavItem": true,
                    "isPersonaDefault": false,
                    "isSelected": true
                },
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": false,
                    "id": 17,
                    "displayName": "Test Assessment",
                    "sortOrder": 2,
                    "isUserLeftNavItem": true,
                    "isPersonaDefault": false,
                    "isSelected": true
                }
            ]
        }];

        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            $scope.personalizationUser = { "Alias": "v-sekond" };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = parentItem;
            leftNavPersonalizationController.removeUserNavPresonalization();
        })
        it('Then selected items should be removed from userNavPreferenceList', function () {
            expect($scope.navigationList[0].isUserLeftNavItem).toBeUndefined();
        });

    });
    describe("When removeUserNavPreferences  method calling with parent and no child item", () => {
        var parentItem = [{
            "id": 15,
            "displayName": "Profile",
            "hasChildren": false,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "isParentSelected": true,
            "isPersonaDefault": false,
            "isUserLeftNavItem": true,
            "parentId": true,
            "isSelected": true,
            "children": null
        }];

        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            $scope.personalizationUser = { "Alias": "v-sekond" };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            $scope.navigationList = parentItem;
            leftNavPersonalizationController.removeUserNavPresonalization();
        })
        it('Then selected items should be removed from userNavPreferenceList', function () {
            $scope.$apply();
            expect($scope.navigationList[0].isUserLeftNavItem).toBeUndefined();
        });

    });

    describe("When submitUserNavPreferences method  calling", () => {
        var personaUserNavList = {
            AddedItems: [{
                "id": 15,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "isPersonaDefault": false,
                "isUserLeftNavItem": true,
				"parentId": 15,
                "isSelected": true,
                "children": null
			}, {
				"id": 15,
				"displayName": "Profile",
				"hasChildren": false,
				"sortOrder": 5,
				"isPersonalizationAllowed": true,
				"isParentSelected": true,
				"isPersonaDefault": false,
				"isUserLeftNavItem": true,
				"parentId": 1,
				"isSelected": true,
				"children": null
			}], RemovedItems: [{
                "id": 16,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 6,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "isPersonaDefault": false,
                "isUserLeftNavItem": true,
				"parentId": 15,
                "isSelected": true,
                "children": null
            }]
        }
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            $scope.personalizationUser = { "Alias": "v-sekond", "displayName": "Seetha", "BusinessRole": "Manager" };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.personalizedUserNav = personaUserNavList;
            spyOn(leftNavPersonalizationController, "navigateToUserLookup").and.callThrough();
			spyOn(leftNavPersonalizationController, "logAdminTelemetry").and.callThrough();
			leftNavPersonalizationController.submitUserNavPresonalization();
			timeout.flush();
        })
        it('Then selected items should be saved', function () {            
            expect(leftNavPersonalizationController.fxpMessage.addMessage).toHaveBeenCalledWith("User navigation saved for Seetha - Manager", "success");
		});
        it('Then it should call logAdminTelemetry', function () {
            expect(leftNavPersonalizationController.logAdminTelemetry).toHaveBeenCalled();
        });
    });

    describe("When submitUserNavPreferences method  calling and it throws exception", () => {
        var errwithoutcode;
        var personaUserNavList = {
            AddedItems: [{
                "id": 15,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "isPersonaDefault": false,
                "isUserLeftNavItem": true,
                "parentId": true,
                "isSelected": true,
                "children": null
            }], RemovedItems: []
        }
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });
            personalizationService.savePersonalizedNavItems = jasmine.createSpy("getMasterLeftNavItems").and.callFake(function () {
                var defer = $q.defer();
                errwithoutcode = { data: { ErrorCode: '401' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            $scope.personalizationUser = { "Alias": "v-sekond", "DisplayName": "Seetha", "BusinessRole": "Manager" };
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.personalizedUserNav = personaUserNavList;

            leftNavPersonalizationController.submitUserNavPresonalization();
        })
        it('Then selected items should be saved', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.fxpMessage.addMessage).toHaveBeenCalled();
        });

    });

    describe("When manageUserNavParentItem gets called ", () => {
        var parentItem = {
            "id": 1,
            "displayName": "Profile",
            "hasChildren": true,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "parentId": null,
            "isParentSelected": true,
            "children": [
                {
                    "parentId": 15,
                    "children": null,
                    "isChildSelected": true,
                    "id": 16,
                    "displayName": "Skill Assessment",
                    "sortOrder": 1,
                    "isPersonalizationAllowed": true,
                }]
        };
        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.manageUserNavParentItem(parentItem, 'AddedItems');

        })
        it("Then it add item in personalIzation Nav List  ", function () {
            expect(leftNavPersonalizationController.personalizedUserNav.AddedItems.length).toBeGreaterThan(0);
        });
    });
    describe("When manageUserNavChildItem  gets called  with Remove param", () => {
        var personalizeObject = [{ "id": 15, "parentId": null, "action": "AddedItems" }];

        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.personalizedUserNavigationList = personalizeObject
            leftNavPersonalizationController.manageUserNavChildItem(15, 'RemovedItems');

        })
        it("Then it add item in personalIzation Nav List  ", function () {
            expect(leftNavPersonalizationController.personalizedUserNav.RemovedItems.length).toBeGreaterThan(0);
        });
    });

    describe("When manageUserNavChildItem  gets called  with Add param", () => {
        var personalizeObject = [{ "id": 15, "action": "RemovedItems" }];

        beforeEach(function () {
            spyOn($state, 'go').and.callFake(function (state, params) {
            });

            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.manageUserNavChildItem(20, 'AddedItems');

        })
        it("Then it add item in personalIzation Nav List  ", function () {
            expect(leftNavPersonalizationController.personalizedUserNav.AddedItems.length).toBeGreaterThan(0);
        });
    });

    describe("When logPageLoadMetricsForCurrentPage gets called", () => {     
        beforeEach(function () {          
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.logPageLoadMetricsForCurrentPage();

        })
        it("Then logPageLoadMetrics method of fxplogger should have been called  ", function () {
            expect(fxpLoggerService.logPageLoadMetrics).toHaveBeenCalled();
        });
    });
    describe("When state is changed with unsaved data ", () => {
        var personalizedUserNav = {
            AddedItems: [{
                "id": 15,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "isPersonaDefault": false,
                "isUserLeftNavItem": true,
                "parentId": true,
                "isSelected": true,
                "children": null
            }], RemovedItems: []
        }
        beforeEach(function () {
            leftNavPersonalizationController = $controller('LeftNavPersonalizationController', {
                _$rootScope_: $rootScope,
                $scope: $scope,
                _$state_: $state,
                FxpLoggerService: fxpLoggerService,
                PageLoaderService: pageLoaderService,
                FxpMessageService: fxpMessageService,
                PersonalizationService: personalizationService,
                UserInfoService: userInfoService
            });
            leftNavPersonalizationController.personalizedUserNav = personalizedUserNav;
            $scope.$broadcast('$stateChangeStart');
        })
        it('Then isStateChanged should be true', function () {
            $scope.$apply();
            expect(leftNavPersonalizationController.isStateChanged).toBe(true);
        });
	});
	
});



