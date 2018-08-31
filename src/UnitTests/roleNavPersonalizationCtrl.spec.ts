import {RoleNavPersonalizationController} from '../js/controllers/roleNavPersonalizationController';
declare var angular:any;
describe("Given RoleNavPersonalizationController Unit Test Suite", () => {
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
    var $state;
    var timeout;
    var deferredflag = true;
    var nodata = true;
    var witherrorcode = true;
    var deferred;
    var fxpRouteService;
    var state;
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

            $provide.service("FxpRouteService", function () {
                this.navigatetoSpecificState = jasmine.createSpy("navigatetoSpecificState").and.callFake(function (a, b) {
                    console.log('navigatetoSpecificState : ' + a + ', ' + b);
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
            $provide.service("$state", function () {
                this.go = jasmine.createSpy("go").and.callFake(function (key, value) {
                    console.log(key);
                });
                this.get = jasmine.createSpy("go").and.callFake(function () {
                    return [];
                });
                this.href = jasmine.createSpy("href").and.callFake(function () {
                    return "#/TempUrl";
                });
                this.current = { name: "ManageRoleNavigation" };
            });
            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration = { DefaultRoleGroup: [{ "BusinessRoleName": "All(common List)" }] };
            });
        });
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, $state,_$q_, FxpLoggerService, _PageLoaderService_, _FxpMessageService_, PersonalizationService, FxpConfigurationService, _$timeout_,_$window_, FxpRouteService, _$controller_) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        state = $state;
        fxpRouteService = FxpRouteService;
        fxpLoggerService = FxpLoggerService;
        $state = $state;
        pageLoaderService = _PageLoaderService_;
        fxpMessageService = _FxpMessageService_;
        personalizationService = PersonalizationService;
        fxpConfigurationService = FxpConfigurationService;
        timeout = _$timeout_;
        $controller = _$controller_;
        $q = _$q_;
        deferred = _$q_.defer();
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
                RoleGroupNavigationListSaved: {
                    SuccessMessage: "Default navigation saved for {0} {1} "
                },
                RoleGroupPersonalizationSubmitUnAuthorization:
                {
                    ErrorMessage: "An Error Occurred and Configure Role Group navigation was not successful. Please try again.",
                    ErrorMessageTitle: "An Error Occurred and Configure Role Group navigation was not successful. Please try again."
                },
                RoleGroupPersonalizationSubmitError: {
                    ErrorMessage: "Submit was not successful. Please retry.",
                    ErrorMessageTitle: "Submit was not successful. Please retry."
                },
                RoleGroupsMasterListExceptionError: {
                    "ErrorMessage": "An Error Ocurred while fetching Master List Navigation Data .Please Try Again. ",
                    "ErrorMessageTitle": "An Error Ocurred while fetching Master List Navigation Data"
                },
                RoleGroupsDefaultListExceptionError: {
                    "ErrorMessage": "An Error Ocurred while fetching Default List for Role Group .Please Try Again. ",
                    "ErrorMessageTitle": "An Error Ocurred while fetching Default List for Role Group"
                },
                RolesNavListExceptionError: {
                    "ErrorMessage": "An Error Ocurred while fetching Navigation List for Roles.Please Try Again. ",
                    "ErrorMessageTitle": "An Error Ocurred while fetching Navigation List for Roles."
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
        RoleNavPersonalizationController = $controller('RoleNavPersonalizationController', {
            _$rootScope_: $rootScope,
            $scope: $scope,
            $state: state,
            FxpLoggerService: fxpLoggerService,
            PageLoaderService: pageLoaderService,
            FxpMessageService: fxpMessageService,
            PersonalizationService: personalizationService,
            FxpConfigurationService: fxpConfigurationService,
            FxpRouteService: fxpRouteService
        });
    })
    afterEach(function () {
        jasmine.clock().uninstall();
    });


    describe("When RoleNavPersonalizationController is loaded", () => {
        it("Then it getRoleGroupDetails should have been called and return rolegroups", () => {
            $scope.$apply();
            expect($scope.roleGroupDetails.length).toBeGreaterThan(0);
        });
    });
    describe("When getGlobalNavMasterList method calling and api returns data", () => {
        beforeEach(function () {
            var store = {};
            RoleNavPersonalizationController.getGlobalNavMasterList();
        })
        it('Then it should get the Global Navigation Master List', function () {
            expect(RoleNavPersonalizationController.globalNavMasterList.length).toBeGreaterThan(0);
        });
    });
    describe("When getGlobalNavMasterList method calling and api returns exception", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            personalizationService.getMasterLeftNavItems = jasmine.createSpy("getMasterLeftNavItems").and.callFake(function () {
                var defer = $q.defer();
                errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(RoleNavPersonalizationController, "showAndLoggingErrorMsg");
            RoleNavPersonalizationController.getGlobalNavMasterList();
        })

        it('Then it should call showErrorMsgNavigateToUserLookUp function ', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.showAndLoggingErrorMsg).toHaveBeenCalled();
        });
    });
    describe("When getRoleDetails method is called", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.selectedRoleGroup = roleGroup[0]
            spyOn(RoleNavPersonalizationController, "bindBusinessRoles");
            RoleNavPersonalizationController.getRoleDetails();
        })

        it('Then it should return BusinessRoles', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.previousSelectedRoleGroup).toEqual(roleGroup[0]);
        });
        it('Then it should call bindBusinessRoles', function () {
            expect(RoleNavPersonalizationController.bindBusinessRoles).toHaveBeenCalled();
        });
    });
    describe("When selectedRoleDetails method is called", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.selectedRole = roleGroup[0].BusinessRoles[0];
            RoleNavPersonalizationController.selectedRoleDetails();
        })

        it('Then it should return selected BusinessRole', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.previousSelectedRole).toEqual(roleGroup[0].BusinessRoles[0]);
        });
    });
    describe("When bindBusinessRoles method is called", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.selectedRoleGroup = roleGroup[0];
            RoleNavPersonalizationController.bindBusinessRoles();
        })

        it('Then it should set the merged list of  BusinessRoles', function () {
            $scope.$apply();
            expect($scope.businessRoles.length).toBeGreaterThan(0);
        });
        it('Then it should retrun first value as All(common List)', function () {
            $scope.$apply();
            expect($scope.businessRoles[0].BusinessRoleName).toEqual("All(common List)");
        });
        it('Then it should return the preceeding value as BusinessRole', function () {
            $scope.$apply();
            expect($scope.businessRoles[1].BusinessRoleName).toEqual("DM");
        });
    });
    describe("When resetRolePersonalization method is called and BusinessRole is selected", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.selectedRole = roleGroup[0].BusinessRoles[0];
            spyOn(RoleNavPersonalizationController, "getRolesNavList");
            RoleNavPersonalizationController.resetRolePersonalization();
        })

        it('Then it should call getRolesNavList', function () {
            expect(RoleNavPersonalizationController.getRolesNavList).toHaveBeenCalled();
        });
    });
    describe("When resetRolePersonalization method is called and default Role Group is selected is selected", () => {
        var errwithoutcode;
        beforeEach(function () {
            var store = {};
            spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
                return store[key] || null;
            });
            $scope.selectedRole = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup;
            spyOn(RoleNavPersonalizationController, "getRoleGroupNavList");
            RoleNavPersonalizationController.resetRolePersonalization();
        })

        it('Then it should call getRoleGroupNavList', function () {
            expect(RoleNavPersonalizationController.getRoleGroupNavList).toHaveBeenCalled();
        });
    });
    describe("When getRolesNavList method calling and api returns data", () => {
        beforeEach(function () {
            var store = {};
            personalizationService.getRolePersonalizedNavItems = jasmine.createSpy("getRolePersonalizedNavItems").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback(
                            personaNavList
                        );

                    }
                }
            });
            RoleNavPersonalizationController.getRolesNavList();
        })
        it('Then it should get the Global Navigation Master List', function () {
            expect(RoleNavPersonalizationController.roleGroupNavPersonalizationList.length).toBeGreaterThan(0);
        });
    });
    describe("When getRolesNavList method calling and api throws error", () => {
        beforeEach(function () {
            var store = {};
            personalizationService.getRolePersonalizedNavItems = jasmine.createSpy("getRolePersonalizedNavItems").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(RoleNavPersonalizationController, "showAndLoggingErrorMsg");
            RoleNavPersonalizationController.getRolesNavList();
        })
        it('Then it should call showAndLoggingErrorMsg', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.showAndLoggingErrorMsg).toHaveBeenCalled();
        });
    });
    describe("When getRoleGroupNavList method calling and api returns data", () => {
        beforeEach(function () {
            var store = {};
            personalizationService.getRoleGroupPersonalizedList = jasmine.createSpy("getRolePersonalizedNavItems").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback(
                            personaNavList
                        );

                    }
                }
            });
            RoleNavPersonalizationController.getRoleGroupNavList();
        })
        it('Then it should get the Global Navigation Master List', function () {
            expect(RoleNavPersonalizationController.roleGroupNavPersonalizationList.length).toBeGreaterThan(0);
        });
    });
    describe("When getRoleGroupNavList method calling and api throws error", () => {
        beforeEach(function () {
            var store = {};
            personalizationService.getRoleGroupPersonalizedList = jasmine.createSpy("getRolePersonalizedNavItems").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(RoleNavPersonalizationController, "showAndLoggingErrorMsg");
            RoleNavPersonalizationController.getRoleGroupNavList();
        })
        it('Then it should call showAndLoggingErrorMsg', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.showAndLoggingErrorMsg).toHaveBeenCalled();
        });
    });
    describe("When mergeGlobalAndRolePreferenceNavigationList gets called", () => {
        beforeEach(function () {
            var store = {};
            var globalMasterNavItemsList = [
                {
                    "id": 101,
                    "displayName": "Profile",
                    "hasChildren": false,
                    "sortOrder": 3,
                    "parentId": null,
                    "targetUIStateName": "Dashboard",
                    "isPersonalizationAllowed": true,
                    "applicableDevice": "All"
                }, {
                    "id": 400,
                    "displayName": "Help",
                    "hasChildren": false,
                    "sortOrder": 4,
                    "parentId": null,
                    "targetUIStateName": "Dashboard",
                    "isPersonalizationAllowed": false,
                    "applicableDevice": "Mobile"
                }];
            var personaNavItemsList = [{
                "id": 101,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 3,
                "parentId": null,
                "targetUIStateName": "Dashboard",
                "isPersonalizationAllowed": true,
                "isPersonaDefault": false,
                "applicableDevice": "All"
            }, {
                    "id": 400,
                    "displayName": "Help",
                    "hasChildren": false,
                    "sortOrder": 4,
                    "parentId": null,
                    "targetUIStateName": "Dashboard",
                    "isPersonalizationAllowed": false,
                    "isPersonaDefault": false,
                    "applicableDevice": "Mobile"
                }];
            spyOn(RoleNavPersonalizationController, "setFocusToGlobalNavMasterItem").and.callThrough();
            $scope.selectedRole = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup[0];
            $scope.defaultBusinessRoleGroup = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup[0].BusinessRoleName;
            RoleNavPersonalizationController.globalNavMasterList = globalMasterNavItemsList;
            RoleNavPersonalizationController.roleGroupNavPersonalizationList = personaNavItemsList;
            RoleNavPersonalizationController.mergeGlobalAndRolePreferenceNavigationList();
        });
        it("Then isRoleGroupLeftNavItem should be defined for non mobile items", () => {
            expect($scope.navigationList[0].isRoleGroupLeftNavItem).toBeDefined();
        });
        it("Then isRoleGroupLeftNavItem should not be defined for mobile items", () => {
            expect($scope.navigationList[1].isRoleGroupLeftNavItem).not.toBeDefined();
        });
    });
    describe("When showAndLoggingErrorMsg method is called", () => {
        beforeEach(function () {
            var exception = {
                message: "An exception ocurred",
                config: {
                    url:"TestUrl"
                }
            };
            var exceptionMessage = {
                ErrorMessage: "An exception ocurred",
                ErrorMessageTitle: "Exception"
            };
            $scope.selectedRoleGroup = roleGroup[0];
            $scope.selectedRole = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup[0];
            $scope.defaultBusinessRoleGroup = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup[0].BusinessRoleName;
            RoleNavPersonalizationController.showAndLoggingErrorMsg(exception, exceptionMessage);
        })

        it('Then it should call addMessage of fxpMessageService', function () {
            $scope.$apply();
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
        it('Then it should call logError of fxpLoggerService', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });



    describe("When selectedGlobalLeftNavItems method calling and no child items selected", () => {
        beforeEach(function () {
            var parentItem = {
                "id": "15",
                "displayName": "Profile",
                "hasChildren": true,
                "sortOrder": 5,
                "isPersonalizationAllowed": true,
                "isParentSelected": false,
                "parentId": null,
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
            $scope.navigationList = [parentItem];
            RoleNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        });
        it('Then Add button should disabled', () => {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(undefined);
        });

    });
    describe("When selectedGlobalLeftNavItems method calling and child items selected", () => {
        beforeEach(function () {
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
            };
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": true,
                "id": "16",
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            };
            $scope.navigationList = [parentItem];
            RoleNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        });
        it('Then Add button should enable', () => {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(true);
        });
    });
    describe("When selectedGlobalLeftNavItems method calling and Parent existing but one or more child not exists in RoleGroupNavList", () => {
        beforeEach(function () {
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
            };
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": true,
                "id": "16",
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            };
            $scope.navigationList = [parentItem];
            RoleNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, null);
        });
        it('Then Add button should enabled', () => {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(true);
        });
    });
    describe("When selectedGlobalLeftNavItems method calling and we uncheck a child item from Global Nav List", () => {
        beforeEach(function () {
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
            };
            var childItem = {
                "parentId": 15,
                "children": null,
                "isChildSelected": false,
                "id": 16,
                "displayName": "Skill Assessment",
                "sortOrder": 1,
                "isPersonalizationAllowed": true
            };
            $scope.navigationList = [parentItem];
            RoleNavPersonalizationController.selectedGlobalLeftNavItems(parentItem, childItem);
        });
        it('Then Add button should disabled', () => {
            $scope.$apply();
            expect($scope.isAddPersonalizeAllow).toEqual(undefined);
        });
    });
    describe("When selectedRoleGroupNavItems  method calling and Parent items selected", () => {
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
            $scope.navigationList = navList;
            RoleNavPersonalizationController.selectedRoleGroupNavItems(parentItem, true);
        })
        it('Then all child items should be selected', function () {
            $scope.$apply();
            expect(parentItem.children[0].isChildSelected).toEqual(true);
            expect($scope.isRemovePersonalizeAllow).toEqual(true);

        });
    });
    describe("When selectedRoleGroupNavItems  method calling and all child items selected", () => {
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
            $scope.navigationList = navList;
            spyOn(RoleNavPersonalizationController, "setFocusToGlobalNavMasterItem").and.callThrough();
            RoleNavPersonalizationController.selectedRoleGroupNavItems(parentItem, false);
        })
        it('Then parent item should be selected', function () {
            $scope.$apply();
            expect(parentItem.isSelected).toEqual(true);
            expect($scope.isRemovePersonalizeAllow).toEqual(true);
        });
        it("Then setFocusToGlobalNavMasterItem is called with false", () => {
            expect(RoleNavPersonalizationController.setFocusToGlobalNavMasterItem).toHaveBeenCalledWith(false);
        });
    });
    describe("When addToRoleNavPersonalizationList method calling selected parent to be added with child links", () => {
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
            $scope.navigationList = navList;
            RoleNavPersonalizationController.addToRoleNavPersonalizationList();
        })
        it('Then child items should be push  to personalizedRoleGroupNav Add List ', function () {
            $scope.$apply(); 
            expect(RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems.length).toBeGreaterThan(0);
        });

    });
    describe("When call addToRoleNavPersonalizationList method and there is no child item", () => {
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
            $scope.navigationList = navList;
            RoleNavPersonalizationController.addToRoleNavPersonalizationList();
        })
        it('Then child item should be push  to personalizedRoleGroupNav', function () {
            $scope.$apply(); 
            expect(RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems.length).toBeGreaterThan(0);
        });
    });
    describe("When removeRoleGroupNavPresonalization  method calling with parent and child item", () => {
        var parentItem = [{
            "id": 350,
            "businessProcessName": "Account Management",
            "displayName": "Account Management",
            "iconCSS": "icon icon-workSolid",
            "tooltip": "Account Management",
            "targetUIStateName": "",
            "targetURL": "",
            "targetEventName": "",
            "sortOrder": 3,
            "openInline": null,
            "parentId": null,
            "isExternal": false,
            "isPersonalizationAllowed": true,
            "isPersonaDefault": false,
            "applicableDevice": "All",
            "isUserRoleDefault": false,
            "hasChildren": true,
            "isRoleGroupLeftNavItem": true,
            "isSelected": true,
            "children": [
                {
                    "id": 351,
                    "businessProcessName": "Account Consumption",
                    "displayName": "Account Consumption",
                    "iconCSS": "",
                    "tooltip": "Account Consumption",
                    "targetUIStateName": "",
                    "targetURL": "",
                    "targetEventName": "",
                    "sortOrder": 34,
                    "openInline": true,
                    "parentId": 350,
                    "isExternal": false,
                    "isPersonalizationAllowed": false,
                    "isPersonaDefault": false,
                    "applicableDevice": "",
                    "isUserRoleDefault": false,
                    "hasChildren": false,
                    "isRoleGroupLeftNavItem": true,
                    "children": null,
                    "isSelected": true
                }
            ]
        }];
        beforeEach(function () {
            $scope.navigationList = parentItem;
            RoleNavPersonalizationController.removeRoleGroupNavPresonalization();
        })
        it('Then selected items should be removed from RoleNavPersonalizationList', function () {
            expect($scope.navigationList[0].isRoleGroupLeftNavItem).toBeUndefined();
        });
    });
    describe("When removeRoleGroupNavPresonalization  method calling with parent and no child item", () => {
        var parentItem = [{
            "id": 15,
            "displayName": "Profile",
            "hasChildren": false,
            "sortOrder": 5,
            "isPersonalizationAllowed": true,
            "isParentSelected": true,
            "isPersonaDefault": false,
            "isRoleGroupLeftNavItem": true,
            "parentId": true,
            "isSelected": true,
            "children": null
        }];

        beforeEach(function () {
            $scope.navigationList = parentItem;
            RoleNavPersonalizationController.removeRoleGroupNavPresonalization();
        })
        it('Then selected items should be removed from RoleNavPersonalizationList', function () {
            $scope.$apply();
            expect($scope.navigationList[0].isRoleGroupLeftNavItem).toBeUndefined();
        });
    });
    describe("When manageRoleGroupParentItem gets called ", () => {
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
            RoleNavPersonalizationController.manageRoleGroupParentItem(parentItem, 'AddedItems');

        })
        it("Then it add item in personalIzation Nav List  ", function () {
            expect(RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems.length).toBeGreaterThan(0);
        });
    });
    describe("When manageRoleGroupNavChildItem  gets called  with Remove param", () => {
        var personalizeObject = [{ "id": 15, "parentId": null, "action": "AddedItems" }];
        beforeEach(function () {
            RoleNavPersonalizationController.personalizedUserNavigationList = personalizeObject
            RoleNavPersonalizationController.manageRoleGroupNavChildItem(15, 'RemovedItems');
        })
        it("Then it add item in personalizedRoleGroupNavList", function () {
            expect(RoleNavPersonalizationController.personalizedRoleGroupNav.RemovedItems.length).toBeGreaterThan(0);
        });
    });
    describe("When manageRoleGroupNavChildItem  gets called  with Add param", () => {
        var personalizeObject = [{ "id": 15, "action": "RemovedItems" }];
        beforeEach(function () {
            RoleNavPersonalizationController.manageRoleGroupNavChildItem(20, 'AddedItems');
        })
        it("Then it add item in manageRoleGroupNavChildItem List ", function () {
            expect(RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems.length).toBeGreaterThan(0);
        });
    });
    describe("When logTelemetryForRolePersonalization gets called", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.logTelemetryForRolePersonalization();
        });
        it("Then logTelemetryForRolePersonalization method of fxplogger should have been called  ", function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });
    });

    describe("When logTelemetryForRolePersonalization gets called with OBO User", () => {
        beforeEach(function () {

            RoleNavPersonalizationController.logTelemetryForRolePersonalization();
        });
        it("Then logTelemetryForRolePersonalization method of fxplogger should have been called  ", function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });
    });
    describe("When showConfirmSavePopup gets called", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.showConfirmSavePopup();
        });
        it("Then should intilize the flag  ", function () {
            expect(RoleNavPersonalizationController.$scope.displaySavePopup).toEqual(true);
        });
    });
    describe("When hideConfirmSavePopup gets called", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.hideConfirmSavePopup();
        });
        it("Then should intilize the flag", function () {
            expect(RoleNavPersonalizationController.$scope.displaySavePopup).toEqual(false);
        });
    });
    describe("When LeaveConfirmPopup called with bindBusinessRoles", () => {
        beforeEach(function () {
            spyOn(RoleNavPersonalizationController, "bindBusinessRoles");
            spyOn(RoleNavPersonalizationController, "resetRolePersonalization");
            spyOn(RoleNavPersonalizationController, "getRoleGroupDetails");
            RoleNavPersonalizationController.isRoleGroupPersonalizedListChanged = true;
            RoleNavPersonalizationController.isRolePersonalizedListChanged = true;
            RoleNavPersonalizationController.leaveConfirmPopup();
        });
        it("Then should call bindBusinessRoles method", function () {
            expect(RoleNavPersonalizationController.bindBusinessRoles).toHaveBeenCalled();
        });

        it("Then should not  call resetRolePersonalization method", function () {
            expect(RoleNavPersonalizationController.resetRolePersonalization).not.toHaveBeenCalled();
        });

        it("Then should not  call getRoleGroupDetails method", function () {
            expect(RoleNavPersonalizationController.getRoleGroupDetails).not.toHaveBeenCalled();
        });
    });
    describe("When LeaveConfirmPopup called with resetRolePersonalization", () => {
        beforeEach(function () {
            spyOn(RoleNavPersonalizationController, "bindBusinessRoles");
            spyOn(RoleNavPersonalizationController, "resetRolePersonalization");
            spyOn(RoleNavPersonalizationController, "getRoleGroupDetails");
            RoleNavPersonalizationController.isRolePersonalizedListChanged = true;
            RoleNavPersonalizationController.leaveConfirmPopup();
        });
        it("Then should call bindBusinessRoles method", function () {
            expect(RoleNavPersonalizationController.bindBusinessRoles).not.toHaveBeenCalled();
        });

        it("Then should not  call resetRolePersonalization method", function () {
            expect(RoleNavPersonalizationController.resetRolePersonalization).toHaveBeenCalled();
        });

        it("Then should not  call getRoleGroupDetails method", function () {
            expect(RoleNavPersonalizationController.getRoleGroupDetails).not.toHaveBeenCalled();
        });
    });
    describe("When LeaveConfirmPopup called with getRoleGroupDetails ", () => {
        beforeEach(function () {
            spyOn(RoleNavPersonalizationController, "bindBusinessRoles");
            spyOn(RoleNavPersonalizationController, "resetRolePersonalization");
            spyOn(RoleNavPersonalizationController, "getRoleGroupDetails");
            RoleNavPersonalizationController.leaveConfirmPopup();
        });
        it("Then should call bindBusinessRoles method", function () {
            expect(RoleNavPersonalizationController.bindBusinessRoles).not.toHaveBeenCalled();
        });

        it("Then should not  call resetRolePersonalization method", function () {
            expect(RoleNavPersonalizationController.resetRolePersonalization).not.toHaveBeenCalled();
        });

        it("Then should not  call getRoleGroupDetails method", function () {
            expect(RoleNavPersonalizationController.getRoleGroupDetails).toHaveBeenCalled();
        });
    });
    describe("When isParentLinkEnabled called with isRoleGroupLeftNavItem undefined ", () => {
        var result;
        beforeEach(function () {
            var navItem =
                {
                    "id": 100,
                    "businessProcessName": "Dashboard",
                    "displayName": "Dashboard",
                    "iconCSS": "icon icon-details",
                    "tooltip": "Dashboard",
                    "targetUIStateName": "Dashboard",
                    "targetURL": "",
                    "targetEventName": "",
                    "sortOrder": 1,
                    "openInline": true,
                    "parentId": null,
                    "isExternal": false,
                    "isPersonalizationAllowed": false,
                    "isPersonaDefault": true,
                    "applicableDevice": "All",
                    "isUserRoleDefault": false,
                    "hasChildren": false,
                    "children": null
                }

            result = RoleNavPersonalizationController.isParentLinkEnabled(navItem);
        });
        it("Then should return false", function () {
            expect(result).toEqual(false)
        });
    });
    describe("When isParentLinkEnabled called with isRoleGroupLeftNavItem ", () => {
        var result;
        beforeEach(function () {
            var navItem =
                {
                    "id": 101,
                    "businessProcessName": "Resource Management",
                    "displayName": "Resource Management",
                    "iconCSS": "icon icon-peopleLegacy",
                    "tooltip": "Resource Management",
                    "targetUIStateName": "",
                    "targetURL": "",
                    "targetEventName": "",
                    "sortOrder": 4,
                    "openInline": null,
                    "parentId": null,
                    "isExternal": false,
                    "isPersonalizationAllowed": true,
                    "isPersonaDefault": true,
                    "applicableDevice": "All",
                    "isUserRoleDefault": false,
                    "hasChildren": true,
                    "children": [
                        {
                            "id": 111,
                            "businessProcessName": "Resource Management",
                            "displayName": "RM Dashboard",
                            "iconCSS": "",
                            "tooltip": "",
                            "targetUIStateName": "grm-rmdashboard",
                            "targetURL": "",
                            "targetEventName": "",
                            "sortOrder": 7,
                            "openInline": true,
                            "parentId": 101,
                            "isExternal": false,
                            "isPersonalizationAllowed": false,
                            "isPersonaDefault": true,
                            "applicableDevice": "",
                            "isUserRoleDefault": false,
                            "isRoleGroupLeftNavItem": true,
                            "hasChildren": false,
                            "children": null
                        }]
                }
            result = RoleNavPersonalizationController.isParentLinkEnabled(navItem);
        });
        it("Then should return true", function () {
            expect(result).toEqual(true)
        });
    });
    describe("When hideUnsavedConfirmPopup called isRoleGroupPersonalizedListChanged", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.isRoleGroupPersonalizedListChanged = true;
            RoleNavPersonalizationController.previousSelectedRoleGroup = "DM";
            RoleNavPersonalizationController.previousSelectedRole = "Project";
            RoleNavPersonalizationController.hideUnsavedConfirmPopup();
        });
        it("Then should  assign previousSelectedRoleGroup to selectedRoleGroup", function () {
            expect(RoleNavPersonalizationController.$scope.selectedRoleGroup).toEqual("DM");
        });

        it("Then should  assign previousSelectedRole to selectedRole", function () {
            expect(RoleNavPersonalizationController.$scope.selectedRole).toEqual("Project");
        });
    });
    describe("When hideUnsavedConfirmPopup called isRolePersonalizedListChanged", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.isRolePersonalizedListChanged = true;
            RoleNavPersonalizationController.previousSelectedRole = "Project";
            RoleNavPersonalizationController.hideUnsavedConfirmPopup();
        });
        it("Then should assign the previousSelectedRole to selectedRole", function () {
            expect(RoleNavPersonalizationController.$scope.selectedRole).toEqual("Project");
        });
    });
    describe("When submitButtonDisabled called with selectedRole and selectedRoleGroup with null", () => {
        var result;
        beforeEach(function () {
            RoleNavPersonalizationController.$scope.selectedRole = null;
            RoleNavPersonalizationController.$scope.selectedRoleGroup = null;
            RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems = [];
            RoleNavPersonalizationController.personalizedRoleGroupNav.RemovedItems = [];
            result = RoleNavPersonalizationController.submitButtonDisabled();
        });
        it("Then should return true", function () {
            expect(result).toEqual(true);
        });
    });
    describe("When submitButtonDisabled called with selectedRole and selectedRoleGroup without null", () => {
        var result;
        beforeEach(function () {
            RoleNavPersonalizationController.$scope.selectedRole = "FM";
            RoleNavPersonalizationController.$scope.selectedRoleGroup = "Project";
            RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems = [{ "id": 1 }];
            RoleNavPersonalizationController.personalizedRoleGroupNav.RemovedItems = [];
            result = RoleNavPersonalizationController.submitButtonDisabled();
        });
        it("Then should return false", function () {
            expect(result).toEqual(false);
        });
    });
    describe("When showConfirmPopup called with personalizedRoleGroupNav with Empty", () => {
        beforeEach(function () {
            RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems = [];
            RoleNavPersonalizationController.personalizedRoleGroupNav.RemovedItems = [];
            spyOn(RoleNavPersonalizationController, "getRoleGroupDetails");
            RoleNavPersonalizationController.showConfirmPopup();
        });
        it("Then should call getRoleGroupDetails", function () {
            expect(RoleNavPersonalizationController.getRoleGroupDetails).toHaveBeenCalled();
        });
    });
    describe("When showConfirmPopup called with personalizedRoleGroupNav with data", function () {
        beforeEach(function () {
            RoleNavPersonalizationController.personalizedRoleGroupNav.AddedItems = [{ id: 1 }];
            RoleNavPersonalizationController.personalizedRoleGroupNav.RemovedItems = [];
            RoleNavPersonalizationController.showConfirmPopup();
        });
        it("Then should assign true to displayUnsavedChangesPopup ", function () {
            expect(RoleNavPersonalizationController.$scope.displayUnsavedChangesPopup).toEqual(true);
        });
    });
    describe("When personalizedRoleGroupNav method calling", () => {
        var personalizedRoleGroupNav = {
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
            }], RemovedItems: [{
                "id": 16,
                "displayName": "Profile",
                "hasChildren": false,
                "sortOrder": 6,
                "isPersonalizationAllowed": true,
                "isParentSelected": true,
                "isPersonaDefault": false,
                "isUserLeftNavItem": true,
                "parentId": true,
                "isSelected": true,
                "children": null
            }]
        }
        beforeEach(function () {
            personalizationService.saveRoleGroupPersonalizedNavItems = jasmine.createSpy("saveRoleGroupPersonalizedNavItems").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback("Success");
                    }
                }
            });
            RoleNavPersonalizationController.personalizedRoleGroupNav = personalizedRoleGroupNav;
            spyOn(RoleNavPersonalizationController, "getRoleGroupDetails");
            RoleNavPersonalizationController.$scope.selectedRole = { "BusinessRoleName": "Project" }
            RoleNavPersonalizationController.$scope.defaultBusinessRoleGroup = "Project"
            RoleNavPersonalizationController.$scope.selectedRoleGroup = { "RoleGroupName": "FM" }
            RoleNavPersonalizationController.submitRoleGroupNavPresonalization();
        })
        it('Then selected items should be saved', function () {
            expect(RoleNavPersonalizationController.fxpMessage.addMessage).toHaveBeenCalledWith("Default navigation saved for FM  Role Group ", "success");
        });
        it('Then it should call getRoleGroupDetails', function () {
            expect(RoleNavPersonalizationController.getRoleGroupDetails).toHaveBeenCalled();
        });
        it('Then it should call fnHidePageLoader', function () {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
        it('Then it should assign displaySavePopup to false', function () {
            expect(RoleNavPersonalizationController.$scope.displaySavePopup).toEqual(false);
        });
    });
    describe("When personalizedRoleGroupNav method  calling and it throws exception", () => {
        var errwithoutcode;
        var personalizedRoleGroupNav = {
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
            personalizationService.saveRoleGroupPersonalizedNavItems = jasmine.createSpy("saveRoleGroupPersonalizedNavItems").and.callFake(function () {
                var defer = deferred;
                errwithoutcode = { status: 401, config: {url:"testUrl"} };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            $scope.selectedRole = fxpConfigurationService.FxpBaseConfiguration.DefaultRoleGroup[0];
            RoleNavPersonalizationController.personalizedRoleGroupNav = personalizedRoleGroupNav;
            RoleNavPersonalizationController.submitRoleGroupNavPresonalization();
        })
        it('Then selected items should be saved and call addMessage', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.fxpMessage.addMessage).toHaveBeenCalled();
        });
        it('Then it should call fnHidePageLoader', function () {
            $scope.$apply();
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
        it('Then it should assign displaySavePopup to false', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.$scope.displaySavePopup).toEqual(false);
        });
        it('Then selected items should be saved and call logError', function () {
            $scope.$apply();
            expect(RoleNavPersonalizationController.fxpLogger.logError).toHaveBeenCalled();
        });
    });

    describe("When auditLogRoleGroupOrRolePersonalization method calling with Logged in User", () => {
        var errwithoutcode;
        var personalizedRoleGroupNav = [
            {
                "id": 100,
                "businessProcessName": "Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-details",
                "tooltip": "Dashboard",
                "targetUIStateName": "Dashboard",
                "isRoleGroupLeftNavItem": true,
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 1,
                "openInline": true,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": false,
                "isPersonaDefault": true,
                "applicableDevice": "All",
                "isUserRoleDefault": false,
                "hasChildren": false,
                "children": null
            },
            {
                "id": 400,
                "businessProcessName": "Help",
                "displayName": "Help",
                "iconCSS": "icon icon-help",
                "tooltip": "",
                "targetUIStateName": "Help",
                "isRoleGroupLeftNavItem": true,
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 51,
                "openInline": true,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": false,
                "isPersonaDefault": true,
                "applicableDevice": "Mobile",
                "isUserRoleDefault": false,
                "hasChildren": false,
                "children": null
            },
            {
                "id": 200,
                "businessProcessName": "Profile",
                "displayName": "Profile",
                "iconCSS": "icon icon-contactInfoLegacy",
                "isRoleGroupLeftNavItem": true,
                "tooltip": "Profile",
                "targetUIStateName": "",
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 2,
                "openInline": null,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": true,
                "isPersonaDefault": true,
                "applicableDevice": "All",
                "isUserRoleDefault": false,
                "hasChildren": true,
                "children": [
                    {
                        "id": 201,
                        "businessProcessName": "",
                        "displayName": "Overview",
                        "iconCSS": "",
                        "tooltip": "Overview",
                        "targetUIStateName": "oneprofile.profile.basic",
                        "targetURL": "",
                        "targetEventName": "getBasicProfileInformationRoute",
                        "sortOrder": 3,
                        "openInline": true,
                        "isRoleGroupLeftNavItem": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    },
                    {
                        "id": 202,
                        "businessProcessName": "",
                        "displayName": "Skills Assessment",
                        "iconCSS": "",
                        "tooltip": "Skills Assessment",
                        "targetUIStateName": "oneprofile.skillAssessmentDashboard",
                        "targetURL": "",
                        "targetEventName": "getSkillAssessmentDashboardRoute",
                        "sortOrder": 4,
                        "openInline": true,
                        "isRoleGroupLeftNavItem": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    },
                    {
                        "id": 203,
                        "businessProcessName": "",
                        "displayName": "Skills Development Plan",
                        "iconCSS": "",
                        "tooltip": "Skills Development Plan",
                        "targetUIStateName": "oneprofile.profile.skillsdevelopment",
                        "targetURL": "",
                        "targetEventName": "getSkillDevelopmentPlanRoute",
                        "isRoleGroupLeftNavItem": true,
                        "sortOrder": 5,
                        "openInline": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    }
                ]
            }]
        var navList = [
            {
                "id": 100,
                "businessProcessName": "Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-details",
                "tooltip": "Dashboard",
                "targetUIStateName": "Dashboard",
                "isRoleGroupLeftNavItem": true,
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 1,
                "openInline": true,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": false,
                "isPersonaDefault": true,
                "applicableDevice": "All",
                "isUserRoleDefault": false,
                "hasChildren": false,
                "children": null
            },
            {
                "id": 400,
                "businessProcessName": "Help",
                "displayName": "Help",
                "iconCSS": "icon icon-help",
                "tooltip": "",
                "targetUIStateName": "Help",
                "isRoleGroupLeftNavItem": true,
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 51,
                "openInline": true,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": false,
                "isPersonaDefault": true,
                "applicableDevice": "Mobile",
                "isUserRoleDefault": false,
                "hasChildren": false,
                "children": null
            },
            {
                "id": 200,
                "businessProcessName": "Profile",
                "displayName": "Profile",
                "iconCSS": "icon icon-contactInfoLegacy",
                "isRoleGroupLeftNavItem": true,
                "tooltip": "Profile",
                "targetUIStateName": "",
                "targetURL": "",
                "targetEventName": "",
                "sortOrder": 2,
                "openInline": null,
                "parentId": null,
                "isExternal": false,
                "isPersonalizationAllowed": true,
                "isPersonaDefault": true,
                "applicableDevice": "All",
                "isUserRoleDefault": false,
                "hasChildren": true,
                "children": [
                    {
                        "id": 201,
                        "businessProcessName": "",
                        "displayName": "Overview",
                        "iconCSS": "",
                        "tooltip": "Overview",
                        "targetUIStateName": "oneprofile.profile.basic",
                        "targetURL": "",
                        "targetEventName": "getBasicProfileInformationRoute",
                        "sortOrder": 3,
                        "openInline": true,
                        "isRoleGroupLeftNavItem": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    },
                    {
                        "id": 202,
                        "businessProcessName": "",
                        "displayName": "Skills Assessment",
                        "iconCSS": "",
                        "tooltip": "Skills Assessment",
                        "targetUIStateName": "oneprofile.skillAssessmentDashboard",
                        "targetURL": "",
                        "targetEventName": "getSkillAssessmentDashboardRoute",
                        "sortOrder": 4,
                        "openInline": true,
                        "isRoleGroupLeftNavItem": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    },
                    {
                        "id": 203,
                        "businessProcessName": "",
                        "displayName": "Skills Development Plan",
                        "iconCSS": "",
                        "tooltip": "Skills Development Plan",
                        "targetUIStateName": "oneprofile.profile.skillsdevelopment",
                        "targetURL": "",
                        "targetEventName": "getSkillDevelopmentPlanRoute",
                        "isRoleGroupLeftNavItem": true,
                        "sortOrder": 5,
                        "openInline": true,
                        "parentId": 200,
                        "isExternal": false,
                        "isPersonalizationAllowed": false,
                        "isPersonaDefault": true,
                        "applicableDevice": "",
                        "isUserRoleDefault": false,
                        "hasChildren": false,
                        "children": null
                    }
                ]
            }];
        beforeEach(function () {
            RoleNavPersonalizationController.$scope.selectedRole = { BusinessRoleId: 1, BusinessRoleName: "All(CommonList)" };
            RoleNavPersonalizationController.$scope.selectedRoleGroup = { RoleGroupName: "RMManager" }
            RoleNavPersonalizationController.roleGroupId = 2;
            RoleNavPersonalizationController.$scope.defaultBusinessRoleGroup = "All(CommonList)";
            RoleNavPersonalizationController.businessRoleId = 1;
            RoleNavPersonalizationController.roleGroupNavPersonalizationList = personalizedRoleGroupNav;
            RoleNavPersonalizationController.$scope.navigationList = navList;
            spyOn(RoleNavPersonalizationController, "getRoleGroupFlatDataStructure").and.callThrough();
            RoleNavPersonalizationController.auditLogRoleGroupOrRolePersonalization();
        });
        it('Then it should call the logInformation mentod', function () {
            $scope.$apply();
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });
    });
});

