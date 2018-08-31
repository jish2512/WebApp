/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import { AppControllerHelper } from '../js/factory/AppControllerHelper';
import { GlobalExceptionHandler } from '../js/telemetry/GlobalExceptionHandler';
declare var angular: any;
describe("Given AppControllerHelper", () => {
    var $scope, $rootScope, pageLoaderService, appControllerHelper, $q, userProfileService, fxpLoggerService, fxpMessageService, adalAuthenticationService, fxpContextService, fxpTelemetryContext, userInfoService, deferred, fxpUIConstants, propBagValue, propbag, featureFlagService, startUpFlightConfig, deviceFactory, DeviceDetector,
        plannedDownTimeService, fxpConfigurationService, settingsService, userClaimsService;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(function () {
        var propBag = function () {
            return {
                addToBag: function (a, b) {
                    console.log('propbag =>' + a + ':' + b);
                }
            };
        }
        angular.mock.module(function ($provide) {
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log(a + '' + b);
                });
            });
            $provide.service("adalAuthenticationService", function () {
                return {
                    userInfo: {
                        userName: "dexter@microsoft.com",
                        profile: {
                            iss: "https://sts.windows.net/a5f51bc5-4d47-4954-a546-bafe55e8db16/",
                            name: "Dexter"
                        }
                    }
                }
            });
            $provide.service("UserProfileService", function () {
                this.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    roleGroupId: 4,
                                    roleGroupName: "NONServiceUser",
                                    TenantKey: "adfuoisd",
                                    TenantName: "ES"
                                });
                        }
                    }
                });
                this.getUserThumbnail = jasmine.createSpy("getUserThumbnail").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    data: {
                                        roleGroupId: 4,
                                        roleGroupName: "NONServiceUser",
                                        TenantKey: "adfuoisd",
                                        TenantName: "ES"
                                    }
                                });
                        }
                    }
                });
                this.getBasicProfileByAlias = jasmine.createSpy("getBasicProfileByAlias").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    businessRole: "Delivery Manager"
                                });
                        }
                    }
                });
                this.isObo = jasmine.createSpy("isObo").and.callFake(function () {
                    return false;
                });
                this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function () {
                });
                this.setLoggedInUser = jasmine.createSpy("setLoggedInUser").and.callFake(function () {
                });
                this.getCalimsSvc = jasmine.createSpy("getCalimsSvc").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {
                                    defaultAppRole: "ES.DeliveryResource"
                                });
                        }
                    }
                });
            });
            $provide.service("FxpLoggerService", function () {
                this.setOBOUserContext = jasmine.createSpy("setOBOUserContext").and.callFake(function (a, b, c, d, e) {
                });
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });
                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    propBagValue = e;
                    console.log(a + ':' + b);
                });
                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    console.log(a + ' - ' + b + ' - ' + c + ' - ' + d);
                });
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b); return propBag();
                });
                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                });
                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                });
                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                });
                this.setLoggedInUserContext = jasmine.createSpy("setLoggedInUserContext").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                });

                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {
                    propbag = c;
                    console.log(a + ' - ' + b + '-' + c);
                });
                this.getDefaultPropertyBagValues = jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {
                    propbag = c;
                    console.log(a + ' - ' + b + '-' + c);
                });
            });
            $provide.service("FxpTelemetryContext", function () {
                this.addContextChangeListener = jasmine.createSpy("addContextChangeListener").and.callFake(function (a) {
                });
                this.getUserRole = jasmine.createSpy("getUserRole").and.callFake(function () {
                    return "RM";
                });
                this.getUserID = jasmine.createSpy("getUserID").and.callFake(function () {
                    return "1001";
                });
                this.getSessionID = jasmine.createSpy("getSessionID").and.callFake(function () {
                    return "1545454";
                });
                this.getAppVersion = jasmine.createSpy("getAppVersion").and.callFake(function () {
                    return "1";
                });
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
                this.setLoggedInUser = jasmine.createSpy("setLoggedInUser").and.callFake(function (a) {
                    console.log(a);
                });
                this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function (a) {
                    console.log(a);
                });
                this.addToGlobalPropertyBag = jasmine.createSpy("addToGlobalPropertyBag").and.callFake(function (a) {
                    console.log(a);
                });
                this.setUserRole = jasmine.createSpy("setUserRole").and.callFake(function (a) {
                    console.log(a);
                });
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
                this.getLoggedInUser = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function (a) {
                    return 'dexter';
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
            $provide.service("FeatureFlagService", function () {
                this.getFeatureFlags = jasmine.createSpy("getFeatureFlags").and.callFake(function () {
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
            });
            $provide.service("StartUpFlightConfig", function () {
                this.appName = "FxpApp";
                this.envName = "FxpApp";
                this.featureNames = "FxpApp";
            });
            $provide.service("SettingsService", function () {
                this.getSettings = jasmine.createSpy("saveContext").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback({
                                data: [{
                                    settingValue: "{\"isLeftNavPinned\":true,\"isNotificationDNDEnabled\":true}"
                                }]
                            }
                            );
                        }
                    }
                });
            });
            $provide.service("FxpContextService", function () {
                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function () {
                    console.log('saved');
                });
            });
            $provide.service("DeviceFactory", function () {
            });
            $provide.service("deviceDetector", function () {
                this.browser = "Chrome";
            });
            $provide.service("PlannedDownTimeService", function () {
            });
            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration = {
                    FxpConfigurationStrings: {
                        UIMessages: {
                            BasicProfileMissing: {
                                ErrorMessageTitle: "Test",
                                ErrorMessage: "Title"
                            },
                            BasicProfileAPIFailed: {
                                ErrorMessageTitle: "Test",
                                ErrorMessage: "Title"
                            },
                            InvalidRoleGroupID: {
                                ErrorMessageTitle: "InvalidRoleGroupID",
                                HyperlinkText: "Please click here to create support ticket",
                                PagetTitle: "Esxp down"
                            }
                        }
                    }
                };
                this.FxpAppSettings = {
                    OpsClaimsEndPoint: "Claims",
                    OpsProfileEndPoint: "Basic"
                };
                window["appInsight"] = {
                    trackEvent : jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {                    
                        console.log(a + ' - ' + b + '-' + c);
                    })
                };
            });
            $provide.service("UserClaimsService", function () {
                this.setLoggedInUser = jasmine.createSpy("setLoggedInUser").and.callFake(function (a) {
                    console.log('setLoggedInUser: ' + a);
                });
            });
            fxpUIConstants = {
                "UIMessages": {
                    SelectedUserProfileInformation: {
                        ErrorMessage: "System Error. Unable to retrieve on behalf of user profile. Please try again",
                        ErrorMessageTitle: "Error while retriving Onbehlafof user infromation"
                    },
                    GeneralExceptionError: {
                        ErrorMessage: "System Error. Unable to retrieve on behalf of user profile. Please try again",
                        ErrorMessageTitle: "Error while retriving Onbehlafof user infromation"
                    },
                    GetSettingsServiceCallFailedError: {
                        ErrorMessage: "System Error. Unable to retrieve on behalf of user profile. Please try again",
                        ErrorMessageTitle: "Error while retriving Onbehlafof user infromation"
                    },
                    LoadTimeOutGenericError: {
                        ErrorMessage: "LoadTimeOutGenericError"
                    },
                    LoadTimeAdalError: {
                        ErrorMessage: "LoadTimeAdalError"
                    }
                }
            };
        });
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, _$q_, UserProfileService, FxpLoggerService, PageLoaderService, FxpMessageService, adalAuthenticationService, FxpContextService, FxpTelemetryContext, FeatureFlagService, StartUpFlightConfig, SettingsService, DeviceFactory, deviceDetector, PlannedDownTimeService, FxpConfigurationService, UserInfoService, UserClaimsService, _AppControllerHelper_) {
        userProfileService = UserProfileService;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpLoggerService = FxpLoggerService;
        adalAuthenticationService = adalAuthenticationService;
        fxpMessageService = FxpMessageService;
        fxpContextService = FxpContextService;
        fxpTelemetryContext = FxpTelemetryContext;
        userInfoService = UserInfoService;
        pageLoaderService = PageLoaderService;
        featureFlagService = FeatureFlagService;
        startUpFlightConfig = StartUpFlightConfig;
        deviceFactory = DeviceFactory;
        DeviceDetector = deviceDetector;
        plannedDownTimeService = PlannedDownTimeService;
        fxpConfigurationService = FxpConfigurationService;
        settingsService = SettingsService;
        userClaimsService = UserClaimsService;
        //AppControllerHelper._instance = undefined;
        appControllerHelper = _AppControllerHelper_;
        window["tenantConfiguration"] = {
        }
    }));
    describe("When we call getBasicProfile method", function () {
        beforeEach(function () {
            $q.all = jasmine.createSpy("all").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback(
                            {
                            });
                    }
                }
            });
            spyOn($rootScope, "$broadcast").and.callThrough();
            appControllerHelper.getBasicProfile($scope);
        });
        it("Then fxpLoggerService.logEvent should be called", function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalled();
        });
        it("Then isFxpLoadedWithClaims should be true", function () {
            expect($rootScope.isFxpLoadedWithClaims).toEqual(true);
        });
        it("Then $rootScope.roleGroupIdInternal to be defined", function () {
            expect($rootScope.roleGroupIdInternal).toEqual(4);
        });
        it("Then userProfileService.setLoggedInUser should be called", function () {
            expect(userProfileService.setLoggedInUser).toHaveBeenCalled();
        });
        it("Then fxpTelemetryContext.addToGlobalPropertyBag should be called", function () {
            expect(fxpTelemetryContext.addToGlobalPropertyBag).toHaveBeenCalled();
        });
        it("Then userProfileService.setCurrentUser should be called", function () {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });
        it("Then fxpLoggerService.setLoggedInUserContext should be called", function () {
            expect(fxpLoggerService.setLoggedInUserContext).toHaveBeenCalled();
        });
        it("Then $rootScope.tenantIdInternal should be defined", function () {
            expect($rootScope.tenantIdInternal).toEqual('ES');
        });
        it("Then $rootScope.$broadcast should be called", function () {
            expect($rootScope.$broadcast).toHaveBeenCalled();
        });
    });
    describe("When we call getBasicProfile method and internal exception occurs", function () {
        beforeEach(function () {
            $q.all = jasmine.createSpy("all").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback({});
                    }
                };
            });
            userProfileService.isObo = jasmine.createSpy("isObo").and.callFake(function () {
                throw "Unknown Error";
            });
            appControllerHelper.getBasicProfile($scope);
        });
        it("Then $rootScope.roleGroupIdInternal to be -1", function () {
            expect($rootScope.roleGroupIdInternal).toEqual(-1);
        });
        it("Then fxpLoggerService.logError should be called", function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe("When we call getBasicProfile method and data returned is undefined or null", function () {
        beforeEach(function () {
            $q.all = jasmine.createSpy("all").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback({});
                    }
                };
            });
            userProfileService.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback(undefined);
                    }
                }
            });
            appControllerHelper.getBasicProfile($scope);
        });
        it("Then $rootScope.roleGroupId to be -1", function () {
            expect($rootScope.roleGroupId).toEqual(-1);
        });
    });
    describe("When we call getBasicProfile and userProfileService call fails", function () {
        beforeEach(function () {
            userProfileService.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(appControllerHelper, "checkOneProfileAndCalimStatus").and.callThrough();
            appControllerHelper.getBasicProfile($scope);
        });
        it("Then $rootScope.roleGroupId to be -1", function () {
            $scope.$apply();
            expect($rootScope.roleGroupId).toEqual(-1);
        });
        it("Then pageLoaderService.fnHidePageLoader to have been called", function () {
            $scope.$apply();
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
        it("Then appControllerHelper.checkOneProfileAndCalimStatus have been called", function () {
            $scope.$apply();
            expect(appControllerHelper.checkOneProfileAndCalimStatus).toHaveBeenCalled();
        });
        it("Then $rootScope.isFxpLoadedWithClaims to be false", function () {
            $scope.$apply();
            expect($rootScope.isFxpLoadedWithClaims).toEqual(false);
        });
    });
    describe("When we call getBasicProfile and userProfileService.getUserThumbnail call fails", function () {
        beforeEach(function () {
            userProfileService.getUserThumbnail = jasmine.createSpy("getUserThumbnail").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = { data: { ErrorCode: '404' } };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(appControllerHelper, "checkOneProfileAndCalimStatus").and.callThrough();
            appControllerHelper.getBasicProfile($scope);
        });
        it("Then $scope.userThumbnailPhoto to be /assets/pictures/User.png", function () {
            $scope.$apply();
            expect($scope.userThumbnailPhoto).toEqual("/assets/pictures/User.png");
        });
        it("Then fxpLoggerService.stopTrackPerformance should be called", function () {
            $scope.$apply();
            expect(fxpLoggerService.stopTrackPerformance).toHaveBeenCalled();
        });
    });
    describe("When we call checkOneProfileAndCalimStatus and basic profile call failed", function () {
        beforeEach(function () {
            var err = {
                config: {
                    url: "basic"
                },
                status: -1
            }
            window["tenantConfiguration"] = {
                ProfileStore: {
                    ProfileAPIEndPoint : 'basic'
                }
            }            
            spyOn(appControllerHelper, "getBasicProfileFailed").and.callThrough();            
            appControllerHelper.checkOneProfileAndCalimStatus(err);
        });
        it("Then getBasicProfileFailed should be called", function () {
            expect(appControllerHelper.getBasicProfileFailed).toHaveBeenCalled();
        });        
    });
    describe("When we call checkOneProfileAndCalimStatus and claims call failed", function () {
        beforeEach(function () {
            var err = {
                config: {
                    url: "/claims"
                },
                status: -1
            }
            window["tenantConfiguration"] = {
                AuthStore: {
                    UserClaimsEndPoint : '/claims'
                }
            }                       
            spyOn(appControllerHelper, "getClaimsFailed").and.callThrough();
            appControllerHelper.checkOneProfileAndCalimStatus(err);
        });
        it("Then getClaimsFailed should be called", function () {
            expect(appControllerHelper.getClaimsFailed).toHaveBeenCalled();
        });        
    });
    describe("When we call checkOneProfileAndCalimStatus and err code is 114", function () {
        beforeEach(function () {
            var err = {
                config: {
                    url: ["Claims", "Basic"]
                },
                data: {
                    ErrorCode: 114
                }
            }            
            window["tenantConfiguration"] = {
                ProfileStore: {
                    ProfileAPIEndPoint : 'Basic'
                }
            }  
            spyOn(appControllerHelper, "getBasicProfileFailed").and.callThrough();
            appControllerHelper.checkOneProfileAndCalimStatus(err);
        });
        it("Then getBasicProfileFailed should be called", function () {
            expect(appControllerHelper.getBasicProfileFailed).toHaveBeenCalled();
        });        
    });
    describe("When we call postLoginSuccess ", function () {
        beforeEach(function () {
            var err = {
                config: {
                    url: ["Claims", "Basic"]
                },
                data: {
                    ErrorCode: 114
                }
            }
            GlobalExceptionHandler.logFxpBootFailure = jasmine.createSpy("logFxpBootFailure").and.callFake(function () {
            });
            spyOn(appControllerHelper, "getUserPreferenceSettings");
            spyOn(appControllerHelper, "getInitalFlags");
            appControllerHelper.postLoginSuccess();
            $rootScope.$broadcast('OnFxpLoadedEvent');
        });
        it("Then getUserPreferenceSettings should be called", function () {
            expect(appControllerHelper.getUserPreferenceSettings).toHaveBeenCalled();
        });
        it("Then getInitalFlags should be called", function () {
            expect(appControllerHelper.getInitalFlags).toHaveBeenCalled();
        });
    });
    describe("When we call getUserPreferenceSettings and device is mobile", function () {
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return true;
            });
            appControllerHelper.getUserPreferenceSettings();
        });
        it("Then $rootScope.isLeftNavOpen is false", function () {
            expect($rootScope.isLeftNavOpen).toEqual(false);
        });
        it("Then $rootScope.isLeftNavPinned is false", function () {
            expect($rootScope.isLeftNavPinned).toEqual(false);
        });
    });
    describe("When we call getUserPreferenceSettings and device is dektop/tablet", function () {
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return false;
            });
            appControllerHelper.getUserPreferenceSettings();
        });
        it("Then $rootScope.isLeftNavOpen is true", function () {
            expect($rootScope.isLeftNavOpen).toEqual(true);
        });
        it("Then $rootScope.isLeftNavPinned is true", function () {
            expect($rootScope.isLeftNavPinned).toEqual(true);
        });
        it("Then $rootScope.isNotificationDNDEnabled is true", function () {
            expect($rootScope.isNotificationDNDEnabled).toEqual(true);
        });
    });
    describe("When we call getUserPreferenceSettings and SettingService.getSettings returns undefined data", function () {
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return false;
            });
            settingsService.getSettings = jasmine.createSpy("getSettings").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback(undefined);
                    }
                }
            });
            spyOn(appControllerHelper, "setDefaultUserPreferences").and.callThrough();
            appControllerHelper.getUserPreferenceSettings();
        });
        it("Then setDefaultUserPreferences should be called", function () {
            expect(appControllerHelper.setDefaultUserPreferences).toHaveBeenCalled();
        });
    });
    describe("When we call getUserPreferenceSettings and SettingService.getSettings fails", function () {
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return false;
            });
            settingsService.getSettings = jasmine.createSpy("getSettings").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = {
                    status: "404",
                    statusText: "Not Found",
                    data: ""
                };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            spyOn(appControllerHelper, "setDefaultUserPreferences").and.callThrough();
            appControllerHelper.getUserPreferenceSettings();
        });
        it("Then setDefaultUserPreferences should be called", function () {
            $scope.$apply();
            expect(appControllerHelper.setDefaultUserPreferences).toHaveBeenCalled();
        });
        it("Then fxpMessageService.addMessage should be called", function () {
            $scope.$apply();
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
    });
    describe("When we call getInitalFlags and featureFlagService.getFeatureFlags is success", function () {
        beforeEach(function () {
            featureFlagService.getFeatureFlags = jasmine.createSpy("getSettings").and.callFake(function () {
                return {
                    then: function (callback) {
                        return callback("retrieved");
                    }
                }
            });
            appControllerHelper.getInitalFlags();
        });
        it("Then $rootScope.initialFlags is available", function () {
            expect($rootScope.initialFlags).toEqual("retrieved");
        });
    });
    describe("When we call getUserPreferenceSettings and SettingService.getSettings fails", function () {
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return false;
            });
            featureFlagService.getFeatureFlags = jasmine.createSpy("getSettings").and.callFake(function () {
                var defer = $q.defer();
                var errwithoutcode = {
                    status: "404",
                    statusText: "Not Found",
                    data: ""
                };
                defer.reject(errwithoutcode);
                return defer.promise;
            });
            appControllerHelper.getInitalFlags();
        });
        it("Then fxpLoggerService.logError should be called", function () {
            $scope.$apply();
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });
    describe("When handleAdalErrors method gets called if get any adal error", function () {
        beforeEach(function () {
            //AppControllerHelper._instance = appControllerHelper;            
            localStorage["adal.error.description"] = ["AADSTS50058"];
            appControllerHelper.handleAdalErrors();
        });
        it("Then fxpMessageService.addMessage should have been called", function () {
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
        it("Then fxpLoggerService.logError should have been called", function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
        afterEach(function () {
            //Fxp.Factory.AppControllerHelper._instance = undefined;  
        });

    });
    describe("When handleAdalErrors method gets called", function () {
        beforeEach(function () {
            //Fxp.Factory.AppControllerHelper._instance = appControllerHelper;
            localStorage["adal.error.description"] = "";
            appControllerHelper.handleAdalErrors();
        });
        it("Then fxpLoggerService.logError should have been called", function () {
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
        it("Then fxpMessageService.addMessage should have been called", function () {
            expect(fxpMessageService.addMessage).toHaveBeenCalled();
        });
        afterEach(function () {
            //Fxp.Factory.AppControllerHelper._instance = undefined;  
        });
    });
});
