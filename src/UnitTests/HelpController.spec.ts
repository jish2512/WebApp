/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />

//to run the test from this file please execute it via specRunner and click on each specs individually to see the result.
//At present tests are throwing error when run together
import {HelpController} from '../js/controllers/helpController';
declare var angular:any;
describe("Given HelpController", () => {
    var $rootScope, $q, location, $scope, $window, $state, fxpLoggerService, fxpConfigurationService, dashBoardHelper, $controller, deviceFactory, uibModal, createAskOpsConstant, helpArticleImageConstant, $timeout, helpCentralService;
    var isSmallscreen = false;
    const INVALID_SEARCH_PHRASE = "InvalidPhrase";
    var tempHelpMenuCollection = [
        {
            "Icon": "icon icon-helpdetail",
            "OpenInline": "true",
            "DisplayText": "Detailed Help",
            "Href": "#/Help",
            "Value": "Detailed Help",
            "Title": "Detailed Help",
            "Target": "#/Help",
            "StateName": "Help",
            "RouteConfig": "{\"url\":\"/Help\",\"templateUrl\":\"/templates/fxphelp.html\",\"controller\":\"HelpController\",\"requireADLogin\":\"true\"}",
            "ApplicableDevice": "Desktop"
        },
        {
            "Icon": "icon icon-helpbot",
            "OpenInline": "true",
            "DisplayText": "Contact Support Bot",
            "Value": "Contact Support Bot",
            "Title": "Chat with our Support Bot",
            "Target": "sip:itlync@microsoft.com",
            "EventName": "SkypeBotInit",
            "ApplicableDevice": "Desktop"
        }
    ];

    var tenantConfiguration = {
        'TenantId': 'Es'
    };

    var helpArticles = [{ "id": "3caab4c5-934b-4bd9-a91c-b7b3758c36dd", "title": "df", "description": "sadf", "articleContent": null, "appId": "esxp" }, { "id": "a8850f91-73f3-46f9-a075-8d6b7ba9afea", "title": "ed", "description": "sad", "articleContent": null, "appId": "esxp" }, { "id": "016cd13a-c374-4e9f-8038-11aecc011237", "title": "rtfg", "description": "sdf", "articleContent": null, "appId": "esxp" }];

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {
        var propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {
            $provide.service("DashBoardHelper", function () {
                this.fillRoutes = jasmine.createSpy("fillRoutes").and.callFake(function (a) {
                    console.log('fillRoutes : ' + a);
                });
            });


            $provide.service("FxpConfigurationService", function () {
                this.FxpAppSettings = {
                    "FxpHelp": JSON.stringify({
                        "Title": "What can we help you with?",
                        "FxpHelpLinks": [
                            {
                                "DisplayText": "Self-help",
                                "DisplayText_Flyout": "Self Service",
                                "DisplayOrder": "1",
                                "Icon": "icon icon-user",
                                "HelpLinks": [
                                    {
                                        "DisplayText": "Chat with our <i class=\"icon-chatbot\"></i> Support Bot",
                                        "EventName": "SkypeBotInit",
                                        "Href": "sip:itlync@microsoft.com",
                                        "Title": "Chat with our Support Bot",
                                        "DisplayOrder": "1",
                                        "OpenInline": "true",
                                        "Description": "Need assistance? Try asking our support bot, click this link to start a Skype chat.",
                                        "ApplicableDevice": "Desktop"
                                    },
                                    {
                                        "DisplayText": "Access user guides & training",
                                        "Href": "https://aka.ms/GRMTraining",
                                        "Title": "Access user guides & training",
                                        "DisplayOrder": "2",
                                        "Description": "User guides, training decks and quick reference guides for GRM and One Profile."
                                    }
                                ]
                            }]
                    }),
                    "HelpMenuCollection": JSON.stringify({ tempHelpMenuCollection }),
                    "DefaultHelpArticleLimit": "3",
                    "HelpCentralUrl": "https://mockurl/",
                };
                this.FxpBaseConfiguration = {
                    "HelpMenuCollection": tempHelpMenuCollection
                };
                this.FlagInformation = { "EnableHelpMenu": true };
            });

            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b); return propBag();
                });

                this.logPageLoadMetrics = jasmine.createSpy("logPageLoadMetrics").and.callFake(function (a) {
                    console.log(a);
                });

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {
                    console.log('logError : ' + a + ',' + b + ',' + c);
                });
            });
            $provide.service("DeviceFactory", function () {
                this.isSmallScreen = jasmine.createSpy("isSmallScreen").and.callFake(function () {
                    console.log('isMobile: ');
                    return isSmallscreen;
                });
            });
            $provide.service("PageLoaderService", function () {
                this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function () {
                    console.log('fnHidePageLoader: ');
                    return false;
                });
            });
            $provide.service("$location", function () {
                this.path = jasmine.createSpy("path").and.callFake(function (a) {
                    console.log(a);
                });
            });
            $provide.service("$state", function () {
                this.get = jasmine.createSpy("get").and.callFake(function (a) {
                    return true;
                });
            });
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
            $provide.service("CreateAskOpsModalConstant", function () {
                return {
                    ModalOptions: {
                        templateUrl: "../../templates/fxpCreateAskOpsRequestModal.html",
                        windowClass: "create-askops-request-modal",
                        keyboard: true,
                        backdrop: "static",
                        controller: "CreateAskOpsController",
                        controllerAs: "aoCtrl",
                        bindToController: true
                    }
                };
            });
            $provide.service("HelpCentralService", function () {
                this.getContextualHelpArticles = jasmine.createSpy("getContextualHelpArticles").and.callFake(function (a, b, c) {
                    return {
                        then: function (callback) {
                            return callback({ "data": { "result": [{ "id": "3caab4c5-934b-4bd9-a91c-b7b3758c36dd", "title": "df", "description": "sadf", "articleContent": null, "appId": "esxp" }, { "id": "a8850f91-73f3-46f9-a075-8d6b7ba9afea", "title": "ed", "description": "sad", "articleContent": null, "appId": "esxp" }, { "id": "016cd13a-c374-4e9f-8038-11aecc011237", "title": "rtfg", "description": "sdf", "articleContent": null, "appId": "esxp" }] } });
                        }
                    };
                });
                this.getContextualHelpArticleContent = jasmine.createSpy("getContextualHelpArticleContent").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ "data": { "id": null, "title": "df", "description": "sadf", "articleContent": "<p>dsf</p>", "appId": "ESXP" } });
                        }
                    };
                });
                var suggestions = ['Test', 'New Test'];

                this.getSuggestions = jasmine.createSpy("getSuggestions").and.callFake((searchPhrase) => {
                    return {
                        'then': (success, error) => {
                            if (searchPhrase = INVALID_SEARCH_PHRASE) {
                                error("Rejected");
                            }
                            else {
                                success(suggestions);
                            }
                        }
                    }
                });
                this.saveArticleFeedback = jasmine.createSpy("saveArticleFeedback").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ "data": { "id": "3caab4c5-934b-4bd9-a91c-b7b3758c36dd" } });
                        }
                    };
                });
                this.saveArticleViewCount = jasmine.createSpy("saveArticleViewCount").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ "data": { "id": "121" } });
                        }
                    };
                });
            });
            $provide.service("HelpArticleImageModalConstant", function () {
                return {
                    ModalOptions: {
                        templateUrl: "../../bundles/templates/help/help-article-image-modal.html",
                        windowClass: "help-article-image-modal",
                        keyboard: true,
                        backdrop: "static",
                        controller: "HelpArticleImageController",
                        controllerAs: "haiCtrl",
                        bindToController: true
                    }
                };
            });
        })
    })

    beforeEach(angular.mock.inject(function (_$rootScope_, _$location_, _$window_, FxpConfigurationService, FxpLoggerService, DeviceFactory, DashBoardHelper, PageLoaderService, _$state_, $uibModal, CreateAskOpsModalConstant, HelpArticleImageModalConstant, HelpCentralService, _$controller_, _$timeout_) {
        $scope = _$rootScope_.$new();
        $state = _$state_;
        location = _$location_;
        dashBoardHelper = DashBoardHelper;
        fxpLoggerService = FxpLoggerService;
        fxpConfigurationService = FxpConfigurationService;
        deviceFactory = DeviceFactory;
        $controller = _$controller_;
        $window = _$window_;
        uibModal = $uibModal;
        createAskOpsConstant = CreateAskOpsModalConstant;
        helpArticleImageConstant = HelpArticleImageModalConstant;
        helpCentralService = HelpCentralService;
        $timeout = _$timeout_;
        $window.loggedInUserConfig = {
            FxpHelp: {
                "Title": "What can we help you with?",
                "FxpHelpLinks": [
                    {
                        "DisplayText": "Self-help",
                        "DisplayText_Flyout": "Self Service",
                        "DisplayOrder": "1",
                        "Icon": "icon icon-user",
                        "HelpLinks": [
                            {
                                "DisplayText": "Chat with our <i class=\"icon-chatbot\"></i> Support Bot",
                                "EventName": "SkypeBotInit",
                                "Href": "sip:itlync@microsoft.com",
                                "Title": "Chat with our Support Bot",
                                "DisplayOrder": "1",
                                "OpenInline": "true",
                                "Description": "Need assistance? Try asking our support bot, click this link to start a Skype chat.",
                                "ApplicableDevice": "Desktop"
                            },
                            {
                                "DisplayText": "Access user guides & training",
                                "Href": "https://aka.ms/GRMTraining",
                                "Title": "Access user guides & training",
                                "DisplayOrder": "2",
                                "Description": "User guides, training decks and quick reference guides for GRM and One Profile."
                            }
                        ]
                    }]
            }
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
                    "OpenInline": "true"
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
                            },
                            {
                                "DisplayText": "<i class=\"icon icon-helpbot\"></i> Contact Support Bot",
                                "EventName": "SkypeBotInit",
                                "Title": "Chat with our Support Bot",
                                "DisplayOrder": "2",
                                "Description": "Need assistance? Try asking our support bot, click this link to start a Skype chat."
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
                                "DisplayText": "Create AskOps Request",
                                "EventName": "createAskOpsRequest",
                                "Title": "Create AskOps Request",
                                "DisplayOrder": "1",
                                "Description": "Submit a request to get support from operations."
                            },
                            {
                                "DisplayText": "View operations Requests",
                                "Href": "https://microsoft.service-now.com/it/my_items.do?view=open_items",
                                "Title": "View operations Requests",
                                "DisplayOrder": "2",
                                "Description": "Open a page in a new tab to see previously created requests and statuses."
                            },
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

    describe("When HelpController Loaded", () => {
        beforeEach(function () {
            var controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
        })
        it('Then fxpHelpLinks should be defined', function () {
            $scope.$apply();
            expect($scope.fxpHelp).toBeDefined();
        });

    });
    describe("When HelpController Loaded and FxpAppSettings return parsing exception", () => {
        var controller;
        beforeEach(function () {
            fxpConfigurationService.FxpAppSettings.FxpHelp = '{';
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
        })
        it('Then fxpHelpLinks should be defined and empty', function () {
            expect(controller.fxpDefaultHelp).toEqual({});
        });
    });

    describe("When HelpController Loaded and logFxpHelpEvent is called", () => {
        beforeEach(function () {
            var controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.logFxpHelpEvent(tempHelpMenuCollection[1], tempHelpMenuCollection[0]);
        })
        it('Then createPropertyBag method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        });
        it('Then logEvent method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });

    describe("When HelpController Loaded and logFxpHelpEvent is called and it clicked from flyout", () => {
        beforeEach(function () {
            var controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.logFxpHelpEvent(tempHelpMenuCollection[1], tempHelpMenuCollection[0], "FlyoutView");
        })
        it('Then createPropertyBag method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        });
        it('Then logEvent method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });

    describe("When HelpController Loaded and logHelpIconEvent is called and modal is open", () => {
        beforeEach(function () {
            var controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.logHelpIconEvent(true);
        })
        it('Then createPropertyBag method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        });
        it('Then logEvent method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });
    describe("When HelpController Loaded and logHelpIconEvent is called and modal is close", () => {
        beforeEach(function () {
            var controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.logHelpIconEvent(false);
        })
        it('Then createPropertyBag method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.createPropertyBag).not.toHaveBeenCalled();
        });
        it('Then logEvent method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logEvent).not.toHaveBeenCalled();
        });
    });
    describe("When flightHandler is called and botEnabled and askOpsEnabled flighting are enabled", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.$rootScope.initialFlags = { botEnabled: true, askOpsEnabled: true };
            controller.flightHandler();
        })
        it('Then $scope.fxpHelp of HelpController should have bot help link', function () {
            expect(controller.$scope.fxpHelp).toEqual(controller.fxpHelpWithoutFlighting);
        });
    });
    describe("When flightHandler is called and botEnabled flighting is disabled and askOpsEnabled is enabled", () => {
        var controller;

        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.$rootScope.initialFlags = { botEnabled: false, askOpsEnabled: true };
            controller.flightHandler();
        })
        it('Then $scope.fxpHelp of HelpController should not have bot help link', function () {
            expect(controller.$scope.fxpHelp).not.toEqual(controller.fxpHelpWithoutFlighting);
        });
    });
    describe("When flightHandler is called and askOpsEnabled flighting is disabled and botEnabled is enabled", () => {
        var controller;

        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.$rootScope.initialFlags = { botEnabled: true, askOpsEnabled: false };
            controller.flightHandler();
        })
        it('Then $scope.fxpHelp of HelpController should not be changed', function () {
            expect(controller.$scope.fxpHelp).not.toEqual(controller.fxpHelpWithoutFlighting);
        });
    });
    describe("When openCreateAskOpsModal is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.openCreateAskOpsModal();
            $timeout.flush();
        })
        it('Then it should call open method of uibModal', function () {
            expect(uibModal.open).toHaveBeenCalled();
        });
    });
    describe("When expandArticleImage is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory
            });
            controller.expandArticleImage();
            $timeout.flush();
        })
        it('Then it should call open method of uibModal', function () {
            expect(uibModal.open).toHaveBeenCalled();
        });
    });
    describe("When getArticles is called to show limited help articles", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            spyOn(controller, "enableShowMoreLink").and.callThrough();
            controller.getArticles(3, false);
        })
        it('Then it should call getContextualHelpArticles method of HelpCentralService', function () {
            expect(helpCentralService.getContextualHelpArticles).toHaveBeenCalled();
        });
        it('Then it should call enableShowMoreLink method of help controller', function () {
            expect(controller.enableShowMoreLink).toHaveBeenCalled();
        });
        it('Then it should define contextualHelp', function () {
            expect(controller.$scope.contextualHelp.length).toBeGreaterThan(0);
        });
    });

    describe("When getArticles is called to show limited help articles with search string", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            spyOn(controller, "enableShowMoreLink").and.callThrough();
            controller.$scope.searchValue = "new";
            controller.getArticles(3, false);
        })
        it('Then it should call getContextualHelpArticles method of HelpCentralService', function () {
            expect(helpCentralService.getContextualHelpArticles).toHaveBeenCalled();
        });
        it('Then it should call enableShowMoreLink method of help controller', function () {
            expect(controller.enableShowMoreLink).toHaveBeenCalled();
        });
        it('Then it should define contextualHelp', function () {
            expect(controller.$scope.searchedHelp.length).toBeGreaterThan(0);
        });
    });

    describe("When showMoreContextualHelpLinks is called to show more/all help articles", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            spyOn(controller, "getArticles").and.callThrough();
            spyOn(controller, "hideShowMoreLink");
            controller.showMoreContextualHelpLinks();
        })
        it('Then it should call getArticles method of controller', function () {
            expect(controller.getArticles).toHaveBeenCalled();
        });
        it('Then it should define contextualHelp', function () {
            expect(controller.$scope.contextualHelp.length).toBeGreaterThan(0);
        });

        it('Then it should call resetShowMoreLink method of help controller', function () {
            expect(controller.hideShowMoreLink).toHaveBeenCalled();
        });

    });
    describe("When getArticleData is called to show help article content", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            controller.getArticleData(1);
        })
        it('Then it should call getContextualHelpArticleContent method of HelpCentralService', function () {
            expect(helpCentralService.getContextualHelpArticleContent).toHaveBeenCalledWith(1);
        });
        it('Then it should define article', function () {
            expect(controller.$scope.article).toBeDefined();
        });
        it('Then it should call logEvent method of fxpLoggerService', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });

    });
    describe("when getSuggestions method is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });

            controller.searchSuggestions('test');
        })
        it('Then it should call getSuggestions method of helpcentralservice', function () {
            expect(helpCentralService.getSuggestions).toHaveBeenCalledWith('test');
        });
    });

    describe("when getSuggestions method is called with invalid data and error is returned", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            controller.searchSuggestions(INVALID_SEARCH_PHRASE);
        })
        it('Then it should call getSuggestions method of helpcentralservice', function () {
            expect(helpCentralService.getSuggestions).toHaveBeenCalledWith(INVALID_SEARCH_PHRASE);
        });
        it('Then it should call logError method should be called', function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });

    });
    describe("When saveHelpFeedback is called to save help article feedback", () => {
        var controller;
        var articleId = "3caab4c5-934b-4bd9-a91c-b7b3758c36dd";
        var isHelpFul = true;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            controller.saveHelpFeedback(articleId, isHelpFul);
        })
        it('Then it should call saveArticleFeedback method of HelpCentralService', function () {
            var feedback = {
                articleId: '3caab4c5-934b-4bd9-a91c-b7b3758c36dd',
                IsHelpful: true
            }
            expect(helpCentralService.saveArticleFeedback).toHaveBeenCalledWith(feedback);
        });
        //it('Then it should define article', function () {
        //	expect(controller.$scope.article).toBeDefined();
        //});
        it('Then it should call logEvent method of fxpLoggerService', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });

    });

    describe("When saveViewCount is called to save help article view count", () => {
        var controller;
        var articleId = "3caab4c5-934b-4bd9-a91c-b7b3758c36dd";
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            controller.saveViewCount(articleId);
        })
        it('Then it should call saveViewCount method of HelpCentralService', function () {
            expect(helpCentralService.saveArticleViewCount).toHaveBeenCalledWith(articleId);
        });
        it('Then it should call logEvent method of fxpLoggerService', function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });

    });

    describe("When showLoader is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            controller.showLoader(true);
        })
        it("Then showHelpLoader should be true", () => {
            expect(controller.$scope.showHelpLoader).toEqual(true);
        });
    });

    describe("When searchHelpArticles is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            spyOn(controller, "getArticles").and.callThrough();
            controller.searchHelpArticles("new");
        })
        it('Then search value should not be empty', function () {
            expect(controller.$scope.searchValue).not.toEqual("");
        });
        it('Then it should call getArticles method of controller', function () {
            expect(controller.getArticles).toHaveBeenCalled();
        });
        it('Then it should define contextualHelp', function () {
            expect(controller.$scope.searchedHelp.length).toBeGreaterThan(0);
        });
    });

    describe("When onSearchKeyDown is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller('HelpController', {
                $scope: $scope,
                $state: $state,
                $location: location,
                DashBoardHelper: dashBoardHelper,
                FxpConfigurationService: fxpConfigurationService,
                FxpLoggerService: fxpLoggerService,
                DeviceFactory: deviceFactory,
                HelpCentralService: helpCentralService
            });
            var event = { keyCode: 13 }
            spyOn(controller, "searchHelpArticles").and.callThrough();
            controller.onSearchKeyDown(event, "new");
        })
        it('Then it should call searchHelpArticles method of controller', function () {
            expect(controller.searchHelpArticles).toHaveBeenCalled();
        });
    });
});
