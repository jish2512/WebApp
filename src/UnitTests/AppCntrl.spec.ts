import { AppController } from '../js/controllers/appCntrl';
import { Subject } from 'rxjs';
declare var angular: any;
describe("Given AppController", () => {
    var $controller, $rootScope, $scope, $location, $state, fxpUIData, fxpLoggerService, userProfileService, adalService,
        pageLoaderService, appControllerHelper, deviceFactory, fxpConfigurationService, fxpBreadcrumbService,
        fxpMessageService, fxpBotService, $window, featureFlagService, startUpFlightConfig, plannedDownTimeService,
        sessionTimeoutModalFactory, $timeout, $q, $compile, $document, controller, pageTourEventService, fxpStateTransitionService, subjects;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(() => {
        angular.mock.module(function ($provide) {
            $provide.service('FxpUIData', function () {
                this.setAppHeaderFromRoute = jasmine.createSpy("setAppHeaderFromRoute").and.callFake(function (a) {
                    console.log("setAppHeaderFromRoute " + a);
                });
                this.setPageTitleFromRoute = jasmine.createSpy("setPageTitleFromRoute").and.callFake(function (a) {
                    console.log("setPageTitleFromRoute " + a);
                });
            });
            $provide.service('FxpLoggerService', function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    return {
                        addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                            console.log('propbag =>' + a + ':' + b);
                        })
                    };
                });
                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log('logInformation : ' + a + ',' + b);
                });
                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b) {
                    console.log('logEvent : ' + a + ',' + b);
                });
                this.setPageLoadMetrics = jasmine.createSpy("setPageLoadMetrics").and.callFake(function (a, b) {
                    console.log('setPageLoadMetrics : ' + a + ',' + b);
                });
            });
            $provide.service('UserProfileService', function () {

            });
            $provide.service('PageTourEventService', function () {

            });
            $provide.service('adalAuthenticationService', function () {
                this.userInfo = {
                    isAuthenticated: false
                }
            });
            $provide.service('PageLoaderService', function () {
                this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a) {
                    console.log('fnShowPageLoader : ' + a);
                });
            });
            $provide.service('AppControllerHelper', function () {
                this.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function (a) {
                    console.log("getBasicProfile " + a);
                });
                this.postLoginSuccess = jasmine.createSpy("postLoginSuccess").and.callFake(function () {
                    console.log("postLoginSuccess ");
                });
                this.handleAdalErrorsLoadingProfile = jasmine.createSpy("handleAdalErrorsLoadingProfile").and.callFake(function () {
                    console.log("handleAdalErrorsLoadingProfile ");
                });
            });
            $provide.service('DeviceFactory', function () {

            });
            $provide.service('FxpConfigurationService', function () {
                this.FxpAppSettings = {
                    PageLoadDurationThreshold: "1"
                };
                this.FlagInformation = {
                    EnableBreadcrumb: true
                };
            });
            $provide.service('FxpBreadcrumbService', function () {
                this.logBreadcrumbTelemetryInfo = jasmine.createSpy("logBreadcrumbTelemetryInfo").and.callFake(function () {
                    console.log('logBreadcrumbTelemetryInfo : ');
                });
                this.setBreadcrumbFromRoute = jasmine.createSpy("setBreadcrumbFromRoute").and.callFake(function (a) {
                    console.log('setBreadcrumbFromRoute : ' + a);
                });
            });
            $provide.service('FxpMessageService', function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage : ' + a + ', ' + b);
                });
            });
            $provide.service('FxpBotService', function () {
                this.setUserContext = jasmine.createSpy("setUserContext").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            return callback({ data: "SaveSuccess" });
                        }
                    }
                })
            });
            $provide.service('FeatureFlagService', function () {

            });
            $provide.service('StartUpFlightConfig', function () {

            });
            $provide.service('PlannedDownTimeService', function () {
                this.updateFlash = jasmine.createSpy("updateFlash").and.callFake(function () {
                    console.log("updateFlash ");
                })
                this.pollForPlannedDownTimesandUpdateFlash = jasmine.createSpy("pollForPlannedDownTimesandUpdateFlash").and.callFake(function () {
                    console.log("pollForPlannedDownTimesandUpdateFlash ");
                })
            });
            $provide.service('SessionTimeoutModalFactory', function () {
                this.init = jasmine.createSpy("init").and.callFake(function () {
                    console.log("init ");
                })
            });
            $provide.service('FxpStateTransitionService', function () {
                this.onStateNotFound = jasmine.createSpy("onStateNotFound ").and.callFake(function (callback) {
                    return subjects.filter(event => event.id === 4)[0].subject.subscribe(callback);
                });
                this.onStateChangeSuccess = jasmine.createSpy("onStateChangeSuccess").and.callFake(function (callback) {
                    return subjects.filter(event => event.id === 2)[0].subject.subscribe(callback);
                })
                this.onStateChangeFailure = jasmine.createSpy("onStateChangeFailure ").and.callFake(function (callback) {
                    return subjects.filter(event => event.id === 3)[0].subject.subscribe(callback);
                });
            });
        })
    })
    beforeEach(angular.mock.inject(function (_$rootScope_, _$location_, _$state_, FxpUIData, FxpLoggerService, UserProfileService, adalAuthenticationService,
        PageLoaderService, AppControllerHelper, DeviceFactory, FxpConfigurationService, FxpBreadcrumbService,
        FxpMessageService, FxpBotService, _$window_, FeatureFlagService, StartUpFlightConfig, PlannedDownTimeService,
        SessionTimeoutModalFactory, _$timeout_, _$q_, _$compile_, _$document_, _$controller_, PageTourEventService, FxpStateTransitionService) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $location = _$location_;
        $state = _$state_;
        fxpUIData = FxpUIData;
        fxpLoggerService = FxpLoggerService;
        userProfileService = UserProfileService;
        adalService = adalAuthenticationService;
        pageLoaderService = PageLoaderService;
        appControllerHelper = AppControllerHelper;
        deviceFactory = DeviceFactory;
        fxpConfigurationService = FxpConfigurationService;
        fxpBreadcrumbService = FxpBreadcrumbService;
        fxpMessageService = FxpMessageService;
        fxpBotService = FxpBotService;
        $window = _$window_;
        featureFlagService = FeatureFlagService;
        startUpFlightConfig = StartUpFlightConfig;
        plannedDownTimeService = PlannedDownTimeService;
        sessionTimeoutModalFactory = SessionTimeoutModalFactory;
        pageTourEventService = PageTourEventService;
        fxpStateTransitionService = FxpStateTransitionService;
        $timeout = _$timeout_;
        $q = _$q_;
        $compile = _$compile_;
        $document = _$document_;
        $controller = _$controller_;
        window["tenantConfiguration"] = {
            ShowFullProfile: false,
            ViewProfileUrl: '/test1'
        }
    }));

    beforeEach(() => {
        $rootScope.fxpUIConstants = {
            UIStrings: {
                ViewFullProfile: "View Full Profile",
                LoadingStrings: {
                    LoadingProfile: "Loading Profile"
                }
            },
            UIMessages: {
                StateChangeErrorException: {
                    ErrorMessageTitle: "While navigating to {0} an error ocurred."
                },
                FxpBotSetContextFailedError: {
                    ErrorMessage: "Chat Bot is currently not available. Please try again after sometime"
                }
            }
        };
        subjects = [
            { id: 1, subject: new Subject() },
            { id: 2, subject: new Subject() },
            { id: 3, subject: new Subject() },
            { id: 4, subject: new Subject() }];
    });

    describe('When AppController Loaded and if user is Authenticated', () => {
        beforeEach(() => {
            adalService.userInfo = {
                isAuthenticated: true
            }
            controller = $controller(AppController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $location: $location,
                $state: $state,
                FxpUIData: fxpUIData,
                FxpLoggerService: fxpLoggerService,
                UserProfileService: userProfileService,
                adalAuthenticationService: adalService,
                PageLoaderService: pageLoaderService,
                AppControllerHelper: appControllerHelper,
                DeviceFactory: deviceFactory,
                FxpConfigurationService: fxpConfigurationService,
                FxpBreadcrumbService: fxpBreadcrumbService,
                FxpMessageService: fxpMessageService,
                FxpBotService: fxpBotService,
                $window: $window,
                FeatureFlagService: featureFlagService,
                StartUpFlightConfig: startUpFlightConfig,
                PlannedDownTimeService: plannedDownTimeService
            });
        });
        it('Then fnShowPageLoaderStep of pageLoaderService should have been called', () => {
            expect(pageLoaderService.fnShowPageLoader).toHaveBeenCalledWith("Loading Profile", appControllerHelper.handleAdalErrorsLoadingProfile);
        });
        it('Then getBasicProfile of appControllerHelper should have been called', () => {
            expect(appControllerHelper.getBasicProfile).toHaveBeenCalled();
        });
        it('Then postLoginSuccess of appControllerHelper should have been called', () => {
            expect(appControllerHelper.postLoginSuccess).toHaveBeenCalled();
        });

    })
    beforeEach(() => {
        controller = $controller('AppController', {
            $rootScope: $rootScope,
            $scope: $scope,
            $location: $location,
            $state: $state,
            FxpUIData: fxpUIData,
            FxpLoggerService: fxpLoggerService,
            UserProfileService: userProfileService,
            adalAuthenticationService: adalService,
            PageLoaderService: pageLoaderService,
            AppControllerHelper: appControllerHelper,
            DeviceFactory: deviceFactory,
            FxpConfigurationService: fxpConfigurationService,
            FxpBreadcrumbService: fxpBreadcrumbService,
            FxpMessageService: fxpMessageService,
            FxpBotService: fxpBotService,
            $window: $window,
            FeatureFlagService: featureFlagService,
            StartUpFlightConfig: startUpFlightConfig,
            PlannedDownTimeService: plannedDownTimeService
        });
    })

    describe('When AppController Loaded', () => {
        it('Then loader should be show', () => {
            expect($rootScope.showLoader).toEqual(true);
        });
        it('Then pageLoadThreshold should be defined', () => {
            expect(controller.pageLoadThreshold).toEqual(1);
        });
        it('Then custom scroll config should be defined', () => {
            var config = {
                theme: 'dark',
                axis: 'y',
                scrollButtons: {
                    enable: false
                },
                keyboard: { scrollAmount: 5 }
            };
            expect($scope.leftNavConfig).toEqual(config);
        });
        it('Then $scope.viewProfileUrl should be defined', () => {
            expect($scope.viewProfileUrl).toEqual("/test1");
        });
        it('Then $scope.userThumbnailPhoto should be defined', () => {
            expect($scope.userThumbnailPhoto).toEqual("/assets/pictures/User.png");
        });
    })
    describe('When AppHeaderChanged event gets broadcasted', function () {
        beforeEach(function () {
            $rootScope.$broadcast("AppHeaderChanged", "OneProfile");
        });
        it('Then $scope.fxpheaderdata.DisplayText should be defined', () => {
            expect($scope.fxpheaderdata.DisplayText).toEqual("OneProfile");
        });
    });
    describe('When PageTitleChanged event gets broadcasted', function () {
        beforeEach(function () {
            $rootScope.$broadcast("PageTitleChanged", "SkillsPage");
        });
        it('Then $scope.pageTitle should be defined', () => {
            expect($scope.pageTitle).toEqual("SkillsPage");
        });
    });
    describe('When resetPageLoadMetrics event gets broadcasted', function () {
        beforeEach(function () {
            $rootScope.$broadcast("resetPageLoadMetrics");
        });
        it('Then it should reset the pageload metrics', () => {
            expect($rootScope.pageLoadMetrics.pageLoadDuration).toEqual(0);
            expect($rootScope.pageLoadMetrics.totalDuration).toEqual(0);
        });
    });
    describe('When onStateNotFound transition gets fired', function () {
        beforeEach(function () {
            let fromState = {
                _identifier: {
                    name: "Home",
                }
            };
            let toState = {
                _identifier: {
                    name: "Dashboard",
                }
            };
            $rootScope.$broadcast("resetPageLoadMetrics");
            subjects.filter(event => event.id === 4)[0].subject.next({ toState: toState, fromState: fromState });
        });
        it('Then $rootScope.pageLoadMetrics.pageTransitionStatus should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageTransitionStatus).toEqual("stateNotFound");
        });
        it('Then $rootScope.pageLoadMetrics.pageLoadError should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageLoadError).toEqual("The State you were navigating to was not found");
        });
        it('Then logError of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
        it('Then fxpLogger.setPageLoadMetrics to have been called', () => {
            expect(fxpLoggerService.setPageLoadMetrics).toHaveBeenCalled();
        });
    });
    describe('When onStateChangeFailure transition gets fired', function () {
        beforeEach(function () {
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics
            let fromState = {
                name: "Home",
            };
            let toState = {
                name: "UserNavigate",

            };           
            var toParams, fromParams;           
            var error = {
                status: "401",
                statusText: "route registered with undefined params",
                config: {
                    url: "#/User123"
                }
            };
            subjects.filter(event => event.id === 3)[0].subject.next({ toState: toState, fromState: fromState, error : error });            
        });
        it('Then $rootScope.pageLoadMetrics.pageTransitionStatus should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageTransitionStatus).toEqual("stateChangeError");
        });
        it('Then $rootScope.pageLoadMetrics.pageLoadError should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageLoadError).toEqual("While navigating to UserNavigate an error ocurred.");
        });
        it('Then addMessage of fxpMessageService should have been called', () => {
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
        it('Then logError of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
        it('Then fxpLogger.setPageLoadMetrics to have been called', () => {
            expect(fxpLoggerService.setPageLoadMetrics).toHaveBeenCalled();
        });
    });
    describe('When $viewContentLoaded event gets broadcasted', function () {
        beforeEach(function () {
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics 
            $rootScope.pageLoadMetrics.sourceRoute = "Home";
            $rootScope.$broadcast("$viewContentLoaded");
        });
        it('Then $rootScope.pageLoadMetrics.pageTransitionStatus should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageTransitionStatus).toEqual("viewContentLoaded");
        });
        it('Then logBreadcrumbTelemetryInfo of fxpBreadcrumbService should have been called', () => {
            expect(fxpBreadcrumbService.logBreadcrumbTelemetryInfo).toHaveBeenCalled();
        });
    });
    describe('When $viewContentLoaded event gets broadcasted and if total duration crossed page threshold value', function () {
        beforeEach(function () {
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics      
            $rootScope.startTime = 1;
            $rootScope.pageLoadMetrics.sourceRoute = "Home";
            $rootScope.$broadcast("$viewContentLoaded");
        });
        it('Then $rootScope.pageLoadMetrics.pageTransitionStatus should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageTransitionStatus).toEqual("viewContentLoaded");
        });
        it('Then logBreadcrumbTelemetryInfo of fxpBreadcrumbService should have been called', () => {
            expect(fxpBreadcrumbService.logBreadcrumbTelemetryInfo).toHaveBeenCalled();
        });
    });
    describe('When onStateChangeSuccess transition gets fired', function () {
        beforeEach(function () {
            let toState = {
                name: "Dashboard"
            };
            let fromState = {
                name: "Home"
            }

            spyOn(controller, "renderBreadcrumb").and.callThrough();
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics
            subjects.filter(event => event.id === 2)[0].subject.next({ toState: toState, fromState: fromState});
        });
        it('Then setAppHeaderFromRoute of fxpUIData should have been called', () => {
            expect(fxpUIData.setAppHeaderFromRoute).toHaveBeenCalled();
        });
        it('Then setPageTitleFromRoute of fxpUIData should have been called', () => {
            expect(fxpUIData.setPageTitleFromRoute).toHaveBeenCalled();
        });
        it('Then $rootScope.pageLoadMetrics.pageTransitionStatus should be defined', () => {
            expect($rootScope.pageLoadMetrics.pageTransitionStatus).toEqual("stateChangeSuccess");
        });
        it('Then renderBreadcrumb method should have been called', () => {
            expect(controller.renderBreadcrumb).toHaveBeenCalled();
        });
    });
    describe('When SkypeBotInit event gets broadcasted', function () {
        beforeEach(function () {
            var url = "#/xyz", target = "_blank";
            $rootScope.$broadcast("SkypeBotInit", url, target);
        });
        it('Then setUserContext of fxpBotService should have been called', () => {
            expect(fxpBotService.setUserContext).toHaveBeenCalled();
        });
        it('Then logInformation of fxpLoggerService should have been called', () => {
            expect(fxpLoggerService.logInformation).toHaveBeenCalled();
        });
    });
    describe('When SkypeBotInit event gets broadcasted and if setUserContext of fxpBotService thrown error', function () {
        beforeEach(function () {
            var url = "#/xyz", target = "_blank";
            fxpBotService.setUserContext = jasmine.createSpy("setUserContext").and.callFake(function (a) {
                var defer = $q.defer();
                var error = {
                    messege: "Error in fxpBotService"
                };
                defer.reject(error);
                return defer.promise;
            })
            $rootScope.$broadcast("SkypeBotInit", url, target);
        });
        it('Then setUserContext of fxpBotService should have been called', () => {
            expect(fxpBotService.setUserContext).toHaveBeenCalled();
        });
        it('Then addMessage of fxpMessageService should have been called', () => {
            $scope.$apply();
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
        it('Then addMessage of fxpLoggerService should have been called', () => {
            $scope.$apply();
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe('When onNavigationClick method gets called', function () {
        beforeEach(function () {
            var menuItem = "Home";
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics                
            $state.go = jasmine.createSpy('go').and.callFake(function (a) {
                console.log("$state.go called with " + a);
            })
            controller.onNavigationClick(menuItem);
        });
        it('Then $state.go should have been called', () => {
            expect($state.go).toHaveBeenCalled();
        });
    });
    describe('When onNavigationClickWithParams method gets called', function () {
        beforeEach(function () {
            var menuItem = "Home";
            var params = "{ id: 123 }";
            $rootScope.$broadcast("resetPageLoadMetrics");//Reset the pageloadmetrics                
            $state.go = jasmine.createSpy('go').and.callFake(function (a, b) {
                console.log("$state.go called with " + a + ', ' + b);
            })
            controller.onNavigationClickWithParams(menuItem, params);
        });
        it('Then $state.go should have been called', () => {
            expect($state.go).toHaveBeenCalledWith("Home", { id: 123 });
        });
    });
    describe('When getLandingPage method gets called and if DashBoard state is available', function () {
        beforeEach(function () {
            $state.get = jasmine.createSpy('get').and.callFake(function (a) {
                return true;
            })
            $state.href = jasmine.createSpy('href').and.callFake(function (a, b, c) {
                console.log("$state.href called with " + a + ', ' + b + ', ' + c);
            })
            controller.getLandingPage();
        });
        it('Then $state.get should have been called', () => {
            expect($state.get).toHaveBeenCalledWith("DashBoard");
        });
        it('Then $state.href should have been called', () => {
            expect($state.href).toHaveBeenCalledWith("DashBoard", {}, { absolute: true });
        });
    });
    describe('When getLandingPage method gets called and if DashBoard state is not available', function () {
        beforeEach(function () {
            $state.get = jasmine.createSpy('get').and.callFake(function (a) {
                if (a) {
                    return false;
                } else {
                    var states = [{ name: "Home" }, { name: "Dashboard" }];
                    return states;
                }
            })
            $state.href = jasmine.createSpy('href').and.callFake(function (a, b, c) {
                console.log("$state.href called with " + a + ', ' + b + ', ' + c);
            })
            controller.getLandingPage();
        });
        it('Then $state.href should have been called', () => {
            expect($state.href).toHaveBeenCalledWith("Dashboard", {}, { absolute: true });
        });
    });
    describe('When navigateToLandingPage method gets called and if Dashboard state is available', function () {
        beforeEach(function () {
            $state.get = jasmine.createSpy('get').and.callFake(function (a) {
                return a;
            })
            $state.go = jasmine.createSpy('go').and.callFake(function (a) {
                console.log("$state.go called with " + a);
            })
            spyOn(controller, "logHeaderClickTelemetryInfo").and.callThrough();
            controller.navigateToLandingPage();
        });
        it('Then $state.get should have been called', () => {
            expect($state.get).toHaveBeenCalledWith("Dashboard");
        });
        it('Then $state.go should have been called', () => {
            expect($state.go).toHaveBeenCalledWith("Dashboard");
        });
        it('Then logHeaderClickTelemetryInfo method should have been called', () => {
            expect(controller.logHeaderClickTelemetryInfo).toHaveBeenCalled();
        });
    });
    describe('When navigateToLandingPage method gets called and if Dashboard state is not available', function () {
        beforeEach(function () {
            $state.get = jasmine.createSpy('get').and.callFake(function (a) {
                return null;
            })
            $state.go = jasmine.createSpy('go').and.callFake(function (a) {
                console.log("$state.go called with " + a);
            })
            $rootScope.configRouteStates = ["Home", "ActOnBehalf"];
            spyOn(controller, "logHeaderClickTelemetryInfo").and.callThrough();
            controller.navigateToLandingPage();
        });
        it('Then $state.get should have been called', () => {
            expect($state.get).toHaveBeenCalledWith("Dashboard");
        });
        it('Then $state.go should have been called', () => {
            expect($state.go).toHaveBeenCalledWith("Home");
        });
    });
    describe('When leftNavHighlighted event gets broadcasted', function () {
        var item;
        beforeEach(function () {
            item = {
                id: 100,
                targetUIStateName: "Dashboard",
                OpenInline: true
            }
            $rootScope.initialFlags = {
                flashEnabled: true
            }
            $rootScope.$broadcast("leftNavHighlighted", item);
        });
        it('Then plannedDownTimeService.currentLeftNavItem should be defined', () => {
            expect(plannedDownTimeService.currentLeftNavItem).toEqual(item);
        });
        it('Then updateFlash of plannedDownTimeService should have been called', () => {
            expect(plannedDownTimeService.updateFlash).toHaveBeenCalled();
        });
    });
    describe('When StartUpFlagRetrieved event gets broadcasted', function () {
        beforeEach(function () {
            $rootScope.initialFlags = {
                flashEnabled: true
            }
            $rootScope.$broadcast("StartUpFlagRetrieved");
        });
        it('Then pollForPlannedDownTimesandUpdateFlash of plannedDownTimeService should have been called', () => {
            expect(plannedDownTimeService.pollForPlannedDownTimesandUpdateFlash).toHaveBeenCalled();
        });
    });
    describe('When clicked on button it having renderHeaderForClick method', function () {
        var mydiv, button;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="userprofile" type="button" ng-click="renderHeaderForClick($event)"></button></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            button = compiledmydiv.find('#userprofile')
            button.triggerHandler('click');

        });
        it('Then open class add to the parent of the button element', () => {
            expect(mydiv.hasClass("open")).toEqual(true);
        });
        it('Then aria-expanded of element should be true', () => {
            expect(button.attr('aria-expanded')).toEqual('true');
        });
    });
    describe('When clicked on button it having renderHeaderForClick method and parent of button element having open class', function () {
        var mydiv, button;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="userprofile" type="button" ng-click="renderHeaderForClick($event)"></button></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            compiledmydiv.addClass("open");
            button = compiledmydiv.find('#userprofile')
            button.triggerHandler('click');

        });
        it('Then open class should be remove from the parent of the button element', () => {
            expect(mydiv.hasClass("open")).toEqual(false);
        });
        it('Then aria-expanded of element should be false', () => {
            expect(button.attr('aria-expanded')).toEqual('false');
        });
    });
    describe('When keydown event triggered using shift and tab keys on button and renderHeaderForKeydown method gets called', function () {
        var mydiv, button;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="userprofile" type="button" ng-keydown="renderHeaderForKeydown($event)"></button></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            compiledmydiv.addClass("open");
            button = compiledmydiv.find('#userprofile');
            var e = $.Event("keydown");
            e.key = "Tab";
            e.shiftKey = true;
            button.trigger(e);

        });
        it('Then open class should be removed from the parent of the button element', () => {
            expect(mydiv.hasClass("open")).toEqual(false);
        });
        it('Then aria-expanded of element should be true', () => {
            expect(button.attr('aria-expanded')).toEqual('false');
        });
    });
    describe('When keydown event triggered using shift and tab keys on button and renderHeaderForKeydown method gets called', function () {
        var mydiv, button, menuItems;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="userprofile" type="button" ng-keydown="renderHeaderForKeydown($event)"></button><ul uib-dropdown-menu><li><a id="Fxpdashboard_ViewFullprofile" href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            compiledmydiv.addClass("open");
            button = compiledmydiv.find('#userprofile');
            var e = $.Event("keydown");
            e.key = "Down";
            e.shiftKey = true;
            menuItems = mydiv.find("[uib-dropdown-menu] li a");
            spyOn(menuItems[0], 'focus').and.callThrough();
            button.trigger(e);
        });
        it('Then focus should be on first element in the uib-dropdown-menu', () => {
            expect(menuItems[0].focus).toHaveBeenCalled();
        });
    });
    describe('When ng-blur event triggered on button and renderHeaderForFocusout method gets called', function () {
        var mydiv, button;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="userprofile" type="button" ng-blur="renderHeaderForFocusout($event)"></button></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            button = compiledmydiv.find('#userprofile');
            button.addClass("focus-removed");
            button.blur();

        });
        it('Then focus-removed class should be removed from the button', () => {
            expect(button.hasClass("focus-removed")).toEqual(false);
        });
    });
    describe('When keydown event triggered using escapeKey on li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, targetMenuToggleBtn;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id="help-open" type="button"></button><ul uib-dropdown-menu aria-labelledby="help-open"><li id="firstElement" ng-keydown="renderHeaderMenuForKeydown($event)"><a href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            targetMenuToggleBtn = compiledmydiv.find("#help-open");
            var e = $.Event("keydown");
            e.keyCode = 27;
            spyOn(targetMenuToggleBtn, 'focus').and.callThrough();
            firstItem.trigger(e);
        });
        it('Then focus should be on targetMenuToggleBtn', () => {
            expect(targetMenuToggleBtn.focus).toBeDefined();
        });
    });
    describe('When keydown event triggered using tabKey on li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, uibdropdown, targetMenuToggleBtn;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            uibdropdown = compiledmydiv.find("#uibdropdown");
            targetMenuToggleBtn = $("#help-open");
            uibdropdown.parent().addClass("open");
            var e = $.Event("keydown");
            e.keyCode = 9;
            firstItem.trigger(e);
        });
        it('Then open class should not have for uibdropdown.parent()', () => {
            expect(uibdropdown.parent().hasClass("open")).toEqual(false)
        });
    });
    describe('When keydown event triggered using tabKey and shiftKey on li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, uibdropdown, targetMenuToggleBtn, event;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            uibdropdown = compiledmydiv.find("#uibdropdown");
            targetMenuToggleBtn = $("#help-open");
            uibdropdown.parent().addClass("open");
            event = $.Event("keydown");
            event.keyCode = 9;
            event.shiftKey = true;
            spyOn(event, "preventDefault").and.callThrough();
            spyOn(event, "stopPropagation").and.callThrough();
            firstItem.trigger(event);
        });
        it('Then event.preventDefault() should have been called', () => {
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it('Then event.stopPropagation() should have been called', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });
    describe('When keydown event triggered using arrowDownKey on li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, uibdropdown, targetMenuToggleBtn, event, allMenuItems;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            targetMenuToggleBtn = $("#help-open");
            allMenuItems = compiledmydiv.find("li a")
            event = $.Event("keydown");
            event.keyCode = 40;
            spyOn(event, "preventDefault").and.callThrough();
            spyOn(event, "stopPropagation").and.callThrough();
            spyOn(allMenuItems[0], "focus").and.callThrough();
            firstItem.trigger(event);
        });
        it('Then event.preventDefault() should have been called', () => {
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it('Then event.stopPropagation() should have been called', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
        });
        it('Then focus should be on first menu item', () => {
            expect(allMenuItems[0].focus).toHaveBeenCalled();
        });
    });
    describe('When keydown event triggered using arrowDownKey on first li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, event, allMenuItems;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a><a id="secondElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home12"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            allMenuItems = compiledmydiv.find("li a")
            event = $.Event("keydown");
            event.keyCode = 40;
            spyOn(allMenuItems[1], "focus").and.callThrough();
            firstItem.trigger(event);
        });
        it('Then focus should be on second menu item', () => {
            expect(allMenuItems[1].focus).toHaveBeenCalled();
        });
    });
    describe('When keydown event triggered using arrowUpKey on li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, firstItem, event, allMenuItems;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            firstItem = compiledmydiv.find('#firstElement');
            allMenuItems = compiledmydiv.find("li a")
            event = $.Event("keydown");
            event.keyCode = 38;
            spyOn(event, "preventDefault").and.callThrough();
            spyOn(event, "stopPropagation").and.callThrough();
            spyOn(allMenuItems[0], "focus").and.callThrough();
            firstItem.trigger(event);
        });
        it('Then event.preventDefault() should have been called', () => {
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it('Then event.stopPropagation() should have been called', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
        });
        it('Then focus should be on first menu item', () => {
            expect(allMenuItems[0].focus).toHaveBeenCalled();
        });
    });
    describe('When keydown event triggered using arrowUpKey on second li element and renderHeaderMenuForKeydown method gets called', function () {
        var mydiv, secondItem, event, allMenuItems;
        beforeEach(function () {
            mydiv = angular.element('<div id="myapp"><button ng-app="AppController" id= "help-open" aria-expanded="true" type= "button" > </button><ul id="uibdropdown" uib-dropdown-menu aria-labelledby="help-open"><li ><a id="firstElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home"></i></a><a id="secondElement"  ng-keydown="renderHeaderMenuForKeydown($event)" href="#/Home12"></i></a></li></ul></div>');
            var compiledmydiv = $compile(mydiv)($scope);
            secondItem = compiledmydiv.find('#secondElement');
            allMenuItems = compiledmydiv.find("li a")
            event = $.Event("keydown");
            event.keyCode = 38;
            spyOn(allMenuItems[0], "focus").and.callThrough();
            secondItem.trigger(event);
        });
        it('Then focus should be on first menu item', () => {
            expect(allMenuItems[0].focus).toHaveBeenCalled();
        });
    });
    describe('When keydown event triggered using tabKey on message popup and onMessageKeyDown method gets called', function () {
        var mydiv, firstMessage, event;
        function resetDOM() {
            var body = document.getElementsByTagName("body")[0];
            var myapp = document.getElementById('myapp');
            body.removeChild(myapp);
        }
        beforeEach(function () {
            var html = '<div id="myapp" ng-app="AppController" ng-keydown="onMessageKeyDown($event)"><div class="message message- error"><div class="message- content" tabindex="1">Message1</div><button id="closeButton" class="icon- container" type="button" tabindex="1">button1</button></div></div>';
            mydiv = angular.element(document.body).append(html);
            var compiledmydiv = $compile(mydiv)($scope);
            var closeButton = compiledmydiv.find('#closeButton');
            event = $.Event("keydown");
            event.key = "Tab";
            spyOn(event, "preventDefault").and.callThrough();
            spyOn(event, "stopPropagation").and.callThrough();
            closeButton.trigger(event);
        });
        it('Then event.preventDefault() should have been called', () => {
            expect(event.preventDefault).toHaveBeenCalled();
            resetDOM();
        });
        it('Then  event.stopPropagation() should have been called', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
            resetDOM();
        });
    });
    describe('When keydown event triggered using shift and Tab keys on message popup and onMessageKeyDown method gets called', function () {
        var mydiv, firstMessage, event;
        function resetDOM() {
            var body = document.getElementsByTagName("body")[0];
            var myapp = document.getElementById('myapp');
            body.removeChild(myapp);
        }
        beforeEach(function () {
            var html = '<div id="myapp" ng-app="AppController" ng-keydown="onMessageKeyDown($event)"><div class="message message- error"><div id="ContentMessage" class="message- content" tabindex="1">Message1</div><button class="icon- container" type="button" tabindex="1">button1</button></div></div>';
            mydiv = angular.element(document.body).append(html);
            var compiledmydiv = $compile(mydiv)($scope);
            var contentMessage = compiledmydiv.find('#ContentMessage');
            event = $.Event("keydown");
            event.key = "Tab";
            event.shiftKey = true;
            spyOn(event, "preventDefault").and.callThrough();
            spyOn(event, "stopPropagation").and.callThrough();
            contentMessage.trigger(event);
        });
        it('Then event.preventDefault() should have been called', () => {
            expect(event.preventDefault).toHaveBeenCalled();
            resetDOM();
        });
        it('Then  event.stopPropagation() should have been called', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
            resetDOM();
        });
    });
    describe('When logMiniProfileTelemetryInfo gets called and its a viewFullProfile click', function () {
        beforeEach(function () {
            controller.logMiniProfileTelemetryInfo('viewFullProfile', true);
        });
        it('Then fxpLoggerService.logEvent should have been called', () => {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });
    describe('When logMiniProfileTelemetryInfo gets called and its a profileIcon click', function () {
        beforeEach(function () {
            controller.logMiniProfileTelemetryInfo('profileIcon', true);
        });
        it('Then fxpLoggerService.logEvent should have been called', () => {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
    });
    describe('When logMiniProfileTelemetryInfo gets called and modal close click', function () {
        beforeEach(function () {
            controller.logMiniProfileTelemetryInfo('profileIcon', false);
        });
        it('Then fxpLoggerService.logEvent should not be called', () => {
            expect(fxpLoggerService.logEvent).not.toHaveBeenCalled();
        });
    });
})