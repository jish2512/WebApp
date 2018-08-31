import {FxpBootstrap} from '../js/boot/fxpboot';
import { Subject } from 'rxjs';
declare var angular:any;

describe("Given fxpBootstrap for fxpConfigInit", function () {
	var provide,$rootScope, fxpConfiguration, $exceptionHandler, fxpContextService, fxpTelemetryContext,
	 fxpLoggerService;
	beforeEach(function () {
		angular.mock.module(function ($provide) {
			provide = $provide;
			angular.module('myApp', []).config(function () {
				FxpBootstrap.fxpConfigInit(provide);
			});
			angular.bootstrap(document, ['myApp']);
			$provide.service("FxpConfigurationService", function () {
				this.FxpBaseConfiguration = {
					FxpConfigurationStrings: {
						UIStrings: {
							LoadingStrings: {
								Authenticating: "Authenticating",
								LoadingProfile: "Loading Profile",
								LoadingDashboard: "Loading Dashboard"
							}
						},
						UIMessages: {
							LoadTimeOutGenericError: {
								ErrorMessage: "LoadTimeOutGenericError"
							},
							LoadTimeAdalError: {
								ErrorMessage: "LoadTimeAdalError"
							}
						}
					}
				};
				this.ModelConfiguration = {
					"EnvironmentName": "Dev",
					"ApplicationName": "Fxp",
					"EnableHttps": false,
					"ServiceOffering": "Enterprise Services Experience",
					"FXPPageTitle": "Enterprise Services Experience",
					"ServiceLine": "Field Experience",
					"Program": "Field Experience Platform",
					"Capability": "Fxp",
					"LoggedByApplication": "Enterprise Service Experience Platform",
					"ComponentName": "Fxp Services",
					"ApplicationTitle": "Services Field Experience"
				};
				this.FxpAppSettings = {
					"AssetsUrl": "Asset"
				};
			});
			$provide.service("FxpContextService", function () {
				this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b) {
					console.log('saveContext : ' + a + ',' + b);
				});
			});
			$provide.service("FxpTelemetryContext", function () {
				this.setGeography = jasmine.createSpy("setGeography").and.callFake(function (a) {
					console.log('setGeography : ' + a);
				});
				this.setNewUserSession = jasmine.createSpy("setNewUserSession").and.callFake(function (a) {
					console.log('setNewUserSession : ' + a);
					return a;
				});
				this.setEnvironmentDetails = jasmine.createSpy("setEnvironmentDetails ").and.callFake(function (a) {
					console.log('setEnvironmentDetails  : ' + a);
					return a;
				});
			});
			$provide.service("FxpLoggerService", function () {
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
				this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a) {
					console.log('startTrackPerformance : ' + a);
				});
			});			     
		});
	});
	beforeEach(angular.mock.inject(function (_$rootScope_, FxpConfigurationService, FxpContextService, FxpTelemetryContext, FxpLoggerService, _$exceptionHandler_) {
		$rootScope = _$rootScope_;
		fxpConfiguration = FxpConfigurationService;
		fxpContextService = FxpContextService;
		fxpTelemetryContext = FxpTelemetryContext;
		fxpLoggerService = FxpLoggerService;
		$exceptionHandler = _$exceptionHandler_;		
	}));
	describe("When decorator is initiated ", function () {
		beforeEach(function () {
			try {
				throw new DOMException;
			}
			catch (e) {
				window.onerror.call(window, e.toString(), document.location.toString(), 2);
			}
		});
		it('Then decorator should be loaded successfully ', function () {
			expect(sessionStorage["startTime"]).toBeDefined();
			expect(fxpTelemetryContext.setEnvironmentDetails).toHaveBeenCalled();
			expect(fxpContextService.saveContext).toHaveBeenCalled();
			expect(window["fxpLogger"]).toEqual(fxpLoggerService);
			expect(fxpLoggerService.logError).toHaveBeenCalled();
		});
	});
});
describe("Given fxpBootstrap", function () {
    var provide, compileProvider, httpProvider, stateProvider, urlRouterProvider, $rootScope, adalAuthServiceProvider, $cookies, adalAuthService, userProfileService, fxpMessage, fxpConfiguration, fxpContextService, fxpTelemetryContext, fxpLoggerService, oboUserService, pageLoaderService, $timeout, fxpAuthorizationService, plannedDownTimeService, $state, appControllerHelper,fxpStateTransitionService, subjects;
	beforeEach(angular.mock.module('ui.router'));
	beforeEach(angular.mock.module('ngCookies'));
	beforeEach(function () {
		angular.mock.module(function ($provide, $compileProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
			provide = $provide;
			compileProvider = $compileProvider;
			httpProvider = $httpProvider;
			stateProvider = $stateProvider;
			urlRouterProvider = $urlRouterProvider;
			$provide.service("adalAuthenticationServiceProvider", function () {
				this.init = jasmine.createSpy("init").and.callFake(function (a, b) {
					console.log('init : ' + a + ' ,' + b);
				});
			});
			$provide.service("UserProfileService", function () {
			});
			$provide.service("FxpAuthorizationService", function () {
				this.checkStatePermission = jasmine.createSpy("checkStatePermission").and.callFake(function (a, b) {
					console.log('checkStatePermission : ' + a + ' ,' + b);
				});
			});
			$provide.service("PlannedDownTimeService", function () {
				this.isStateDown = jasmine.createSpy("isStateDown").and.callFake(function (a) {
					console.log('isStateDown : ' + a);
					return true;
				});
			});
			$provide.service("FxpMessageService", function () {
				this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
					console.log('addMessage : ' + a + ',' + b);
				});
			});
			$provide.service("adalAuthenticationService", function () {
				this.userInfo = {
					isAuthenticated: true,
					userName: "xyz",
					profile: {
						ipaddr: "123"
					}
				};
			});
			$provide.service("FxpConfigurationService", function () {
				this.FxpBaseConfiguration = {
					FxpConfigurationStrings: {
						UIStrings: {
							LoadingStrings: {
								Authenticating: "Authenticating",
								LoadingProfile: "Loading Profile",
								LoadingDashboard: "Loading Dashboard"
							}
						},
						UIMessages: {
							LoadTimeOutGenericError: {
								ErrorMessage: "LoadTimeOutGenericError"
							},
							LoadTimeAdalError: {
								ErrorMessage: "LoadTimeAdalError"
							}
						}
					}
				};
				this.ModelConfiguration = {
					"EnvironmentName": "Dev",
					"ApplicationName": "Fxp",
					"EnableHttps": false,
					"ServiceOffering": "Enterprise Services Experience",
					"FXPPageTitle": "Enterprise Services Experience",
					"ServiceLine": "Field Experience",
					"Program": "Field Experience Platform",
					"Capability": "Fxp",
					"LoggedByApplication": "Enterprise Service Experience Platform",
					"ComponentName": "Fxp Services",
					"ApplicationTitle": "Services Field Experience"
				};
				this.FxpAppSettings = {
					"AssetsUrl": "Asset"
				};
			});
			$provide.service("FxpContextService", function () {
				this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b) {
					console.log('saveContext : ' + a + ',' + b);
				});
			});
			$provide.service("FxpTelemetryContext", function () {
				this.setGeography = jasmine.createSpy("setGeography").and.callFake(function (a) {
					console.log('setGeography : ' + a);
				});
				this.setNewUserSession = jasmine.createSpy("setNewUserSession").and.callFake(function (a) {
					console.log('setNewUserSession : ' + a);
					return a;
				});
				this.setEnvironmentDetails = jasmine.createSpy("setEnvironmentDetails ").and.callFake(function (a) {
					console.log('setEnvironmentDetails  : ' + a);
					return a;
				});
			});
			$provide.service("FxpLoggerService", function () {
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
				this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a) {
					console.log('startTrackPerformance : ' + a);
				});
			});
			$provide.service("OBOUserService", function () {
				this.initializeOBOEntityFromContext = jasmine.createSpy("initializeOBOEntityFromContext").and.callFake(function () {
					console.log('initializeOBOEntityFromContext : ');
				});
			});
			$provide.service("PageLoaderService", function () {
				this.fnShowPageLoader = jasmine.createSpy("fnShowPageLoader").and.callFake(function (a, b) {
					b();
					console.log('fnShowPageLoader : ' + a + ' ,' + b);
				});
            });
            $provide.service("AppControllerHelper", function () {
                this.handleAdalErrorsAuthenticating = jasmine.createSpy("handleAdalErrorsAuthenticating").and.callFake(function () {
                    console.log('handleAdalErrorsAuthenticating : ');
                });
			});
			$provide.service('FxpStateTransitionService', function () {
                this.onStateChangeStart = jasmine.createSpy("onStateChangeStart ").and.callFake(function (callback) {
                    return subjects.filter(event => event.id === 1)[0].subject.subscribe(callback);
                });                
			});
			subjects = [
				{ id: 1, subject: new Subject() }];
		});
	});
    beforeEach(angular.mock.inject(function (_$rootScope_, adalAuthenticationServiceProvider, _$cookies_, adalAuthenticationService, UserProfileService, FxpMessageService, FxpConfigurationService, FxpContextService, FxpTelemetryContext, FxpLoggerService, OBOUserService, PageLoaderService, _$timeout_, FxpAuthorizationService, PlannedDownTimeService, _$state_, AppControllerHelper, FxpStateTransitionService) {
		$rootScope = _$rootScope_;
		adalAuthServiceProvider = adalAuthenticationServiceProvider;
		$cookies = _$cookies_;
		adalAuthService = adalAuthenticationService;
		userProfileService = UserProfileService;
		fxpMessage = FxpMessageService;
		fxpConfiguration = FxpConfigurationService;
		fxpContextService = FxpContextService;
		fxpTelemetryContext = FxpTelemetryContext;
		fxpLoggerService = FxpLoggerService;
		oboUserService = OBOUserService;
		pageLoaderService = PageLoaderService;
		fxpAuthorizationService = FxpAuthorizationService;
        plannedDownTimeService = PlannedDownTimeService;
		appControllerHelper = AppControllerHelper;
		fxpStateTransitionService = FxpStateTransitionService;
		$timeout = _$timeout_;
		$state = _$state_;
	}));
	describe("When setSanitizedWhitelist method gets called ", function () {
		beforeEach(function () {
			spyOn(compileProvider, "imgSrcSanitizationWhitelist").and.callThrough();
			spyOn(compileProvider, "aHrefSanitizationWhitelist").and.callThrough();
			FxpBootstrap.setSanitizedWhitelist(compileProvider);
		});
		it('Then compileProvider.imgSrcSanitizationWhitelist should have been called ', function () {
			expect(compileProvider.imgSrcSanitizationWhitelist).toHaveBeenCalledWith(/^\s*(https?|http|ms-appx|ms-appx-web|data|blob):/);
		});
		it('Then compileProvider.aHrefSanitizationWhitelist should have been called ', function () {
			expect(compileProvider.aHrefSanitizationWhitelist).toHaveBeenCalledWith(/^\s*(https?|ftp|mailto|chrome-extension):/);
		});
	});
	describe("When configHttpProvider method gets called ", function () {
		beforeEach(function () {
			sessionStorage['adal.idtoken'] = "eyxyzy";
			FxpBootstrap.configHttpProvider(httpProvider);
		});
		it('Then httpProvider.defaults.useXDomain should be true ', function () {
			expect(httpProvider.defaults.useXDomain).toEqual(true);
		});
		it('Then httpProvider.defaults.headers.post["Content-Type"] should be defined', function () {
			expect(httpProvider.defaults.headers.post["Content-Type"]).toEqual("application/x-www-form-urlencoded; charset=utf-8");
		});
		it('Then httpProvider.defaults.headers.common["Authorization"] should be defined', function () {
			expect(httpProvider.defaults.headers.common["Authorization"]).toEqual("Bearer eyxyzy");
		});
		it('Then httpProvider.interceptors should have FxpHttpCorrelationInterceptor, FxpHttpRetryInterceptor', function () {
			expect(httpProvider.interceptors).toEqual(['FxpHttpCorrelationInterceptor', 'FxpHttpRetryInterceptor']);
		});
	});
	describe("When registerRoutes method gets called ", function () {
		beforeEach(function () {
			spyOn(stateProvider, "state").and.callThrough();
			spyOn(urlRouterProvider, "otherwise").and.callThrough();
			FxpBootstrap.registerRoutes(stateProvider, urlRouterProvider);
		});
		it('Then urlRouterProvider.otherwise should have been called ', function () {
			expect(urlRouterProvider.otherwise).toHaveBeenCalledWith("/");
		});
		it('Then stateProvider.state should have been called ', function () {
			expect(stateProvider.state).toHaveBeenCalled();
		});
	});
	describe("When authenticationInit method gets called ", function () {
		beforeEach(function () {
			window["ModelConfiguration"] = {
				Endpoints: "'https://oneprofilesitapipack.trafficmanager.net/api/v1' : '71a156e9-6196-4afe-aa95-4ca2a00790ca'"
			};
			FxpBootstrap.authenticationInit(adalAuthServiceProvider, httpProvider);
		});
		it('Then adalAuthServiceProvider.init should have been called ', function () {
			expect(adalAuthServiceProvider.init).toHaveBeenCalled();
		});
	});
	describe("When fxpRunInit method gets called ", function () {
		beforeEach(function () {
            sessionStorage["REQSTATE"] = "Dashboard";
            FxpBootstrap.fxpRunInit($cookies, $rootScope, adalAuthService, userProfileService, fxpMessage, fxpConfiguration, fxpContextService, fxpTelemetryContext, fxpLoggerService, oboUserService, pageLoaderService, $timeout, appControllerHelper);
		});
		it('Then fnShowPageLoader of pageLoaderService should have been called ', function () {
			expect(pageLoaderService.fnShowPageLoader).toHaveBeenCalled();
        });
        it('Then handleAdalErrorsAuthenticating of appControllerHelper should have been called ', function () {
            expect(appControllerHelper.handleAdalErrorsAuthenticating).toHaveBeenCalled();
        });
		it('Then $rootScope.isAuthenticated should be true', function () {
			expect($rootScope.isAuthenticated).toEqual(true);
		});
	});
	describe("When fxpRunInit method gets called and user is not authenticated", function () {
		beforeEach(function () {			
			adalAuthService.userInfo = {};
			FxpBootstrap.fxpRunInit($cookies, $rootScope, adalAuthService, userProfileService, fxpMessage, fxpConfiguration, fxpContextService, fxpTelemetryContext, fxpLoggerService, oboUserService, pageLoaderService, $timeout, appControllerHelper);
			adalAuthService.userInfo = {
				isAuthenticated: true,
				userName: "xyz",
				profile: {
					ipaddr: "123"
				}
			};
			$rootScope.$broadcast('adal:loginSuccess');
		});
		it('Then fnShowPageLoader of pageLoaderService should have been called ', function () {
			expect(pageLoaderService.fnShowPageLoader).toHaveBeenCalled();
		});
		it('Then logInformation of fxpLoggerService should have been called ', function () {
			expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('adal:loginSuccess', 'login');
		});
		it('Then $rootScope.isAuthenticated should be true', function () {
			expect($rootScope.isAuthenticated).toEqual(true);
		});			
	});
	describe("When onLoginSuccess method gets called and sessionId is not cached ", function () {
		beforeEach(function () {
			sessionStorage.clear();
			FxpBootstrap.onLoginSuccess($cookies, adalAuthService, fxpMessage, $rootScope, fxpContextService, fxpTelemetryContext, fxpLoggerService);
		});
		it('Then startTrackPerformance of fxpLoggerService should have been called ', function () {
			expect(fxpLoggerService.startTrackPerformance).toHaveBeenCalledWith('FxpLoad');
		});
		it('Then setGeography of fxpTelemetryContext should have been called ', function () {
			expect(fxpTelemetryContext.setGeography).toHaveBeenCalledWith('123');
		});
		it('Then setNewUserSession of fxpTelemetryContext should have been called ', function () {
			expect(fxpTelemetryContext.setNewUserSession).toHaveBeenCalledWith('xyz');
		});
		it('Then logInformation of fxpLoggerService should have been called ', function () {
			expect(fxpLoggerService.logInformation).toHaveBeenCalled();
		});
		it('Then $rootScope.sessionId should be defined', function () {
			expect($rootScope.sessionId).toEqual("xyz");
		});
	});
	describe("When onLoginSuccess method gets called and sessionId is cached ", function () {
		beforeEach(function () {
			sessionStorage["FxpSessionId"] = "xyz123";
			FxpBootstrap.onLoginSuccess($cookies, adalAuthService, fxpMessage, $rootScope, fxpContextService, fxpTelemetryContext, fxpLoggerService);
		});
		it('Then startTrackPerformance of fxpLoggerService should have been called ', function () {
			expect(fxpLoggerService.startTrackPerformance).toHaveBeenCalledWith('FxpLoad');
		});
		it('Then setGeography of fxpTelemetryContext should have been called ', function () {
			expect(fxpTelemetryContext.setGeography).toHaveBeenCalledWith('123');
		});
		it('Then setNewUserSession of fxpTelemetryContext should have been called ', function () {
			expect(fxpTelemetryContext.setNewUserSession).toHaveBeenCalledWith('xyz', 'xyz123');
		});
		it('Then $rootScope.sessionId should be defined', function () {
			expect($rootScope.sessionId).toEqual("xyz");
		});
		afterEach(function () {
			sessionStorage.clear();
		});
	});
	describe("When rootScopeEventHandler method gets called ", function () {
		beforeEach(function () {
			var toState, toParams, fromState, fromParams;
			toState = { name: "AOB", templateUrl: "/aobPage.html" };
			fromState = { name: "UserLookup", templateUrl: "/userlookup.html" };
			$rootScope.pageLoadMetrics = {};
			$state.go = jasmine.createSpy("go").and.callFake(function (a) {
			});
			FxpBootstrap.rootScopeEventHandler($rootScope, fxpAuthorizationService, fxpConfiguration, plannedDownTimeService, $state, fxpStateTransitionService);
			$rootScope.startTime = performance.now();			       
            var toParams, fromParams;           
            var error = {
                status: "401",
                statusText: "route registered with undefined params",
                config: {
                    url: "#/User123"
                }
            };
            subjects.filter(event => event.id === 1)[0].subject.next({ toState: toState, fromState: fromState});			
		});
		it('Then checkStatePermission of fxpAuthorizationService should have been called ', function () {
			expect(fxpAuthorizationService.checkStatePermission).toHaveBeenCalled();
		});
		it('Then isStateDown of plannedDownTimeService should have been called ', function () {
			expect(plannedDownTimeService.isStateDown).toHaveBeenCalledWith('AOB');
		});
		it('Then $state.go should have been called ', function () {
			expect($state.go).toHaveBeenCalledWith('SystemDown');
		});
	});
	describe("When rootScopeEventHandler method gets called and current state changed from same state", function () {
		beforeEach(function () {
			var toState, toParams, fromState, fromParams;
			toState = { name: "Home", templateUrl: "/" };
			fromState = { name: "Home", templateUrl: "/" };
			$rootScope.pageLoadMetrics = {};
			$state.go = jasmine.createSpy("go").and.callFake(function (a) {
			});
			FxpBootstrap.rootScopeEventHandler($rootScope, fxpAuthorizationService, fxpConfiguration, plannedDownTimeService, $state, fxpStateTransitionService);
			$rootScope.startTime = performance.now();
			subjects.filter(event => event.id === 1)[0].subject.next({ toState: toState, fromState: fromState});
		});
		it('Then isStateDown of plannedDownTimeService should have been called ', function () {
			expect(plannedDownTimeService.isStateDown).toHaveBeenCalledWith('Home');
		});		
	});
});
