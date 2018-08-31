import {ActOnBehalfOfController} from '../js/controllers/actOnBehalfOfController';
declare var angular:any;
describe("Given ActOnBehalfOfController", () => {
    var uiStateHelper,
        $scope,
        $state,
        $rootScope,
        $controller,
        fxpLoggerService,
        adalService,
        userProfileService,
        userInfoService,
        fxpMessage,
        oboUserService,
        dashBoardHelper,
        fxpTelemetryContext,
        fxpContextService,
        fxpConfigurationService,
        $window,
        dashboardService,
        actOnBehalfOfHelper,
        pageLoaderService,
        $q,
        $timeout,
        fxpErrorConstants;

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {

        angular.mock.module(function ($provide) {

            $provide.provider("UIStateHelper", function () {
                this.$get = function UIStateHelper() {
                }
            });

            $provide.service("FxpLoggerService", function () {
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

                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c, d) {
                    console.log('logEvent : ' + a + ',' + b + ',' + c + ',' + d);
                });

                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    console.log('logMetric : ' + a + ',' + b + ',' + c + ',' + d);
                });

                this.logTrace = jasmine.createSpy("logTrace").and.callFake(function (a, b) {
                    console.log('logTrace : ' + a + ',' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });

                this.setOBOUserContext = jasmine.createSpy("setOBOUserContext").and.callFake(function (a, b, c, d, e) {
                    console.log('setOBOUserContext : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b, c) {
                    console.log('logInformation : ' + a + ',' + b + ',' + c);
                });

                this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function (a, b, c) {
                    console.log('logPageLoadMetrics : ' + a + ',' + b + ',' + c);
                });

                this.logWarning = jasmine.createSpy("logWarning").and.callFake(function (a, b, c) {
                    console.log('logWarning : ' + a + ',' + b + ',' + c);
                });
            });

            $provide.service("adalAuthenticationService", function () {
            });

            $provide.service("UserProfileService", function () {
                this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function (a) {
                    console.log('setCurrentUser : ' + a);
                });

                this.getUserClaimsSvc = jasmine.createSpy("getUserClaimsSvc").and.callFake(function (a) {
                    console.log('getUserClaimsSvc : ' + a);
                });
                this.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {
                            return callback({ data: ["Test user"] });
                        }
                    };
                });
                this.isObo = jasmine.createSpy("isObo").and.callFake(function () {
                    console.log('isObo : ');
                    return false;
                });
            });

            $provide.service("UserInfoService", function () {
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    console.log('getLoggedInUser : ');
                    return "LoggedInUser";
                });
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    console.log('getCurrentUser : ');
                    return "alias";
                });
                this.getCurrentUserData = jasmine.createSpy("getCurrentUserData").and.callFake(function () {
                    var userInfo = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Non Services User"}';
                    userInfo = JSON.parse(userInfo);
                    console.log('getCurrentUserData : ' + userInfo);
                    return userInfo;
                });
                this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                    console.log('isActingOnBehalfOf : ');
                    return false;
                });
            });

            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage : ' + a + ', ' + b);
                });
            });

            $provide.service("OBOUserService", function () {

                this.getOBOUserRoutes = jasmine.createSpy("getOBOUserRoutes").and.callFake(function () {
                    var routes = [{
                        "StateName": "ActOnBehalf",
                        "AppHeader": "Act On Behalf"
                    }]
                    return routes;
                });

                this.getOBOUser = jasmine.createSpy("getOBOUser").and.callFake(function () {
                    return {
                        displayName: "displayName",
                        href: "href",
                        alias: "alias"
                    }
                });

                this.removeOBOUserContext = jasmine.createSpy("removeOBOUserContext").and.callFake(function () {
                    console.log('removeOBOUserContext');
                });

                this.saveOBOEntityInContext = jasmine.createSpy("saveOBOEntityInContext").and.callFake(function () {
                    console.log('saveOBOEntityInContext');
                });
                this.getOBOUserTenantConfiguration = jasmine.createSpy("getOBOUserTenantConfiguration").and.callFake(function () {
                    var TenantConfiguration = {
                        "UIStrings": {
                            "Domain": "Domain",
                            "AppHeader": "Enterprise Services Experience",
                            "AppHeaderAlias": "ES"
                        }
                    }
                    return TenantConfiguration;
                });
            });

            $provide.service("DashBoardHelper", function () {
                this.fillRoutes = jasmine.createSpy("fillRoutes").and.callFake(function (a) {
                    console.log('fillRoutes : ' + a);
                });
            });

            $provide.service("ActOnBehalfOfHelper", function () {
                this.getPropBag = jasmine.createSpy("getPropBag").and.callFake(function (a) {
                    
                });
                this.getUserProfileAndClaims = jasmine.createSpy("getUserProfileAndClaims").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    fullName: "Test User",
                                    DisplayName: "Test User",
                                    alias: "tstusr@microsoft.com",
                                    profileStateName: "Test",
                                    businessRoleId: 1,
                                    businessRole: "Test",
                                    roleGroupId: 1,
                                    roleGroupName: "Test"
                                }
                            );
                        }
                    }
                });
                this.getObOUserConfiguration = jasmine.createSpy("getObOUserConfiguration").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    data: {
                                        UiConfiguration: {
                                            RoleGroup: {
                                                Id: 1,
                                                Name: "Role"
                                            }
                                        },
                                        tenantConfiguration: {}
                                    }
                                }
                            );
                        }
                    }
                });
                this.getMetricPropBag = jasmine.createSpy("getMetricPropBag").and.callFake(function (a) {

                });
            });

            $provide.service("FxpTelemetryContext", function () {
                this.removeFromGlobalPropertyBag = jasmine.createSpy("removeFromGlobalPropertyBag").and.callFake(function (a) {
                    console.log('removeFromGlobalPropertyBag : ' + a);
                });

                this.addToGlobalPropertyBag = jasmine.createSpy("addToGlobalPropertyBag").and.callFake(function (a, b) {
                    console.log('removeFromGlobalPropertyBag : ' + a + ', ' + b);
                });

                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
            });

            $provide.service("FxpContextService", function () {
            });

            $provide.service("PageLoaderService", function () {
                this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a) {
                    console.log('fnShowPageLoader : ' + a);
                });

                this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function (a, b) {
                    console.log('fnHidePageLoader : ' + a + ', ' + b);
                });
            });

            $provide.service("FxpConfigurationService", function () {
                var configData = { "FxpHelpLinks": "[{\"DisplayText\":\"IT Support\",\"HelpLinks\":[{\"DisplayText\":\"Create a Support Ticket\",\"Href\":\"https://aka.ms/fxpsupport\"}]}]" };
                this.FxpAppSettings = configData;
                this.FxpBaseConfiguration = {
                    "FxpFooterData": [{
                        "ElementType": "a",
                        "DisplayText": "Terms of Use",
                        "href": "https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx",
                        "TabIndex": "402",
                        "target": "_blank",
                        "cssClass": "footer-item pull-right"
                    }]
                };
                this.FlagInformation = {
                    EnableFeedback: true
                };

            });

            $provide.service("DashboardService", function () {
                this.fxpConfigurationFailed = jasmine.createSpy("fxpConfigurationFailed").and.callFake(function () {
                    console.log("fxpConfigurationFailed method called");
                });
                this.updateRoleGroupInUserInfoSession = jasmine.createSpy("updateRoleGroupInUserInfoSession").and.callFake(function (a) {
                    console.log("updateRoleGroupInUserInfoSession " + a)
                });
            });
        });

    });


    beforeEach(angular.mock.inject(function (UIStateHelper, _$state_, _$rootScope_, FxpLoggerService, adalAuthenticationService, UserProfileService, UserInfoService, FxpMessageService, OBOUserService, DashBoardHelper, FxpTelemetryContext, FxpContextService, FxpConfigurationService, DashboardService, _$controller_, _$window_, ActOnBehalfOfHelper, _$q_, _$timeout_, PageLoaderService) {
        $scope = _$rootScope_.$new();
        $state = _$state_;
        uiStateHelper = UIStateHelper;
        $rootScope = _$rootScope_;
        fxpLoggerService = FxpLoggerService;
        adalService = adalAuthenticationService;
        userProfileService = UserProfileService;
        userInfoService = UserInfoService;
        fxpMessage = FxpMessageService;
        oboUserService = OBOUserService;
        dashBoardHelper = DashBoardHelper;
        fxpTelemetryContext = FxpTelemetryContext;
        fxpContextService = FxpContextService;
        fxpConfigurationService = FxpConfigurationService;
        dashboardService = DashboardService;
        $controller = _$controller_;
        $window = _$window_;
        actOnBehalfOfHelper = ActOnBehalfOfHelper;
        $q = _$q_;
        $timeout = _$timeout_;
        pageLoaderService = PageLoaderService;
        fxpErrorConstants = $rootScope.fxpUIConstants.UIMessages;


        $window.loggedInUserConfig = {
            "FxpHelpLinks": [{
                "DisplayText": "Getting Started",
                "HelpLinks": [
                    {
                        "DisplayText": "User Guide",
                        "Href": "https://aka.ms/fxpguide"
                    }
                ]
            }],
            "RoleGroup": 2
        };

        $window.tenantConfiguration = {
            "TenantId": "ES",
            "UIStrings": {
                "Domain": "Domain",
                "AppHeader": "Enterprise Services Experience - SIT",
                "AppHeaderAlias": "ES"
            },
            "HelpMenuCollection": [
                {
                    "DisplayText": "<i class=\"icon icon-helpbot\"></i> Contact Support Bot",
                    "EventName": "SkypeBotInit",
                    "Href": "sip:itlync@microsoft.com",
                    "Title": "Chat with our Support Bot",
                    "OpenInline": "true",
                    "Description": "Need assistance? Try asking our support bot, click this link to start a Skype chat.",
                    "ApplicableDevice": "Desktop"
                },
                {
                    "DisplayText": "<i class=\"icon icon-helpdetail\"></i> Detailed Help",
                    "Href": "#/Help",
                    "Title": "Detailed Help",
                    "StateName": "Help",
                    "RouteConfig": "{\"url\":\"/Help\",\"templateUrl\":\"/templates/fxphelp.html\",\"controller\":\"HelpController\",\"requireADLogin\":\"true\"}",
                    "OpenInline": "false"
                },
                {
                    "DisplayText": "<i class=\"pagetour__icon icon-pagetour\"></i> Page Tour",
                    "EventName": "PageTourMenuInit",
                    "Title": "Page Tour tutorials menu",
                    "OpenInline": "true",
                    "Description": "Page Tour tutorials",
                    "ApplicableDevice": "Desktop",
                    "AppHeader": "Page Tour",
                    "PageTitle": "Page Tour",
                    "BreadcrumbText": "Page Tour"
                }
            ],
            "HelpConfiguration": {
                "Title": "What can we help you with?",
                "FxpHelpLinks": [
                    {
                        "DisplayText": "Self-help",
                        "DisplayText_Flyout": "Self Service",
                        "DisplayOrder": "1",
                        "Icon": "icon icon-user",
                        "HelpLinks": [
                            {
                                "DisplayText": "Access user guides & training",
                                "Href": "https://aka.ms/GRMTraining",
                                "Title": "Access user guides & training",
                                "DisplayOrder": "2",
                                "Description": "User guides, training decks and quick reference guides for GRM and One Profile."
                            }
                        ]
                    },
                    {
                        "DisplayText": "Assisted Help",
                        "DisplayText_Flyout": "Get Help",
                        "DisplayOrder": "2",
                        "Icon": "icon icon-assisted-help",
                        "HelpLinks": [
                            {
                                "DisplayText": "Contact GRM admin support",
                                "Href": "mailto:GRMAdminHelp@microsoft.com",
                                "Title": "Contact GRM admin support",
                                "DisplayOrder": "2",
                                "Description": "Create a GRM support ticket for role provisioning, queue management, and Resource Manager to resource mapping (tagging)."
                            },
                            {
                                "DisplayText": "Create GRM technical support ticket",
                                "Href": "https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D717e9f05136d12005e2272722244b0c7%26short_description%3DGRM%20Support%20Request%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541",
                                "Title": "Create GRM technical support ticket",
                                "DisplayOrder": "2",
                                "Description": "Open a support ticket to get help with GRM technical issues."
                            },
                            {
                                "DisplayText": "Create One Profile technical support ticket ",
                                "Href": "https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D8c7fe10f13e89240691272722244b0fe%20%26short_description%3DOne%20Profile%20Tool%20Issue%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541",
                                "Title": "Create One Profile technical support ticket ",
                                "DisplayOrder": "2",
                                "Description": "Open a support ticket to get help with One Profile technical issues."
                            },
                            {
                                "DisplayText": "Create One Profile skill update support ticket",
                                "Href": "https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D5c3c7d9213a79e40a8f672722244b06c%26short_description%3DTaxonomy%20Support%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541",
                                "Title": "Create One Profile skill update support ticket",
                                "DisplayOrder": "2",
                                "Description": "Open a support ticket for help with adding missing or new skills in One Profile."
                            },
                            {
                                "DisplayText": "Create Skills Development Plan Support Ticket",
                                "Href": "https://microsoft.service-now.com/it/catalog_detail.do?uri=com.glideapp.servicecatalog_cat_item_view.do%3Fv%3D1%26sysparm_id%3D906528a10a0a0bf000a85bc20dfb6541%26cmdb_ci%3D39a36dc2137da640e598b0912244b061%26short_description%3DServices%20University%20Support%20Request%26sysparm_no_search%3Dtrue&sysparm_document_key=sc_cat_item_producer,906528a10a0a0bf000a85bc20dfb6541",
                                "Title": "Create Skills Development Plan Support Ticket",
                                "DisplayOrder": "2",
                                "Description": "Open a Support Ticket for help with Skills Development Plan."
                            },
                            {
                                "DisplayText": "Contact Business Intelligence technical support",
                                "Href": "mailto:esbibd@microsoft.com",
                                "Title": "Contact Business Intelligence technical support ",
                                "DisplayOrder": "2",
                                "Description": "Email esbibd@microsoft.com for Business Intelligence technical support."
                            }
                        ]
                    }
                ]
            }
        };

    }));

    beforeEach(function () {
        $window.isFxpConfigFetched = true;
        $rootScope.fxpUIConstants = {
            "UIMessages": {
                "AADAuthFailureError": {
                    "ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                    "ErrorMessageTitle": "Error occured while retrieving JWT Token"
                },
                "UserProfileBusinessRoleFailureError": {
                    "ErrorMessage": "Your professional services profile is missing role configuration. Please contact IT support.",
                    "ErrorMessageTitle": "Error in getBasicProfileSvc from service Fails to return Business Role"
                },
                "UserProfileBusinessRoleMissingError": {
                    "ErrorMessage": "Your professional services profile is missing role configuration. Please contact IT support.",
                    "ErrorMessageTitle": "Error in getBasicProfileSvc from service Business Role is missing"
                },
                "UserProfileNotFoundError": {
                    "ErrorMessage": "Your profile is not mapped to a Dashboard. Please contact IT support.",
                    "ErrorMessageTitle": "Error in getBasicProfileSvc from service returns UserProfile is Null"
                },
                "BootstrapError": {
                    "ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                    "ErrorMessageTitle": ""
                },
                "AuthServiceReturnsBlankAppRoleError": {
                    "ErrorMessage": "Your profile does not have permissions to access this content. Please contact IT support.",
                    "ErrorMessageTitle": "Error in getUserClaims from service which returns Blank App Roles"
                },
                "AuthzServiceReturnsError": {
                    "ErrorMessage": "Authorization failed. Please contact IT Support.",
                    "ErrorMessageTitle": ""
                },
                "ConfigServiceReturnsNullError": {
                    "ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                    "ErrorMessageTitle": "Error in Config Service which returns null"
                },
                "GetUserClaimsSvcReturnsError": {
                    "ErrorMessage": "Authorization failed. Please contact IT Support.",
                    "ErrorMessageTitle": "Error in getUserClaims from service"
                },
                "SearchProfileSvcNotWorkingError": {
                    "ErrorMessage": "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                    "ErrorMessageTitle": "Error in SearchProfile service"
                },
                "SearchProfileSvcReturnsError": {
                    "ErrorMessage": "Profile you are searching does not exist. Please Click on Create Profile",
                    "ErrorMessageTitle": "Error in SearchProfile service"
                },
                "ProfileSelectError": {
                    "ErrorMessage": "Profile you have selected does not exist. Please contact IT support.",
                    "ErrorMessageTitle": "Error in SearchProfile service"
                },

                "UserSelectedProfileBusinessRoleFailureError": {
                    "ErrorMessage": "Your Selected User profile is missing role configuration. Please contact IT support.",
                    "ErrorMessageTitle": "Error in getBasicProfileSvc from service Fails to return Business Role"
                },

                "SelectedProfileRoles": {
                    "ErrorMessage": "System Error. Unable to load on behalf of user application roles. Please try again",
                    "ErrorMessageTitle": "Error while loading Onbehlafof user claims"
                },

                "SelectedUserProfileInformation": {
                    "ErrorMessage": "System Error. Unable to retrieve on behalf of user profile. Please try again",
                    "ErrorMessageTitle": "Error while retriving Onbehlafof user infromation"
                },

                "CreateProfileState": {
                    "ErrorMessage": "System Error.Create Profile state does not exist.Please contact IT support",
                    "ErrorMessageTitle": "Error in create profile"
                },

                "OBOUserActive": {
                    "ErrorMessage": "You are already acting On behalf of for <OBOusername>. Please exit current on behalf of user experience to initiate a new on behalf of workflow",
                    "ErrorMessageTitle": "OBO user is active"
                },
                "OBOUserAliasUndefined": {
                    "ErrorMessage": "OBO user alias is not found",
                    "ErrorMessageTitle": "OBO user alias is undefined"
                },
                "GeneralExceptionError": {
                    "ErrorMessage": "Exception occurred",
                    "ErrorMessageTitle": "General Exception"
                },
                "OBOUserUIConfigurationError": {
                    "ErrorMessage": "Exception occurred",
                    "ErrorMessageTitle": "General Exception"
                }
            },

            "UIStrings": {
                "OBOUIStrings": {
                    "ActingOnBehalfOf": "Acting On Behalf Of :",
                    "CreateProfile": "Create Profile",
                    "OBOReset": "Reset",
                    "OBOSearchLabel": "Search for the user below you would like to act on behalf of",
                    "Administrator": "Administrator",
                    "ActOnBehalfOf": "Act On Behalf Of",
                    "ActOnBehalfOfButton": "Act On Behalf Of Button"
                },
                "FeedbackUIMessages": {
                    "ErrorMessage": "Feedback ErrorMessage"
                },
                "CreateProfileStateName": "oneprofile.CreateUserProfile"
            }
        };
    })

    describe("When actOnBehalfOfController is loaded", () => {
        beforeEach(function () {
            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })
        it("Then displayErrorMessage should be false", () => {
            expect($scope.displayErrorMessage).toEqual(false);
        });
        it("Then searchUsersList should be empty", () => {
            expect($scope.searchUsersList).toEqual([]);
        });
        it("Then errorMessage should be empty", () => {
            expect($scope.errorMessage).toEqual("");
        });
        it("Then selectedUser should be empty", () => {
            expect($scope.selectedUser).toEqual("");
        });
        it("Then selectedUserObject should be empty", () => {
            expect($scope.selectedUserObject).toEqual({});
        });
        it("Then logPageLoadMetrics should be empty", () => {
            expect(fxpLoggerService.logPageLoadMetrics).toHaveBeenCalled();
        });
        it("Then logPageLoadMetrics should be empty", () => {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });
        it("Then logPageLoadMetrics should be empty", () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });

    describe("When OBOAdminstratorClick is called", () => {
        beforeEach(() => {
            var controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            $rootScope.navigateToLandingPage = jasmine.createSpy("navigateToLandingPage").and.callThrough();
            controller.OBOAdminstratorClick();
        })
        it("Then removeOBOUserContext should be called", () => {
            expect(oboUserService.removeOBOUserContext).toHaveBeenCalled();
        });
        it("Then navigateToLandingPage should be called", () => {
            expect($rootScope.navigateToLandingPage).toHaveBeenCalled();
        });
    });

    describe("When handleEnterKeyOnSearchUserInput is called", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            controller.actOnBehalfOfUserClick = jasmine.createSpy("actOnBehalfOfUserClick").and.callThrough();
            controller.handleEnterKeyOnSearchUserInput({keyCode: 13});
        })
        it("Then actOnBehalfOfUserClick should be called", () => {
            expect(controller.actOnBehalfOfUserClick).toHaveBeenCalled();
        });
    });

    describe("When handleEnterKeyOnSearchUserInput is called and user profile does not exist", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            controller.createProfile = jasmine.createSpy("createProfile").and.callThrough();
            $scope.userProfileDoesNotExist = true;
            controller.handleEnterKeyOnSearchUserInput({ keyCode: 13 });
        })
        it("Then createProfile should be called", () => {
            expect(controller.createProfile).toHaveBeenCalled();
        });
    });

    describe("When onSelect is called", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            controller.onSelect({ keyCode: 13 });
        })
        it("Then selectedUserObject should have data", () => {
            expect($scope.selectedUserObject).toEqual({ keyCode: 13 });
        });
    });

    describe("When createProfile is called", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $state.get = jasmine.createSpy("get").and.callFake(function (a, b, c) {
                return true;
            });
            $state.go = jasmine.createSpy("go").and.callFake(function (a, b, c) {
                return "view";
            });
            controller.createProfile();
        })
        it("Then getPropBag should be called", () => {
            expect(actOnBehalfOfHelper.getPropBag).toHaveBeenCalled();
        });
        it("Then logEvent should be called", () => {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
        it("Then $state.go should be called", () => {
            expect($state.go).toHaveBeenCalled();
        });
    });

    describe("When createProfile is called and profile state does not exist", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $rootScope.fxpUIConstants.UIStrings.CreateProfileStateName = "abc";
            controller.createProfile();
        })
        it("Then addMessage should be called", () => {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });
    });

    describe("When searchUser is called", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            controller.searchUser();
        })
        it("Then searchProfile should be called", () => {
            expect(userProfileService.searchProfile).toHaveBeenCalled();
        });
        it("Then displayErrorMessage should be false", () => {
            expect($scope.displayErrorMessage).toEqual(false);
        });
        it("Then errorMessage should be empty", () => {
            expect($scope.errorMessage).toEqual("");
        });
        it("Then getMetricPropBag should be called", () => {
            expect(actOnBehalfOfHelper.getMetricPropBag).toHaveBeenCalled();
        });
        it("Then logMetric should be called", () => {
            expect(fxpLoggerService.logMetric).toHaveBeenCalled();
        });
    });

    describe("When searchUser is called and data is not returned", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
                return {
                    then: function (callback) {
                        return callback({ data: [] });
                    }
                };
            });
            controller.searchUser();
        })
        it("Then searchProfile should be called", () => {
            expect(userProfileService.searchProfile).toHaveBeenCalled();
        });
        it("Then displayErrorMessage should be false", () => {
            expect($scope.displayErrorMessage).toEqual(false);
        });
        it("Then selectedUserObject should be empty", () => {
            expect($scope.selectedUserObject).toEqual({});
        });
        it("Then errorMessage should not be empty", () => {
            expect($scope.errorMessage).not.toEqual("");
        });
        it("Then getMetricPropBag should be called", () => {
            expect(actOnBehalfOfHelper.getMetricPropBag).toHaveBeenCalled();
        });
        it("Then logMetric should be called", () => {
            expect(fxpLoggerService.logMetric).toHaveBeenCalled();
        });
    });
    describe("When searchUser is called and service is not able to find profile", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
                var defer = $q.defer();
                defer.reject({
                    data: { ErrorCode: 112 }
                });
                return defer.promise;
            });
            controller.searchUser();
            $timeout.flush();
        })
        it("Then errorMessage should not be empty", () => {
            expect($scope.errorMessage).not.toEqual("");
        });
        it("Then createPropertyBag should be called", () => {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        });
        it("Then logInformation should be called", () => {
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });
    });
    describe("When searchUser is called and service throws error", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            userProfileService.searchProfile = jasmine.createSpy("searchProfile").and.callFake(function (a) {
                var defer = $q.defer();
                defer.reject({
                    data: {ErrorCode : 404}
                });
                return defer.promise;
            });
            controller.searchUser();
            $timeout.flush();
        })
        it("Then errorMessage should not be empty", () => {
            expect($scope.errorMessage).not.toEqual("");
        });
        it("Then logInformation should be called", () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe("When actOnBehalfOfUserClick is called role group id id not returned", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false
            controller.actOnBehalfOfUserClick();
        })
        it("Then logTrace should be called", () => {
            expect(fxpLoggerService.logTrace).toHaveBeenCalled();
        });
        it("Then createPropertyBag should be called", () => {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        });
        it("Then setCurrentUser should be called", () => {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });
        it("Then addMessage should be called", () => {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });
        it("Then logWarning should be called", () => {
            expect(fxpLoggerService.logWarning).toHaveBeenCalled();
        });
    });
    describe("When actOnBehalfOfUserClick is called and with wrong user object ", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = undefined;
            controller.actOnBehalfOfUserClick();
        })
        it("Then errorMessage should not be empty", () => {
            expect($scope.errorMessage).not.toEqual("");
        });
        it("Then userProfileDoesNotExist should be true", () => {
            expect($scope.userProfileDoesNotExist).toEqual(true);
        });
    });
    describe("When actOnBehalfOfUserClick is called and selected user is same as logged in user", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = { Alias:"LoggedInUser"};
            controller.actOnBehalfOfUserClick();
        })
        it("Then errorMessage should not be empty", () => {
            expect($scope.errorMessage).not.toEqual("");
        });
        it("Then displayErrorMessage should be true", () => {
            expect($scope.displayErrorMessage).toEqual(true);
        });
    });
    describe("When actOnBehalfOfUserClick is called and user doesn't have applications", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = { Alias: "User", RoleGroupID: 1 };
            sessionStorage["fxpUserClaims_tstusr@microsoft.com"] = "{\"FirstName\": \"Test1\",\"LastName\": \"User1\",\"Alias\": \"tstusr1@microsoft.com\",\"Applications\": {}}";
            controller.actOnBehalfOfUserClick();
        })
        it("Then fnShowPageLoader should be called", () => {
            expect(pageLoaderService.fnShowPageLoader).toHaveBeenCalled();
        });
        it("Then getUserProfileAndClaims should be called", () => {
            expect(actOnBehalfOfHelper.getUserProfileAndClaims).toHaveBeenCalled();
        });
        it("Then addMessage should be called", () => {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });
        it("Then setCurrentUser should be called", () => {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });
        it("Then fnHidePageLoader should be called", () => {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
    });
    describe("When actOnBehalfOfUserClick is called and user doesn't have applications", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = { Alias: "User", RoleGroupID: 1 };
            sessionStorage["fxpUserClaims_tstusr@microsoft.com"] = "{\"FirstName\": \"Test1\",\"LastName\": \"User1\",\"Alias\": \"tstusr1@microsoft.com\",\"Applications\": {\"FieldExprience\": {\"ApplicationName\": \"FieldExprience\",\"Roles\": {\"FxPAdmin\": {\"RoleName\": \"FxPAdmin\",\"Permissions\": []}, \"LeftNavAdmin\": {\"RoleName\": \"LeftNavAdmin\",\"Permissions\": [{\"ResourceName\": \"AppSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"AppSettings\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"LeftNav\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"LeftNav\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"UserGroupSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"UserGroupSettings\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"UserSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"UserSettings\",\"ResourceOperation\": \"Write\"}]}, \"PageTourAuthor\": {\"RoleName\": \"PageTourAuthor\",\"Permissions\": []}}}}}";
            controller.actOnBehalfOfUserClick();
        })
        it("Then getObOUserConfiguration should be called", () => {
            expect(actOnBehalfOfHelper.getObOUserConfiguration).toHaveBeenCalled();
        });
        it("Then updateRoleGroupInUserInfoSession should be called", () => {
            expect(dashboardService.updateRoleGroupInUserInfoSession).toHaveBeenCalled();
        });
        it("Then saveOBOEntityInContext should be called", () => {
            expect(oboUserService.saveOBOEntityInContext).toHaveBeenCalled();
        });
        it("Then addToGlobalPropertyBag should be called", () => {
            expect(fxpTelemetryContext.addToGlobalPropertyBag).toHaveBeenCalled();
        });
        it("Then fnHidePageLoader should be called", () => {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
        it("Then logEvent should be called", () => {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
        it("Then logTrace should be called", () => {
            expect(fxpLoggerService.logTrace).toHaveBeenCalled();
        });
        it("Then fxpBreadcrumb should be empty", () => {
            expect($rootScope.fxpBreadcrumb).toEqual([]);
        });
    });
    describe("When actOnBehalfOfUserClick is called and getUserProfileAndClaims throws error", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = { Alias: "User", RoleGroupID: 1 };

            actOnBehalfOfHelper.getUserProfileAndClaims = jasmine.createSpy("getUserProfileAndClaims").and.callFake(function (a) {
                var defer = $q.defer();
                defer.reject({
                    data: { ErrorCode: 404 }
                });
                return defer.promise;
            });
            controller.actOnBehalfOfUserClick();
            $timeout.flush();
        })
        it("Then getUserProfileAndClaims should be called", () => {
            expect(actOnBehalfOfHelper.getUserProfileAndClaims).toHaveBeenCalled();
        });
        it("Then setCurrentUser should be called", () => {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });
        it("Then fnHidePageLoader should be called", () => {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
    });
    describe("When actOnBehalfOfUserClick is called and getObOUserConfiguration thorws error", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            actOnBehalfOfHelper.getObOUserConfiguration = jasmine.createSpy("getObOUserConfiguration").and.callFake(function (a) {
                var defer = $q.defer();
                defer.reject({
                    data: { ErrorCode: 404 }
                });
                return defer.promise;
            });
            $scope.userProfileDoesNotExist = false;
            $scope.selectedUserObject = { Alias: "User", RoleGroupID: 1 };
            sessionStorage["fxpUserClaims_tstusr@microsoft.com"] = "{\"FirstName\": \"Test1\",\"LastName\": \"User1\",\"Alias\": \"tstusr1@microsoft.com\",\"Applications\": {\"FieldExprience\": {\"ApplicationName\": \"FieldExprience\",\"Roles\": {\"FxPAdmin\": {\"RoleName\": \"FxPAdmin\",\"Permissions\": []}, \"LeftNavAdmin\": {\"RoleName\": \"LeftNavAdmin\",\"Permissions\": [{\"ResourceName\": \"AppSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"AppSettings\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"LeftNav\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"LeftNav\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"UserGroupSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"UserGroupSettings\",\"ResourceOperation\": \"Write\"}, {\"ResourceName\": \"UserSettings\",\"ResourceOperation\": \"Read\"}, {\"ResourceName\": \"UserSettings\",\"ResourceOperation\": \"Write\"}]}, \"PageTourAuthor\": {\"RoleName\": \"PageTourAuthor\",\"Permissions\": []}}}}}";
            controller.actOnBehalfOfUserClick();
            $timeout.flush();
        })
        it("Then getObOUserConfiguration should be called", () => {
            expect(actOnBehalfOfHelper.getObOUserConfiguration).toHaveBeenCalled();
        });
        it("Then fnHidePageLoader should be called", () => {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
        it("Then removeOBOUserContext should be called", () => {
            expect(oboUserService.removeOBOUserContext).toHaveBeenCalled();
        });
        it("Then setCurrentUser should be called", () => {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });
        it("Then addMessage should be called", () => {
            expect(fxpMessage.addMessage).toHaveBeenCalled();
        });
        it("Then logError should be called", () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe("When reset is called", () => {
        var controller;
        beforeEach(() => {
            controller = $controller('ActOnBehalfOfController', {
                $scope: $scope,
                $state: $state,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService,
                ActOnBehalfOfHelper: actOnBehalfOfHelper
            });
            controller.reset();
        })
        it("Then getPropBag should be called", () => {
            expect(actOnBehalfOfHelper.getPropBag).toHaveBeenCalled();
        });
        it("Then logEvent should be called", () => {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
        it("Then selectedUser should be empty", () => {
            expect($scope.selectedUser).toEqual("");
        });
        it("Then displayErrorMessage should be empty", () => {
            expect($scope.displayErrorMessage).toEqual(false);
        });
        it("Then selectedUser should be empty", () => {
            expect($scope.userProfileDoesNotExist).toEqual(false);
        });
    });
});