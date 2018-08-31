
import {DashBoardController} from '../js/controllers/dashBoardController';
declare var angular:any;
describe("Given DashBoardController", () => {
    var uiStateHelper, $scope, $rootScope, $controller, fxpLoggerService, adalService, userProfileService, userInfoService, fxpMessageService, oboUserService, dashBoardHelper, fxpTelemetryContext, fxpContextService, fxpConfigurationService, dashboardcontroller, $window, dashboardService, fxpFeedbackService;    beforeEach(angular.mock.module('FxPApp'));
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
                    console.log('logInformation : ' + a + ',' + b + ',' + c );
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

            $provide.service("FxpConfigurationService", function () {
                var configData = { "FxpHelpLinks": "[{\"DisplayText\":\"IT Support\",\"HelpLinks\":[{\"DisplayText\":\"Create a Support Ticket\",\"Href\":\"https://aka.ms/fxpsupport\"}]}]"};
                this.FxpAppSettings = configData;
                this.FxpBaseConfiguration = {                    
                    "FxpFooterData": [{
                        "ElementType": "a",
                        "DisplayText": "Terms of Use",
                        "href": "https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx",
                        "TabIndex": "402",
                        "target": "_blank",
                        "cssClass": "footer-item pull-right"
                    }],
                    "FxpHeaderLogo": {
                        "imgUrl" :"/assets/logo/esxplogo.png"
                    },
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

            $provide.service("FxpFeedbackService", function () {
                this.setFeedbackItemCollection = jasmine.createSpy("setFeedbackItemCollection").and.callFake(function (a) {
                    console.log("setFeedbackItemCollection "+ a);
                });
                this.setFeedbackEndpoint = jasmine.createSpy("setFeedbackEndpoint").and.callFake(function (a) {
                    console.log("setFeedbackEndpoint " + a);
                });
                this.setSubscriprtionId = jasmine.createSpy("setSubscriprtionId").and.callFake(function (a) {
                    console.log("setSubscriprtionId " + a);
                });
                this.setUserDetailsToFeedback = jasmine.createSpy("setUserDetailsToFeedback").and.callFake(function () {
                    console.log("setUserDetailsToFeedback method called");
                });
                this.getFeedbackPropBagItems = jasmine.createSpy("getFeedbackPropBagItems").and.callFake(function () {
                    console.log("getFeedbackPropBagItems method called");
                    var item = { key1: "value1" };
                    return item;
                });
                this.getFeedbackItemCollection = jasmine.createSpy("getFeedbackItemCollection").and.callFake(function () {
                    console.log("getFeedbackItemCollection method called");
                    var item = { key1: "value1" };
                    return item;
                });
                this.getSubscriprtionId = jasmine.createSpy("getSubscriprtionId").and.callFake(function () {
                    console.log("getSubscriprtionId method called");                    
                    return "123";
                });
                this.getFeedbackEndpoint = jasmine.createSpy("getFeedbackEndpoint").and.callFake(function () {
                    console.log("getFeedbackEndpoint method called");                    
                    return "xyz";
                });
                this.logFeedbackInformation = jasmine.createSpy("logFeedbackInformation").and.callFake(function (a,b,c,d) {
                    console.log("logFeedbackInformation method called " + a + ',' + b + ',' + c + ',' + d);
                });
            });
        });

    });


    beforeEach(angular.mock.inject(function (UIStateHelper, _$rootScope_, FxpLoggerService, adalAuthenticationService, UserProfileService, UserInfoService, FxpMessageService, OBOUserService, DashBoardHelper, FxpTelemetryContext, FxpContextService, FxpConfigurationService, DashboardService, FxpFeedbackService, _$controller_, _$window_) {
        $scope = _$rootScope_.$new();
        uiStateHelper = UIStateHelper;
        $rootScope = _$rootScope_;
        fxpLoggerService = FxpLoggerService;
        adalService = adalAuthenticationService;
        userProfileService = UserProfileService;
        userInfoService = UserInfoService;
        fxpMessageService = FxpMessageService;
        oboUserService = OBOUserService;
        dashBoardHelper = DashBoardHelper;
        fxpTelemetryContext = FxpTelemetryContext;
        fxpContextService = FxpContextService;
        fxpConfigurationService = FxpConfigurationService;
        dashboardService = DashboardService;
        fxpFeedbackService = FxpFeedbackService;
        $controller = _$controller_;
        $window = _$window_;


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
            "RoleGroup":2
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
                }
            }
        };
    })

    describe("When Dashboard Controller Loaded", () => {

        beforeEach(function () {
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })

        it('Then OBOUIStrings should be defined', function () {
            expect($scope.oboUIStrings).toEqual($rootScope.fxpUIConstants.UIStrings.OBOUIStrings);
        });

        it('Then $scope.closeActOnBehalofUserClick value should be defined', function () {         
            expect($scope.closeActOnBehalofUserClick).toBeDefined();
        });

        it('Then $scope.pullFocusToElement value should be defined', function () {
            expect($scope.pullFocusToElement).toBeDefined();
        });

        it('Then fillRoutes method of dashBoardHelper should have been called', function () {
            expect(dashBoardHelper.fillRoutes).toHaveBeenCalledWith($rootScope.currentRoutes);
        });

        it('Then updateRoleGroupInUserInfoSession method of dashboardService should have been called', function () {
            expect(dashboardService.updateRoleGroupInUserInfoSession).toHaveBeenCalled();
        });
    });
    describe("When Dashboard Controller Loading and FxpConfigFetching is failed", () => {
        beforeEach(function () {
            $window.isFxpConfigFetched = false;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })

        it('Then fxpConfigurationFailed method of dashboardService should have been called', function () {
            expect(dashboardService.fxpConfigurationFailed).toHaveBeenCalled();
        });

    });

    describe("When Dashboard Controller Loaded and  FxpFooter object is defined ", () => {

        beforeEach(function () {            
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })

        it('Then $scope.footerdata should be equal to FxpFooterData value of FxpBaseConfiguration object ', function () {
            expect($scope.footerdata).toEqual(fxpConfigurationService.FxpBaseConfiguration.FxpFooterData);
        });

    });

    describe("When Dashboard Controller Loaded and  FxpFooter object is not defined ", () => {
        beforeEach(function () {
            fxpConfigurationService.FxpBaseConfiguration.FxpFooterData = undefined;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })
        it('Then $scope.footerdata should be undefined ', function () {
            expect($scope.footerdata).toEqual(undefined);
        });

    });


    describe("When Dashboard Controller Loaded and  FxpFooter collection is defined ", () => {
        beforeEach(function () {
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })
        it('Then ElementType of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].ElementType).toEqual("a");
        });

        it('Then DisplayText of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].DisplayText).toEqual("Terms of Use");
        });

        it('Then TabIndex of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].TabIndex).toEqual("402");
        });

        it('Then cssClass of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].cssClass).toEqual("footer-item pull-right");
        });
        it('Then href of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].href).toEqual("https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx");
        });

        it('Then target of $scope.footerdata should have some value ', function () {
            expect($scope.footerdata[0].target).toEqual("_blank");
        });
    });

    describe("When Dashboard Controller Loaded and  FxpFooter collection is not defined ", () => {
        beforeEach(function () {
            fxpConfigurationService.FxpBaseConfiguration.FxpFooterData = [];
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })
        it('Then length of $scope.footerdata should be zero ', function () {
            expect($scope.footerdata.length).toEqual(0);
        });

    });    

    describe("When Dashboard Controller Loaded if $rootScope.actOnBehalfOfUserActive is true", () => {

        beforeEach(function () {
            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })

        it('Then getOBOUserRoutes method of OBOUserService should have been called', function () {          
            expect(oboUserService.getOBOUserRoutes).toHaveBeenCalled();         
        });

        it('Then $rootScope.currentRoutes value should get from getOBOUserRoutes method of OBOUserService', function () {
            var routes = oboUserService.getOBOUserRoutes();           
            expect($rootScope.currentRoutes).toEqual(routes);
        });

        it('Then getOBOUser method of OBOUserService should have been called', function () {
            expect(oboUserService.getOBOUser).toHaveBeenCalled();
        });

        it('Then $scope of OBOUser object should have been updated ', function () {
            expect($scope.OBOUser.name).toEqual("displayName");
            expect($scope.OBOUser.href).toEqual("href");
            expect($scope.OBOUser.alias).toEqual("alias");
        });        
    });   

    describe("When Dashboard Controller Loaded if $rootScope.actOnBehalfOfUserActive is true and OBOUser alias is undefined", () => {
        beforeEach(function () {
            oboUserService.getOBOUser = jasmine.createSpy("getOBOUser").and.callFake(function () {
                return {
                    displayName: "displayName",
                    href: "href"
                }
            });

            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })

        it('Then oboUserService method of getOBOUser should have been called ', function () {
            expect(oboUserService.getOBOUser).toHaveBeenCalled();           
        });
        it('Then addMessage method of fxpMessageService should have been called ', function () {                    
            expect(fxpMessageService.addMessage).toHaveBeenCalledWith("OBO user alias is not found", "error");
        });
    });

    describe("When Dashboard Controller Loaded if $rootScope.actOnBehalfOfUserActive is false", () => {
        beforeEach(function () {
            $rootScope.actOnBehalfOfUserActive = false;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
        })
        it('Then $rootScope.currentRoutes should get from loggedInUserConfig ', function () {      
            expect($rootScope.currentRoutes).toEqual($window.loggedInUserConfig);
        });
    });

    describe("When Dashboard Controller Loaded then after if $rootScope.actOnBehalfOfUserActive value gets changed from false to true", () => {

        beforeEach(function () {

            $rootScope.actOnBehalfOfUserActive = false;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            $rootScope.$digest();
            $rootScope.$apply('actOnBehalfOfUserActive=true');
        })


        it('Then getOBOUserRoutes method of OBOUserService should have been called', function () {
            expect(oboUserService.getOBOUserRoutes).toHaveBeenCalled();
        });

        it('Then $rootScope.currentRoutes value should get from getOBOUserRoutes method of OBOUserService', function () {
            var routes = oboUserService.getOBOUserRoutes();
            expect($rootScope.currentRoutes).toEqual(routes);
        });

        it('Then getOBOUser method of OBOUserService should have been called', function () {
            expect(oboUserService.getOBOUser).toHaveBeenCalled();
        });

        it('Then $scope of OBOUser object should have been updated', function () {
            expect($scope.OBOUser.name).toEqual("displayName");
            expect($scope.OBOUser.href).toEqual("href");
            expect($scope.OBOUser.alias).toEqual("alias");
        });

        it('Then fillRoutes method of dashBoardHelper should have been called with $rootScope.currentRoutes', function () {
            expect(dashBoardHelper.fillRoutes).toHaveBeenCalledWith($rootScope.currentRoutes);
        });

    });

    describe("When Dashboard Controller Loaded then after if $rootScope.actOnBehalfOfUserActive value gets changed from true to false", () => {

        beforeEach(function () {

            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });

            $rootScope.$digest();
            $rootScope.$apply('actOnBehalfOfUserActive=false');
        })

        it('Then removeOBOUserContext method of OBOUserService should have been called', function () {
            expect(oboUserService.removeOBOUserContext).toHaveBeenCalled();
        });

        it('Then $rootScope.currentRoutes should get from loggedInUserConfig ', function () {
            expect($rootScope.currentRoutes).toEqual($window.loggedInUserConfig);
        });

        it('Then fillRoutes method of dashBoardHelper should have been called with $rootScope.currentRoutes', function () {
            expect(dashBoardHelper.fillRoutes).toHaveBeenCalledWith($rootScope.currentRoutes);
        });
    });

    describe("When closeActOnBehalofUserClick method gets called", () => {

        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            dashboardcontroller.closeActOnBehalofUserClick();
        })

        it('Then createPropertyBag method of fxpLoggerService should have been called ', function () {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();          
        });

        it('Then logTrace method of fxpLoggerService should have been called ', function () {                      
           expect(fxpLoggerService.logTrace).toHaveBeenCalledWith('Fxp.closeactOnBehalfofuser', "close actOnBehalfOfUser Started");
        });

        it('Then setCurrentUser method of userProfileService should have been called ', function () {          
            expect(userProfileService.setCurrentUser).toHaveBeenCalledWith('LoggedInUser');
        });

        it('Then removeOBOUserContext method of oboUserService should have been called ', function () {           
            expect(oboUserService.removeOBOUserContext).toHaveBeenCalledWith();
        });

        it('Then removeFromGlobalPropertyBag method of fxpTelemetryContext should have been called ', function () {          
            expect(fxpTelemetryContext.removeFromGlobalPropertyBag).toHaveBeenCalledWith('OnBehalfOfUserUpn');
            expect(fxpTelemetryContext.removeFromGlobalPropertyBag).toHaveBeenCalledWith('ActonBehalfMode');
            expect(fxpTelemetryContext.removeFromGlobalPropertyBag).toHaveBeenCalledWith('OnBehalfOfUserBusinessRoleId');
            expect(fxpTelemetryContext.removeFromGlobalPropertyBag).toHaveBeenCalledWith('OnBehalfOfUserBusinessRole');
        });    
    });

    describe("When closeActOnBehalofUserClick method gets called if removeOBOUserContext method of oboUserService thrown error", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            oboUserService.removeOBOUserContext = jasmine.createSpy("removeOBOUserContext").and.callFake(function () {
                console.log('removeOBOUserContext');
                throw new Error();
            });
            dashboardcontroller.closeActOnBehalofUserClick();
        })

        it('Then it should handle the exception and addMessage method of fxpMessageService should have been called ', function () {
            expect(fxpMessageService.addMessage).toHaveBeenCalledWith('Exception occurred', 'error');
        });

        it('Then it should handle the exception and logError method of fxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    })

    describe("When Dashboard Controller Loaded and FeedbackContext event is broadcasted", () => {

        beforeEach(function () {
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            $rootScope.$broadcast("FeedbackContext");
        })

        it('Then getFeedbackPropBagItems of fxpFeedbackService should have been called', function () {
            expect(fxpFeedbackService.getFeedbackPropBagItems).toHaveBeenCalled();
        });
        it('Then $scope.feedbackContextItem value should be defined', function () {
            var item = { key1: "value1" };
            expect($scope.feedbackContextItem).toEqual(item);
        });
    });

    describe("When Dashboard Controller Loaded and FeedbackConfiguration event is broadcasted", () => {

        beforeEach(function () {
            var controller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            $rootScope.$broadcast("FeedbackConfiguration");
        })

        it('Then getFeedbackItemCollection of fxpFeedbackService should have been called', function () {
            expect(fxpFeedbackService.getFeedbackItemCollection).toHaveBeenCalled();
        });
        it('Then getFeedbackItemCollection of fxpFeedbackService should have been called', function () {
            expect(fxpFeedbackService.getSubscriprtionId).toHaveBeenCalled();
        });
        it('Then getFeedbackItemCollection of fxpFeedbackService should have been called', function () {
            expect(fxpFeedbackService.getFeedbackEndpoint).toHaveBeenCalled();
        });
        it('Then $scope.feedbackConfiguration value should be defined', function () {
            expect($scope.feedbackConfiguration).toBeDefined();
        });
    });

    describe("When toggleLeftNavExpandedState method gets called", () => {
        var isToggleLeftNavExpandedStateBroadcasted;
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            $scope.$on("toggleLeftNavExpandedState", function () {
                isToggleLeftNavExpandedStateBroadcasted = true;
            });
            dashboardcontroller.toggleLeftNavExpandedState();
        })

        it('Then toggleLeftNavExpandedState event should be broadcasted ', function () {
            expect(isToggleLeftNavExpandedStateBroadcasted).toEqual(true);
        });        
    });
    describe("When onSendUserFeedbackInfoError gets called and action type is Submit", () => {        
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Submit"
                }
            }           
            dashboardcontroller.onSendUserFeedbackInfoError(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });
    describe("When onSendUserFeedbackInfoError gets called and action type is Cancel", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Cancel"
                }
            }
            dashboardcontroller.onSendUserFeedbackInfoError(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });
    describe("When onSendUserFeedbackInfoError gets called and action type is Click", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Click"
                }
            }
            dashboardcontroller.onSendUserFeedbackInfoError(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });
    describe("When onSendUserFeedbackInfo gets called and action type is Submit", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Submit"
                }
            }
            dashboardcontroller.onSendUserFeedbackInfo(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });
    describe("When onSendUserFeedbackInfo gets called and action type is Cancel", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Cancel"
                }
            }
            dashboardcontroller.onSendUserFeedbackInfo(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });
    describe("When onSendUserFeedbackInfo gets called and action type is Click", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var feedbackResponse = {
                tags: {
                    Action: "Click"
                }
            }
            dashboardcontroller.onSendUserFeedbackInfo(feedbackResponse);
        })

        it('Then fxpFeedbackService.logFeedbackInformation should have been called', function () {
            expect(fxpFeedbackService.logFeedbackInformation).toHaveBeenCalled();
        });
    });

    describe("When logFooterUsageTelemetryInfo gets called", () => {
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            var footerItem = {
                href: "xyz",
                DisplayText: "ABC"
            }
            dashboardcontroller.logFooterUsageTelemetryInfo(footerItem);
        })

        it('Then fxpLoggerService.logInformation should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });

        it('Then createPropertyBag method of fxpLoggerService should have been called ', function () {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        }); 
    });

    describe("When updateHeaderLogo method gets called with headerLogo object", () => {
        var headerLogo;
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            headerLogo = {
                imgUrl: "/assets/logo/saleslogo.png",
                DisplayText: "ABC"
            }
            dashboardcontroller.updateHeaderLogo(headerLogo);
        })

        it('Then $scope.headerLogo should be updated with saleslogo', function () {
            expect($scope.headerLogo.imgUrl).toEqual("/assets/logo/saleslogo.png");
        });
    });
    describe("When updateHeaderLogo method gets called with undefined value", () => {        
        beforeEach(function () {
            dashboardcontroller = $controller('DashBoardController', {
                $scope: $scope,
                UIStateHelper: uiStateHelper,
                _$rootScope_: $rootScope,
                FxpLoggerService: fxpLoggerService,
                adalAuthenticationService: adalService,
                UserProfileService: userProfileService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessageService,
                OBOUserService: oboUserService,
                DashBoardHelper: dashBoardHelper,
                FxpTelemetryContext: fxpTelemetryContext,
                FxpContextService: fxpContextService,
                FxpConfigurationService: fxpConfigurationService
            });
            dashboardcontroller.updateHeaderLogo(undefined);
        })

        it('Then $scope.headerLogo should be updated with default logo', function () {
            expect($scope.headerLogo.imgUrl).toEqual("/assets/logo/esxplogo.png");
        });
    });
});