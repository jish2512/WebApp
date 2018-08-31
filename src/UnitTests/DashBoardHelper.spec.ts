import {DashBoardHelper} from '../js/factory/DashBoardHelper';
import { Resiliency } from '../js/resiliency/FxpResiliency';
declare var angular:any;
describe('Given Dashboard Helper', function () {

    var uiStateHelper, fxpLoggerService, $state, fxpContextService, fxpTelemetryContext, $rootScope, $log, dashboardHelper, configRoutes, location, $window, fxpRouteService, pageLoaderService, appControllerHelper, userInfoService;

    beforeEach(angular.mock.module('FxPApp'));

    beforeEach(angular.mock.module('ui.router'));

    beforeEach(function () {

        configRoutes = {
            Routes: [
                {
                    "StateName": "DashBoard",
                    "RouteConfig": "{\"url\":\"/Home\",\"templateUrl\":\"https://fxppartnerapp.azurewebsites.net/GrmDashboard.html\",\"resolve\":{\"getResource\":\"resolveResource()\" ,\"promiseObjet\":\"promiseService(\\\"Stack\\\",\\\"9898\\\")\" },\"controller\":\"grmDashboardCtrl\",\"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "Dashboard",
                    "RequiredModules": "missingModule"
                },
                {
                    "StateName": "ActOnBehalf",
                    "RouteConfig": "{\"url\":\"/ActOnBehalf\",\"templateUrl\":\"/templates/OnBehalfOf.html\",\"controller\":\"ActOnBehalfOfController\",\"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "Act On Behalf"
                },
                {
                    "StateName": "RequestResource",
                    "RouteConfig": "{ \"url\":\"/ReqResource/:par1/:par2\",\"templateUrl\":\"https://fxppartnerapp.azurewebsites.net/GrmRequestResourceTemplate.html\", \"controller\": \"GrmRequestResourceCtrl\", \"requireADLogin\": \"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "GRM Request Resource"
                },
                {
                    "StateName": "NamedView",
                    "RouteConfig": "{\"url\":\"/namedviews\",\"views\":{\"\": {\"templateUrl\":\"https://fxppartnerapp.azurewebsites.net/SelfHostPage.html\",\"resolve\":{\"getResource\":\"resolveResource()\" ,\"promiseObjet\":\"promiseService(\\\"Stack\\\",\\\"9898\\\")\" },\"controller\":\"SelfHostCtrl\",\"controllerAs\":\"vm\"},\"content@NamedView\": {\"templateUrl\": \"https://fxppartnerapp.azurewebsites.net/NamedView.html\"},\"controller\":\"NamedCtrl\" },\"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "Named view state"
                },
                {
                    "StateName": "SelfHost",
                    "RouteConfig": "{ \"url\":\"/selfhost/:par1?par2\",\"templateUrl\":\"https://fxppartnerapp.azurewebsites.net/SelfHostPage.html\", \"controller\": \"SelfHostCtrl\", \"requireADLogin\": \"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "Self Host Partner"
                },
                {
                    "StateName": "oneprofile",
                    "RouteConfig": "{\"templateUrl\":\"https://oneprofilefxpcdn.azureedge.net/js/App/OneProfile/Templates/one-profile-master.html\",   \"controller\": \"oneProfileController\", \"AppHeader\":\"OPSScreen\", \"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "One Profile"
                },
                {
                    "StateName": "profile",
                    "RouteConfig": "{\"url\":\"^/profile/:alias\",\"templateUrl\":\"https://oneprofilefxpcdn.azureedge.net/js/App/OneProfile/Templates/profile-user.html\", \"controller\": \"ProfileController as profileCtrl\", \"AppHeader\":\"OPSScreen\",\"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "One Profile"
                },

                {
                    "StateName": "oneprofile.CreateUserProfile",
                    "RouteConfig": "{\"url\":\"^/CreateUserProfile\",\"templateUrl\":\"https://oneprofilefxpcdn.azureedge.net/js/App/OneProfileAdmin/Templates/create-profile.html\", \"controller\": \"adminCreateProfileController\", \"AppHeader\":\"OPSScreen\",\"requireADLogin\":\"true\"}",
                    "Style": "icon icon-people",
                    "AppHeader": "Create Profile"
                }
            ],

            "FxpHelpLinks": [
                {
                    "DisplayText": "IT Support",
                    "DisplayOrder": "1",
                    "HelpLinks": [
                        {
                            "DisplayText": "Create a Support Ticket",
                            "Href": "https://aka.ms/fxpsupport",
                            "Title": "Create a Support Ticket ",
                            "DisplayOrder": "1"
                        }
                    ]
                }
            ]
        }

        angular.mock.module(function ($provide) {

            $provide.provider("UIStateHelper", function () {
                this.$get = function UIStateHelper() {
                    function UIStateManager() { }

                    UIStateManager.prototype.init = jasmine.createSpy("init").and.callFake(function () {
                        console.log('UIStateManager - init ');
                    });

                    UIStateManager.prototype.otherwise = jasmine.createSpy("otherwise").and.callFake(function (a) {
                        console.log('UIStateManager - otherwise ' + a);
                    });

                    return new UIStateManager();
                }
            });

            $provide.service("FxpTelemetryContext", function () {

                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "geography";
                });

                this.getUserID = jasmine.createSpy("getUserID").and.callFake(function () {
                    return "101"
                });

                this.getUserRole = jasmine.createSpy("getUserRole").and.callFake(function () {
                    return "General User"
                });

            });

            $provide.service("FxpContextService", function () {

                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b) {
                    console.log('saveContext : ' + a + ',' + b);
                });

                this.deleteContext = jasmine.createSpy("deleteContext").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({
                                "FirstName": "firstName",
                                "LastName": "lastName"
                            });
                        }
                    }
                });

            });

            $provide.service("FxpLoggerService", function () {

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log('logInformation : ' + a + ',' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b) {
                    console.log('logError : ' + a + ',' + b);
                });

                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    console.log('logMetric : ' + a + ', ' + b + ', ' + c + ', ' + d);
                });

                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {

                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });

                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a) {
                    console.log('startTrackPerformance : ' + a);
                });

                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a) {
                    console.log('stopTrackPerformance : ' + a);
                });


            });

            $provide.service("PageLoaderService", function () {
                this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function () {
                    console.log('hided');
                });
                this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a) {
                    console.log('show');
                });
                this.fnShowPageLoaderStep = jasmine.createSpy("fnShowPageLoaderStep").and.callFake(function (a) {
                    console.log('Show Step');
                });
            });

            $provide.service("FxpRouteService", function () {
                this.setDefaultStateName = jasmine.createSpy("setDefaultStateName").and.callFake(function (stateName) {
                    console.log("setDefaultStateName method called with " + stateName);
                });
            });
            $provide.service("AppControllerHelper", function () {
                this.handleAdalErrorsLoadingDashboard = jasmine.createSpy("handleAdalErrorsLoadingDashboard").and.callFake(function () {
                    console.log('handleAdalErrorsLoadingDashboard : ');
                });
            });
            $provide.service("UserInfoService", function () {
                this.getCurrentUserContext = jasmine.createSpy("getCurrentUserContext").and.callFake(function () {
                    console.log('getCurrentUserContext : ');
                    return {
                        userInfo: { alias: 'test1'},
                        userClaims: {defaultAppRole: "ES.DeliveryResource"}
                    }
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$state_, _UIStateHelper_, FxpLoggerService, FxpTelemetryContext, FxpContextService, FxpRouteService, _$location_, _PageLoaderService_, _DashBoardHelper_, _$log_, _$window_, AppControllerHelper, UserInfoService) {
        $rootScope = _$rootScope_;
        $state = _$state_;
        uiStateHelper = _UIStateHelper_;
        fxpLoggerService = FxpLoggerService;
        fxpTelemetryContext = FxpTelemetryContext;
        fxpContextService = FxpContextService;
        fxpRouteService = FxpRouteService;
        location = _$location_;
        dashboardHelper = _DashBoardHelper_;
        $log = _$log_;
        $window = _$window_;
        pageLoaderService = _PageLoaderService_;
        appControllerHelper = AppControllerHelper;
        userInfoService = UserInfoService;
        spyOn($state, 'go');
    }));

    let fxpUIConstants = {
        UIStrings: {
            LoadingStrings: {
                "Authenticating": "Authenticating",
                "LoadingProfile": "Loading Profile",
                "LoadingDashboard": "Loading Dashboard"
            }
        }
    }
    beforeEach(function () {
        $rootScope.fxpUIConstants = fxpUIConstants;
    });
    describe('When getResolveMembers method gets called along with object which have methods and if we call the key of an object', () => {
        var response;
        beforeEach(function () {
            var resolveObjects = {
                getResource: 'resolveResource()'
            };
            spyOn(console, "log").and.callThrough();
            $window.resolveResource = jasmine.createSpy("resolveResource").and.callFake(function () {
                console.log("resolveResolve has been called")
            });
            response = dashboardHelper.getResolveMembers(resolveObjects);
            response.getResource();
        })

        it('Then it should invoke the method which is assigned to that key', () => {
            expect($window.resolveResource).toHaveBeenCalled();
        });

        it('Then it should log the message in console window', () => {
            expect(console.log).toHaveBeenCalledWith("resolveResolve has been called");
        });
    });

    describe('When getResolveMembers method gets called along with object which have methods with parameters and if we call the key of an object', () => {
        var response;
        beforeEach(function () {
            var resolveObjects = {
                promiseObjet: 'promiseService("Stack","9898")'
            };

            spyOn(console, "log").and.callThrough();
            $window.promiseService = jasmine.createSpy("promiseService").and.callFake(function (a, b) {
                console.log("promiseService has been called with " + a + ', ' + b);
            });
            response = dashboardHelper.getResolveMembers(resolveObjects);
            response.promiseObjet();
        })

        it('Then it should invoke the method which is assigned to that key', () => {
            expect($window.promiseService).toHaveBeenCalledWith("Stack", "9898");
        });

        it('Then it should log the message in console window', () => {
            expect(console.log).toHaveBeenCalledWith("promiseService has been called with Stack, 9898");
        });
    });


    describe('When updateResolveObjects method gets called by passing Config Routes object which having views key', () => {
        var resolveObjects, viewResolveObject;
        beforeEach(function () {
            resolveObjects = JSON.parse(configRoutes.Routes[3].RouteConfig);
            viewResolveObject = resolveObjects.views[""].resolve;
            spyOn(dashboardHelper, 'getResolveMembers').and.callThrough();
            dashboardHelper.updateResolveObjects(resolveObjects);
        })

        it('Then getResolveMembers method of dashboardHelper should have been called', () => {
            expect(dashboardHelper.getResolveMembers).toHaveBeenCalledWith(viewResolveObject);
        });
    });

    describe('When updateResolveObjects method gets called if uirouteConfigObjects is undefined', () => {
        beforeEach(function () {
            var uirouteConfigObjects = undefined;
            dashboardHelper.updateResolveObjects(uirouteConfigObjects);
        })

        it('Then it should handle the exception and logError method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    })

    describe('When fillRoutes method gets called if $rootScope.actOnBehalfOfUserActive is true', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });
            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });
            $rootScope.actOnBehalfOfUserActive = true;
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  logInformation method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.actOnBehalfofuser', 'FillFxpRoutes Started');
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.actOnBehalfofuser', "FillFxpRoutes End");
        })

    })

    describe('When fillRoutes method gets called if $rootScope.actOnBehalfOfUserActive is false', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });
            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });
            $rootScope.actOnBehalfOfUserActive = false;
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  logInformation method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.LoggedinUser', 'FillFxpRoutes Started');
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.LoggedinUser', "FillFxpRoutes End");
        })
    })

    describe('When fillRoutes method gets called if fxpConfig is not undefined', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });
            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });

            spyOn(dashboardHelper, 'updateResolveObjects').and.callThrough();

            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  saveContext method of fxpContextService should have been called', () => {
            expect(fxpContextService.saveContext).toHaveBeenCalledWith('UIConfigDB', JSON.stringify(configRoutes));
        })

        it('Then  startTrackPerformance method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.startTrackPerformance).toHaveBeenCalledWith('LoadRoutes');
        })

        it('Then updateResolveObjects of dashboardHelper should have been called', () => {
            expect(dashboardHelper.updateResolveObjects).toHaveBeenCalled();
        })

        it('Then  addState method of uiStateHelper should have been called', () => {
            expect(uiStateHelper.addState).toHaveBeenCalled();
        })

        it('Then  stopTrackPerformance method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.stopTrackPerformance).toHaveBeenCalledWith('LoadRoutes');
        })

        it('Then  otherwise method of uiStateHelper should have been called', () => {
            expect(uiStateHelper.otherwise).toHaveBeenCalledWith('/DashBoard');
        })

        it('Then  stopTrackPerformance method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.stopTrackPerformance).toHaveBeenCalledWith('DashboardLoad');
            expect(fxpLoggerService.stopTrackPerformance).toHaveBeenCalledWith('FxpLoad');
        })
    })

    describe('When fillRoutes method gets called if sessionStorage["startTime"] value is defined', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });
            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });
            sessionStorage["startTime"] = new Date();
            configRoutes.Routes.splice(0, 1);
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  createPropertyBag method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.createPropertyBag).toHaveBeenCalled();
        })

        it('Then  getUserRole method of fxpTelemetryContext should have been called', () => {
            expect(fxpTelemetryContext.getUserRole).toHaveBeenCalled();
        })

        it('Then  getGeography method of fxpTelemetryContext should have been called', () => {
            expect(fxpTelemetryContext.getGeography).toHaveBeenCalled();
        })

        it('Then  getUserID method of fxpTelemetryContext should have been called', () => {
            expect(fxpTelemetryContext.getUserID).toHaveBeenCalled();
        })

        it('Then logMetric  method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logMetric).toHaveBeenCalled();
        })

        it('Then sessionStorage["startTime"] value should be set to null', () => {
			expect(sessionStorage["startTime"]).toEqual('null');
        })
    })

    describe('When fillRoutes method gets called if addState of UIStateHelper method thrown Error', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });

            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  logError method of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        })
    });


    describe('When fillRoutes method gets called if sessionStorage["REQSTATE"] value changed to /profile/alias', () => {

        beforeEach(function () {

            location.path = jasmine.createSpy("path").and.callFake(function (a) {
                return "view";
            });

            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });

            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });

            $state.go = jasmine.createSpy("go").and.callFake(function (a, b, c) {
                return "view";
            });

            sessionStorage["REQSTATE"] = "/profile/alias";
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  it should  navigate to the requested url using location.path', () => {
            expect(location.path).toHaveBeenCalledWith('/profile/alias');
        })
    });

    describe('When fillRoutes method gets called if sessionStorage["REQSTATE"] value changed to /', () => {

        beforeEach(function () {

            location.path = jasmine.createSpy("path").and.callFake(function (a) {
                return "view";
            });

            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });

            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });

            $state.go = jasmine.createSpy("go").and.callFake(function (a, b, c) {
                return "view";
            });

            sessionStorage["REQSTATE"] = "/";
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then  it should  navigate to the default state using $state.go', () => {
            expect($state.go).toHaveBeenCalledWith('DashBoard', {}, { location: "replace" });
        })
    });

    describe('When fillRoutes method gets called with some state having missing dependency', () => {

        beforeEach(function () {
            $state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/DashBoard";
            });
            uiStateHelper.addState = jasmine.createSpy("addState").and.callFake(function (a, b) {
                console.log('addState : ' + a + ',' + b);
            });
            sessionStorage["startTime"] = new Date();
            configRoutes.Routes.splice(0, 1);
            dashboardHelper.fillRoutes(configRoutes);
        })

        it('Then states should be marked as missing dependencies', () => {
            expect($rootScope.configRouteStates[0].data.stateModulesMissing).toBeDefined();
        })
        
    });

});