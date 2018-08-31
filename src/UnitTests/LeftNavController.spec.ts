import {LeftNavController} from '../js/controllers/leftNavController';
import {Resiliency} from '../js/resiliency/FxpResiliency';
declare var angular:any;
describe("Given LeftNavController", () => {
    var $rootScope, $serviceIntervalSpy, $scope, $window, $timeout, fxpConfigurationService, $state, fxpRouteService, fxpLoggerService, adalLoginHelperService, $base64, userInfoService, dashboardService, adminLandingService, fxpMessage, $controller, leftNavData, $q, fxpUIConstants, deviceFactory, settingsService, fxpContextService, userProfileService, fxpTelemetryContext, devicedetector;
    var leftNavItems = {
        "data": {
            "internalLinks": [
                {
                    "id": "1",
                    "businessProcessName": "FXP Dashboard",
                    "displayName": "Dashboard",
                    "iconCSS": "icon icon-people",
                    "tooltip": "Takes you to the dashboard defined for your persona",
                    "targetUIStateName": "DashBoard",
                    "openInline": true,
                    "sortOrder": 1,
                    "hasChildren": false,
                    "applicableDevice": "Desktop"
                }
            ],
            "externalLinks": [{
                "id": "5",
                "displayName": "External Links",
                "iconCSS": "icon icon-people",
                "tooltip": "External links",
                "hasChildren": true,
                "sortOrder": 2,
                "openInline": false,
                "children": [
                    {
                        "id": "6",
                        "displayName": "IT Web",
                        "iconCSS": "itwebicon",
                        "tooltip": "Takes you to the it MS internal portal",
                        "targetURL": "http://aka.ms/itweb",
                        "OpenInline": false,
                        "sortOrder": 1,
                        "parentId": "5"
                    }
                ]
            }],
            "settings": [
                {
                    "id": "1",
                    "displayName": "Settings1",
                    "iconCSS": "itwebicon",
                    "tooltip": "Takes you to Dashboard Settings",
                    "sortOrder": 1
                }
            ]
        }
    };
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

            $provide.service("FxpConfigurationService", function () {
                var config = {
                    "fxpServiceEndPoint": "https://fxpservicesapidev.azurewebsites.net/api/v1"
                }
                this.FxpAppSettings = config;
            });


            $provide.service("FxpRouteService", function () {
                this.getDefaultStateName = jasmine.createSpy("go").and.callFake(function (key, value) {
                    return 'Dashboard';
                });
            });

            $provide.service("AdminLandingService", function () {
                this.GetAdminTileDetails  = jasmine.createSpy("GetAdminTileDetails").and.callFake(function (a) {
                    return {
                        then: function (callback) {
                            callback({
                                "data": {
                                    "tileGroupId": 1,
                                    "tileGroupName": "Fxp Admin",
                                    "adminTiles": {
                                        "id": "1",
                                        "businessProcessName": "FXP Dashboard",
                                        "displayName": "Dashboard",
                                        "iconCSS": "icon icon-people",
                                        "tooltip": "Takes you to the dashboard defined for your persona",
                                        "targetUIStateName": "DashBoard",
                                        "openInline": true,
                                        "sortOrder": 1,
                                        "applicableDevice": "All",
                                        "requiredRoles": ["Fxp.Admin"]

                                    }
                                }

                            });
                            return { 'then': function (callback) { callback(); } }
                        }
                    }
                });
            });
            $provide.service("DashboardService", function () {                
                this.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {
                            return callback({
                                "data": {
                                    "internalLinks": [
                                        {
                                            "id": "1",
                                            "businessProcessName": "FXP Dashboard",
                                            "displayName": "Dashboard",
                                            "iconCSS": "icon icon-people",
                                            "tooltip": "Takes you to the dashboard defined for your persona",
                                            "targetUIStateName": "DashBoard",
                                            "openInline": true,
                                            "sortOrder": 1,
                                            "hasChildren": false,
                                            "applicableDevice": "All"
                                        }
                                    ],
                                    "externalLinks": [{
                                        "id": "5",
                                        "displayName": "External Links",
                                        "iconCSS": "icon icon-people",
                                        "tooltip": "External links",
                                        "hasChildren": true,
                                        "sortOrder": 2,
                                        "openInline": false,
                                        "children": [
                                            {
                                                "id": "6",
                                                "displayName": "IT Web",
                                                "iconCSS": "itwebicon",
                                                "tooltip": "Takes you to the it MS internal portal",
                                                "targetURL": "http://aka.ms/itweb",
                                                "OpenInline": false,
                                                "sortOrder": 1
                                            }
                                        ]
                                    }],
                                    "settings": [
                                        {
                                            "id": "1",
                                            "displayName": "Settings1",
                                            "iconCSS": "itwebicon",
                                            "tooltip": "Takes you to Dashboard Settings",
                                            "sortOrder": 1
                                        }
                                    ]
                                }
                            });
                        }
                    }
                });
                this.getGLNFlatDataStructure = jasmine.createSpy("getGLNFlatDataStructure").and.callFake(function (a) {
                    console.log('getGLNFlatDataStructure : ' + a);
                    var glnFlatData = [{
                        "id": 2,
                        "businessProcessName": "Time Management",
                        "displayName": "Time sheet",
                        "iconCSS": "icon icon-time",
                        "tooltip": "Time management activities for managers",
                        "hasChildren": false,
                        "openInline": true,
                        "sortOrder": 2
                    },
                    {
                        "id": 3,
                        "displayName": "Time Entry",
                        "iconCSS": "Timeentry",
                        "tooltip": "Takes you to the time entry page",
                        "targetUIStateName": "TimeEntry",
                        "isExternal": false,
                        "openInline": true,
                        "sortOrder": 2,
                        "hasChildren": false
                    },
                    {
                        "id": 4,
                        "displayName": "Time Approval",
                        "iconCSS": "Timeapproval",
                        "tooltip": "Takes you to the time approval page",
                        "targetUIStateName": "TimeApproval",
                        "isExternal": false,
                        "openInline": true,
                        "sortOrder": 1,
                        "hasChildren": false

                    }];
                    return glnFlatData;
                });
            });

            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
                    return  propBag();
                });

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d + ',' + e);
                });
                this.logEvent = jasmine.createSpy("logEvent ").and.callFake(function (a, b, c) {
                    console.log('logEvent  : ' + a + ',' + b + ',' + c);
                });
            });

            $provide.service("UserInfoService", function () {
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    console.log('getLoggedInUser : ');
                    return "alias";
                });
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    console.log('getCurrentUser : ');
                    return "alias";
                });
                this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                    console.log('isActingOnBehalfOf : ');
                    return false;
                });
                this.getCurrentUserData = jasmine.createSpy("getCurrentUserData").and.callFake(function () {
                    var userInfo = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":1,"roleGroupName":"Non Services User"}';
                    userInfo = JSON.parse(userInfo);
                    console.log('getCurrentUserData : ' + userInfo);
                    return userInfo;
                });
            });
            $provide.service("AdalLoginHelperService", function () {
                this.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.returnValue(false);
            });
            $provide.service("$base64", function () {
                this.encode = jasmine.createSpy("encode").and.callFake(function (a, b) {
                    return {
                        then: function (callback) { return callback("T25lUHJvZmlsZS5Qcm9maWxlQWRtaW4sT25lUHJvZmlsZS5SZXNvdXJjZVByb2ZpbGVSZWFkZXIsR2xvYmFsUmVzb3VyY2VNYW5hZ2VtZW50LkFkbWluLEdsb2JhbFJlc291cmNlTWFuYWdlbWVudC5SZXF1ZXN0b3IsR2xvYmFsUmVzb3VyY2VNYW5hZ2VtZW50LlJlc291cmNlLEZpZWxkRXhwcmllbmNlLkZ4UEFkbWluLEZpZWxkRXhwcmllbmNlLkZYUFNFLEZpZWxkRXhwcmllbmNlLkxlZnROYXZBZG1pbixGaWVsZEV4cHJpZW5jZS5PQk9BZG1pbg=="); }
                    }
                });
            });
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log('addMessage: ' + a + '' + b);
                });
            });

            $provide.service("DeviceFactory", function () {
                this.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                    console.log('isMobile: ');
                    return false;
                });
            });

            $provide.service("SettingsService", function () {

                this.saveSettings = jasmine.createSpy("saveSettings").and.callFake(function (a, b, c, d) {
                    return {
                        then: function (callback) {
                            return callback({ "Result": "{\"isLeftNavPinned\":true}" });
                        }
                    }
                });
            });
            $provide.service("FxpContextService", function () {
                this.readContext = jasmine.createSpy("readContext").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {
                            return callback({ "Result": "{\"isLeftNavPinned\":true}" });
                        }
                    }
                });
                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (a, b, c) {
                    return {
                        then: function (callback) {
                            return callback({ "Result": "{\"isLeftNavPinned\":false}" });
                        }
                    }
                });
            });
            $provide.service("UserProfileService", function () {
                this.getBasicProfileByAlias = jasmine.createSpy("getBasicProfileByAlias").and.callFake(function (a, b) {
                    return {
                        then: function (callback) { return callback({ fullName: "MyName", businessRole: "NonServiceUser", roleGroupName: "NonServiceUser" }); }
                    }
                });
            });
            $provide.service("FxpTelemetryContext", function () {
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
            });
            $provide.service("deviceDetector", function () {
                this.browser = "chrome";
            });
            fxpUIConstants = {
                "UIMessages": {
                    GeneralExceptionError: {
                        ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                        ErrorMessageTitle: "Genreic Exception"
                    },
                    LeftNavServiceCallFailedError: {
                        ErrorMessage: "System Error has ocurred: Unable to retrieve your  profile information. Please try again",
                        ErrorMessageTitle: "Error in getLeftNav of LeftNavController"
                    },
                    AdminLandingServiceCallFailedError: {
                        ErrorMessage: "System Error has ocurred. Unable to retrieve admin information. Please try again",
                        ErrorMessageTitle: "Error in getting GetAdminTileDetails of AdminLandingService"
                    },
                    AADAuthFailureError: {
                        ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                        ErrorMessageTitle: "Error occured while retrieving JWT Token"
                    },
                    AuthServiceReturnsBlankAppRoleError: {
                        ErrorMessage: "Your profile does not have permissions to access this content. Please contact IT support.",
                        ErrorMessageTitle: "Error in getUserClaims from service which returns Blank App Roles"
                    },
                    SelectedProfileRoles: {
                        ErrorMessage: "System Error. Unable to load on behalf of user application roles. Please try again",
                        ErrorMessageTitle: "Error while loading Onbehlafof user claims"
                    },

                    SaveSettingsServiceCallFailedError: {
                        ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                        ErrorMessageTitle: "Call to Save Settings service failed"
                    }
                }
            };
        })
    })
    beforeEach(angular.mock.module(function ($stateProvider) {
        $stateProvider
            .state('DashBoard', {
                url: "/Home",
                templateUrl: "http://fxppartnerapp.azurewebsites.net/GrmDashboard.html",
                controller: 'grmDashboardCtrl'
            })
            .state('UserLookupPersonalization', {
                url: "/userlookuppersonalization",
                templateUrl: "/templates/userLookupPersonalization.html",
                controller: 'UserLookupPersonalizationController'
            })
            .state('TimeEntry', {
                url: "/timeentry",
                templateUrl: "/templates/timeentry.html",
                controller: 'TimeEntry'
            });
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$state_, FxpConfigurationService, DashboardService, AdminLandingService, FxpLoggerService, AdalLoginHelperService, _$base64_, FxpRouteService, UserInfoService, FxpMessageService, _$controller_, _$q_, _$timeout_, _$window_, DeviceFactory, UserProfileService, SettingsService, FxpContextService, FxpTelemetryContext, deviceDetector) {
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpConfigurationService = FxpConfigurationService;
        $scope = _$rootScope_.$new();
        $state = _$state_;
        dashboardService = DashboardService;
        adminLandingService = AdminLandingService;
        $base64 = _$base64_;
        fxpRouteService = FxpRouteService;
        fxpLoggerService = FxpLoggerService;
        adalLoginHelperService = AdalLoginHelperService;
        userInfoService = UserInfoService;
        fxpMessage = FxpMessageService;
        deviceFactory = DeviceFactory;
        fxpContextService = FxpContextService;
        settingsService = SettingsService;
        userProfileService = UserProfileService;
        fxpTelemetryContext = FxpTelemetryContext;
        devicedetector = deviceDetector;
        $window = _$window_;
        $timeout = _$timeout_;
        $controller = _$controller_;
        $timeout = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000;
        $q = _$q_;
    }));

    describe("When LeftNavController Loaded and returns leftNavData for logged in user", () => {
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [
                        {
                            "id": "1",
                            "businessProcessName": "FXP Dashboard",
                            "displayName": "Dashboard",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the dashboard defined for your persona",
                            "targetUIStateName": "DashBoard",
                            "openInline": true,
                            "sequence": 1,
                            "sortOrder": 1,
                            "hasChildren": false,
                            "applicableDevice": "All"
                        }
                    ],
                    "externalLinks": [{
                        "id": "5",
                        "displayName": "External Links",
                        "iconCSS": "icon icon-people",
                        "tooltip": "External links",
                        "hasChildren": true,
                        "sortOrder": 2,
                        "openInline": false,
                        "children": [
                            {
                                "id": "6",
                                "displayName": "IT Web",
                                "iconCSS": "itwebicon",
                                "tooltip": "Takes you to the it MS internal portal",
                                "targetURL": "http://aka.ms/itweb",
                                "OpenInline": false,
                                "sortOrder": 1
                            }
                        ]
                    }],
                    "settings": [
                        {
                            "id": "1",
                            "displayName": "Settings1",
                            "iconCSS": "itwebicon",
                            "tooltip": "Takes you to Dashboard Settings",
                            "sortOrder": 1
                        }
                    ]
                }
            };
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":"1","roleGroupName":"Resource"}';
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                AdminLandingService: adminLandingService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 1, 59);
        });
        it('Then GetAdminTileDetails  method of AdminLandingService should have been called', function () {
            expect(adminLandingService.GetAdminTileDetails).toHaveBeenCalledWith(true);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be true', function () {
            expect($scope.leftNavDataExists).toEqual(true);
        });

    });

    describe("When LeftNavController Loaded and returns leftNavData which dont have any links", () => {
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [],
                    "externalLinks": [],
                    "settings": []
                }
            };
            dashboardService.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                return {
                    then: function (callback) {
                        return callback({
                            "data": {
                                "internalLinks": [],
                                "externalLinks": [],
                                "settings": []
                            }
                        });
                    }
                }
            });

            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 1, 59);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be false', function () {
            expect($scope.leftNavDataExists).toEqual(false);
        });

        it('Then addMessage method of fxpMessageService should have been called', function () {
            expect(fxpMessage.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });

    describe("When LeftNavController Loaded and returns leftNavData for obo user", () => {
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [
                        {
                            "id": "1",
                            "businessProcessName": "FXP Dashboard",
                            "displayName": "Dashboard",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the dashboard defined for your persona",
                            "targetUIStateName": "DashBoard",
                            "openInline": true,
                            "sortOrder": 1,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 1
                        },
                        {
                            "id": "2",
                            "businessProcessName": "Act On Behalf",
                            "displayName": "ActOnBehalf",
                            "iconCSS": "icon actonbehalf",
                            "tooltip": "Takes you to the ActOnBehalf page",
                            "targetUIStateName": "ActOnBehalf",
                            "openInline": true,
                            "sortOrder": 2,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 2
                        }
                    ],
                    "externalLinks": [{
                        "id": "5",
                        "displayName": "External Links",
                        "iconCSS": "icon icon-people",
                        "tooltip": "External links",
                        "hasChildren": true,
                        "sortOrder": 2,
                        "openInline": false,
                        "children": [
                            {
                                "id": "6",
                                "displayName": "IT Web",
                                "iconCSS": "itwebicon",
                                "tooltip": "Takes you to the it MS internal portal",
                                "targetURL": "http://aka.ms/itweb",
                                "OpenInline": false,
                                "sortOrder": 1
                            }
                        ]
                    }],
                    "settings": [
                        {
                            "id": "1",
                            "displayName": "Settings1",
                            "iconCSS": "itwebicon",
                            "tooltip": "Takes you to Dashboard Settings",
                            "sortOrder": 1
                        }
                    ]
                }
            };
            dashboardService.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                return {
                    then: function (callback) {
                        return callback({
                            "data": leftNavData.data
                        });
                    }
                }
            });
            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 1, 59);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be true', function () {
            expect($scope.leftNavDataExists).toEqual(true);
        });

    });

    describe("When LeftNavController Loaded and returns leftNavData without any links for obo user", () => {
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [],
                    "externalLinks": [],
                    "settings": []
                }
            };
            dashboardService.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                return {
                    then: function (callback) {
                        return callback({
                            "data": {
                                "internalLinks": [],
                                "externalLinks": [],
                                "settings": []
                            }
                        });
                    }
                }
            });
            $rootScope.actOnBehalfOfUserActive = true;
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 1, 59);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be false', function () {
            expect($scope.leftNavDataExists).toEqual(false);
        });

        it('Then addMessage method of fxpMessageService should have been called', function () {
            expect(fxpMessage.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });

    });

    describe("When getLeftNav method of LeftNavController gets called", () => {
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [
                        {
                            "id": "1",
                            "businessProcessName": "FXP Dashboard",
                            "displayName": "Dashboard",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the dashboard defined for your persona",
                            "targetUIStateName": "DashBoard",
                            "openInline": true,
                            "sortOrder": 1,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 1
                        }
                    ],
                    "externalLinks": [{
                        "id": "5",
                        "displayName": "External Links",
                        "iconCSS": "icon icon-people",
                        "tooltip": "External links",
                        "hasChildren": true,
                        "sortOrder": 2,
                        "openInline": false,
                        "children": [
                            {
                                "id": "6",
                                "displayName": "IT Web",
                                "iconCSS": "itwebicon",
                                "tooltip": "Takes you to the it MS internal portal",
                                "targetURL": "http://aka.ms/itweb",
                                "OpenInline": false,
                                "sortOrder": 1
                            }
                        ]
                    }],
                    "settings": [
                        {
                            "id": "1",
                            "displayName": "Settings1",
                            "iconCSS": "itwebicon",
                            "tooltip": "Takes you to Dashboard Settings",
                            "sortOrder": 1
                        }
                    ]
                }
            };
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            controller.getLeftNav('alias', 2, 5);
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 2, 5);
        });

        it('Then GetAdminTileDetails  method of AdminLandingService should have been called', function () {
            expect(adminLandingService.GetAdminTileDetails).toHaveBeenCalledWith(true);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be true', function () {
            expect($scope.leftNavDataExists).toEqual(true);
        });

    });

    describe("When LeftNavController Loaded and broadcasted the UserContextChanged event for loggedin user", () => {
        var controller;
        beforeEach(function () {
            leftNavData = {
                "data": {
                    "internalLinks": [
                        {
                            "id": "1",
                            "businessProcessName": "FXP Dashboard",
                            "displayName": "Dashboard",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the dashboard defined for your persona",
                            "targetUIStateName": "DashBoard",
                            "openInline": true,
                            "sortOrder": 1,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 1
                        }
                    ],
                    "externalLinks": [{
                        "id": "5",
                        "displayName": "External Links",
                        "iconCSS": "icon icon-people",
                        "tooltip": "External links",
                        "hasChildren": true,
                        "sortOrder": 2,
                        "openInline": false,
                        "children": [
                            {
                                "id": "6",
                                "displayName": "IT Web",
                                "iconCSS": "itwebicon",
                                "tooltip": "Takes you to the it MS internal portal",
                                "targetURL": "http://aka.ms/itweb",
                                "OpenInline": false,
                                "sortOrder": 1
                            }
                        ]
                    }],
                    "settings": [
                        {
                            "id": "1",
                            "displayName": "Settings1",
                            "iconCSS": "itwebicon",
                            "tooltip": "Takes you to Dashboard Settings",
                            "sortOrder": 1
                        }
                    ]
                }
            };
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                FxpRouteService: fxpRouteService
            });

            $rootScope.$broadcast('UserContextChanged', 'alias', 1, 59);
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('alias', 1, 59);
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });
        it('Then currentUserDefaultState should return default stateName', function () {
            expect(controller.currentUserDefaultState).toEqual('Dashboard');
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be true', function () {
            expect($scope.leftNavDataExists).toEqual(true);
        });

        it('Then $scope.selectedLeftNavItemLinkId should be defined as default value', function () {
            expect($scope.selectedLeftNavItemLinkId).toEqual(-1);
        });
    });

    describe("When LeftNavController Loaded and broadcasted the UserContextChanged event for obo user", () => {
        beforeEach(function () {
            userInfoService.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                console.log('isActingOnBehalfOf : ');
                return true;
            });
            leftNavData = {
                "data": {
                    "internalLinks": [
                        {
                            "id": "1",
                            "businessProcessName": "FXP Dashboard",
                            "displayName": "Dashboard",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the dashboard defined for your persona",
                            "targetUIStateName": "DashBoard",
                            "openInline": true,
                            "sortOrder": 1,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 1
                        },
                        {
                            "id": "2",
                            "businessProcessName": "Act On Behalf",
                            "displayName": "ActOnBehalf",
                            "iconCSS": "icon actonbehalf",
                            "tooltip": "Takes you to the ActOnBehalf page",
                            "targetUIStateName": "ActOnBehalf",
                            "openInline": true,
                            "sortOrder": 2,
                            "hasChildren": false,
                            "applicableDevice": "All",
                            "sequence": 2
                        }
                    ],
                    "externalLinks": [{
                        "id": "5",
                        "displayName": "External Links",
                        "iconCSS": "icon icon-people",
                        "tooltip": "External links",
                        "hasChildren": true,
                        "sortOrder": 2,
                        "openInline": false,
                        "children": [
                            {
                                "id": "6",
                                "displayName": "IT Web",
                                "iconCSS": "itwebicon",
                                "tooltip": "Takes you to the it MS internal portal",
                                "targetURL": "http://aka.ms/itweb",
                                "OpenInline": false,
                                "sortOrder": 1
                            }
                        ]
                    }],
                    "settings": [
                        {
                            "id": "1",
                            "displayName": "Settings1",
                            "iconCSS": "itwebicon",
                            "tooltip": "Takes you to Dashboard Settings",
                            "sortOrder": 1
                        }
                    ]
                }
            };
            dashboardService.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                return {
                    then: function (callback) {
                        return callback({
                            "data": {
                                "internalLinks": [
                                    {
                                        "id": "1",
                                        "businessProcessName": "FXP Dashboard",
                                        "displayName": "Dashboard",
                                        "iconCSS": "icon icon-people",
                                        "tooltip": "Takes you to the dashboard defined for your persona",
                                        "targetUIStateName": "DashBoard",
                                        "openInline": true,
                                        "sortOrder": 1,
                                        "hasChildren": false,
                                        "applicableDevice": "All",
                                        "sequence": 1
                                    },
                                    {
                                        "id": "2",
                                        "businessProcessName": "Act On Behalf",
                                        "displayName": "ActOnBehalf",
                                        "iconCSS": "icon actonbehalf",
                                        "tooltip": "Takes you to the ActOnBehalf page",
                                        "targetUIStateName": "ActOnBehalf",
                                        "openInline": true,
                                        "sortOrder": 2,
                                        "hasChildren": false,
                                        "applicableDevice": "All",
                                        "sequence": 2
                                    }
                                ],
                                "externalLinks": [{
                                    "id": "5",
                                    "displayName": "External Links",
                                    "iconCSS": "icon icon-people",
                                    "tooltip": "External links",
                                    "hasChildren": true,
                                    "sortOrder": 2,
                                    "openInline": false,
                                    "children": [
                                        {
                                            "id": "6",
                                            "displayName": "IT Web",
                                            "iconCSS": "itwebicon",
                                            "tooltip": "Takes you to the it MS internal portal",
                                            "targetURL": "http://aka.ms/itweb",
                                            "OpenInline": false,
                                            "sortOrder": 1
                                        }
                                    ]
                                }],
                                "settings": [
                                    {
                                        "id": "1",
                                        "displayName": "Settings1",
                                        "iconCSS": "itwebicon",
                                        "tooltip": "Takes you to Dashboard Settings",
                                        "sortOrder": 1
                                    }
                                ]
                            }
                        });
                    }
                }
            });
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });

            $rootScope.$broadcast('UserContextChanged', 'oboUser', '2', '6');
        })

        it('Then getLeftNavData method of DashboardService should have been called', function () {
            expect(dashboardService.getLeftNavData).toHaveBeenCalledWith('oboUser', '2', '6');
        });

        it('Then logInformation method of FxpLoggerService should have been called', function () {
            expect(fxpLoggerService.logInformation).toHaveBeenCalledWith('Fxp.Client.LeftNavController', "OnSuccessGetLeftNav");
        });

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData.data);
        });

        it('Then $scope.leftNavDataExists should be true', function () {
            expect($scope.leftNavDataExists).toEqual(true);
        });



      
        it('Then $scope.selectedLeftNavItemLinkId should be defined as default value', function () {
            expect($scope.selectedLeftNavItemLinkId).toEqual(-1);
        });

    });


    describe("When LeftNavController Loaded and if dashboardService thrown any error", () => {
        beforeEach(function () {
            dashboardService.getLeftNavData = jasmine.createSpy("getLeftNavData").and.callFake(function (a, b) {
                var defer = $q.defer();
                var error = {
                    messege: "Error in dashboardService for getLeftNavData method"
                };
                defer.reject(error);
                return defer.promise;
            });
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })
        it('Then addMessage method of fxpMessageService should have been called', function () {
            $scope.$apply();
            expect(fxpMessage.addMessage).toHaveBeenCalledWith('System Error has ocurred: Unable to retrieve your  profile information. Please try again', 'error');
        });
        it('Then logError method of fxpLoggerService should have been called', function () {
            $scope.$apply();
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });

    describe("When LeftNavController Loaded and if adminLandingService thrown any error", () => {
        beforeEach(function(){
            adminLandingService.GetAdminTileDetails = jasmine.createSpy("GetAdminTileDetails").and.callFake(function () {
                var defer = $q.defer();
                var error = {
                    messege: "adminLandingService for GetAdminTileDetails method"
                };
                defer.reject(error);
                return defer.promise;
            });
            var controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                AdminLandingService: adminLandingService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
        })
        it('Then addMessage method of fxpMessageService should have been called', function () {
            $scope.$apply();
            expect(fxpMessage.addMessage).toHaveBeenCalledWith('System Error has ocurred. Unable to retrieve admin information. Please try again', 'error');
        });
        it('Then logError method of fxpLoggerService should have been called', function () {
            $scope.$apply();
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });

    describe("When LeftNavController Loaded and renderFlyoutForClick is called", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            spyOn(controller, "resetLeftNavFocus").and.callThrough();
            controller.expandLeftNav();
        })

        it('Then setFocusToHamburger should have been called', function () {
            $scope.$apply();
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
        it('Then lresetLeftNavFocus should have been called', function () {
            $scope.$apply();
            expect(controller.resetLeftNavFocus).toHaveBeenCalled();
        });
    });
    describe("When LeftNavController Loaded and renderFlyoutForClick is called and is isPinFlyout is false", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            spyOn(controller, "resetLeftNavFocus").and.callThrough();
            $rootScope.isPinFlyout = false;
            controller.expandLeftNav();
        })

        it('Then setFocusToHamburger should have been called', function () {
            $scope.$apply();
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
        it('Then resetLeftNavFocus should have been called', function () {
            $scope.$apply();
            expect(controller.resetLeftNavFocus).toHaveBeenCalled();
        });
    });

    describe("When LeftNavController Loaded and openFlyoutOnClick  is called and item doesn't have child", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            spyOn(controller, "resetLeftNavFocus").and.callThrough();
            $rootScope.isPinFlyout = false;
            $rootScope.isHamburger = true;
            var event = {
                ctrlKey: false,
                shiftKey: false
            };
            controller.openFlyoutOnClick(leftNavItems.data.internalLinks[0], event);
        })
        it('Then resetLeftNavFocus should have been called', function () {
            $scope.$apply();
            expect(controller.resetLeftNavFocus).toHaveBeenCalled();
        });
        it('Then $rootScope.isHamburger  should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isHamburger).toBe(true);
        });
        it('Then $scope.selectedLeftNavItemId should be -1 ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(-1);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should have item id', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual("1");
        });
    });

    describe("When LeftNavController Loaded and leftNavItem clicked on L0", () => {
        var controller;
        var item = {
            parentId: 2,
            id: 1,
            parentSequence: 1
        }
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setSelectedLeftNavIds").and.callThrough();
            var event = {
                ctrlKey: false,
                shiftKey: false
            };
            controller.leftNavItemClick(item, event);
        })
        it('Then setSelectedLeftNavIds should have been called', function () {
            $scope.$apply();
            expect(controller.setSelectedLeftNavIds).toHaveBeenCalled();
        });

        it('Then $scope.selectedLeftNavItemId should be update ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(item.id);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should be update', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual(item.parentId);
        });
    });
    describe("When LeftNavController Loaded and leftNavItem clicked on L1", () => {
        var controller;
        var item = {
            parentId: null,
            id: 1,
            sequence: 1
        }
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setSelectedLeftNavIds").and.callThrough();
            var event = {
                ctrlKey: false,
                shiftKey: false
            };
            controller.leftNavItemClick(item, event);
        })
        it('Then setSelectedLeftNavIds should have been called', function () {
            $scope.$apply();
            expect(controller.setSelectedLeftNavIds).toHaveBeenCalledWith(item.id, -1, item.sequence);
        });

        it('Then $scope.selectedLeftNavItemId should be update ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(-1);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should be update', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual(item.id);
        });
    });

    describe("When LeftNavController Loaded and openFlyoutOnClick  is called and item have child", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            spyOn(controller, "resetLeftNavFocus").and.callThrough();
            $rootScope.isPinFlyout = false;
            $rootScope.isHamburger = true;
            var event = {
                ctrlKey: false,
                shiftKey: false
            };
            controller.openFlyoutOnClick(leftNavItems.data.externalLinks[0], event);
            $timeout.flush(50);
        })
        it('Then resetLeftNavFocus should have been called', function () {
            $scope.$apply();
            expect(controller.resetLeftNavFocus).toHaveBeenCalled();
        });
        it('Then $rootScope.isHamburger  should have been set as true', function () {
            $scope.$apply();
            expect($rootScope.isHamburger).toBe(true);
        });
    });
    describe("When LeftNavController Loaded and headerMenuChange  is called and doesn't have child", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            spyOn(controller, "resetLeftNavFocus").and.callThrough();
            $rootScope.isPinFlyout = true;
            $state.current.name = "DashBoard";
            var event = jasmine.createSpyObj("event", ["stopPropagation"]);
            event.stopPropagation = function () { console.log("Stop Propagation"); }
            controller.headerMenuChange(event, leftNavItems.data.internalLinks[0]);
            $timeout.flush(50);
        });

        it('Then $rootScope.isFlyoutOpen  should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
        it('Then $scope.selectedLeftNavItemId should be -1 ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(-1);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should have item id', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual("1");
        });
    });
    describe("When LeftNavController Loaded and onPinFlyoutClick  is called and event keyCode is enterKey and isPinFlyout is true", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            $rootScope.isPinFlyout = true;
            $state.current.name = "DashBoard";
            var event = { keyCode: 13 };
            controller.onPinFlyoutClick(event);
        });

        it('Then $rootScope.isLeftNavPinned  should have been set as true', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toBe(true);
        });
    });
    describe("When LeftNavController Loaded and onPinFlyoutClick is called and event keyCode is enterKey and isLeftNavPinned are true", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "saveLeftNavPinSetting").and.callThrough();
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            $rootScope.isLeftNavOpen = true;
            $rootScope.isLeftNavPinned = true;
            $state.current.name = "DashBoard";
            var event = { keyCode: 13 };
            controller.onPinFlyoutClick(event);
        });

        it('Then $rootScope.isLeftNavPinned  should have been set as true', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toBe(false);
        });
        it('Then $rootScope.isLeftNavPinned  should have been set as true', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
        it('Then saveLeftnavPinSettings to have been called', function () {
            expect(controller.saveLeftNavPinSetting).toHaveBeenCalled();
        });
        it('Then setFocusToHamburger to have been called', function () {
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
    });
    describe("When LeftNavController Loaded and onPinFlyoutClick  is called and event keyCode is enterKey and isLeftNavPinned is false", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setFocusToHamburger");
            spyOn(controller, "saveLeftNavPinSetting").and.callThrough();
            $rootScope.isLeftNavPinned = false;
            $state.current.name = "DashBoard";
            var event = { keyCode: 13 };
            controller.onPinFlyoutClick(event);
        });

        it('Then $rootScope.isLeftNavPinned  should have been set as true', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toBe(true);
        });
        it('Then saveLeftnavPinSettings to have been called', function () {
            expect(controller.saveLeftNavPinSetting).toHaveBeenCalled();
        });
        it('Then setFocusToHamburger should not call', function () {
            expect(controller.setFocusToHamburger).not.toHaveBeenCalled();
        });
    });
    describe("When LeftNavController Loaded and onPinFlyoutClick  is called and event keyCode is escapeKey and isPinFlyout is false", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            $rootScope.isLeftNavOpen = true;
            $state.current.name = "DashBoard";
            var event = { keyCode: 27 };
            controller.onPinFlyoutKeyDown(event);
        });

        it('Then $rootScope.isLeftNavOpen should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
        it('Then setFocusToHamburger to have been called', function () {
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
    });

    describe("When LeftNavController Loaded and onHamburgerClick  is called and event keyCode is escapeKey and isPinFlyout is false", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            $rootScope.isPinFlyout = false;
            $state.current.name = "DashBoard";
            var event = { keyCode: 27 };
            controller.collapseLeftNav(event);
        });

        it('Then $rootScope.isLeftNavOpen  should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
        it('Then setFocusToHamburger to have been called', function () {
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
    });
    describe("When LeftNavController Loaded and onHamburgerClick  is called and event keyCode is escapeKey and isPinFlyout is true", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setFocusToHamburger").and.callThrough();
            $rootScope.isPinFlyout = true;
            $state.current.name = "DashBoard";
            var event = { keyCode: 27 };
            controller.collapseLeftNav(event);
        });

        it('Then $rootScope.isLeftNavOpen  should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
        it('Then setFocusToHamburger to have been called', function () {
            expect(controller.setFocusToHamburger).toHaveBeenCalled();
        });
    });

    describe("When LeftNavController Loaded and onMenuItemClick  is called and isPinFlyout is true", () => {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $rootScope.isLeftNavPinned = false;
            $state.current.name = "DashBoard";
            var event = { keyCode: 27 };
            controller.onMenuItemClick(leftNavItems.data.internalLinks[0], leftNavItems.data.internalLinks[0]);
            $timeout.flush(50);
        });

        it('Then $rootScope.isLeftNavOpen should have been set as false', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavOpen).toBe(false);
        });
    });
    describe("When LeftNavController Loaded and getLeftNavHeight is called  ", () => {
        var controller, result, spy;
        beforeEach(function () {
            var element = jasmine.createSpyObj("element", ["height", "outerHeight", "bind", "unbind"]);
            element.height = function () { return 10; }
            element.outerHeight = function () { return 20; }
            spyOn(angular, "element").and.callFake(function (a) {
                return element;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $rootScope.isPinFlyout = true;
            $state.current.name = "DashBoard";
            controller.window.innerHeight = 60;
            result = controller.getLeftNavHeight();
        });

        it('Then getLeftNavHeight returns height', function () {
            expect(result).toEqual(20);
        });
    });
    describe("When LeftNavController Loaded and resizeLeftNavHeight is called ", () => {
        var controller, result, spy;
        beforeEach(function () {
            var element = jasmine.createSpyObj("element", ["height", "outerHeight", "bind", "unbind"]);
            element.height = function () { return 10; }
            element.outerHeight = function () { return 20; }
            spyOn(angular, "element").and.callFake(function (a) {
                return element;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            $scope.leftNavData = leftNavItems.data;
            controller.window.innerHeight = 100;
            controller.resizeLeftNavHeight();
        });

        it('Then $scope.visibleSettingLinksCount should return count', function () {
            expect($scope.visibleSettingLinksCount).toEqual(0);
        });
        it('Then $scope.isMoreButtonVisible should be true', function () {
            expect($scope.isMoreButtonVisible).toBe(true);
        });
        it('Then $scope.visibleInternalLinksCount should return count', function () {
            expect($scope.visibleInternalLinksCount).toEqual(1);
        });
        it('Then $scope.visibleExternalLinksCount should return count', function () {
            expect($scope.visibleExternalLinksCount).toEqual(1);
        });
    });
    describe("When LeftNavController Loaded and resetLeftNavFocus is called ", () => {
        var controller, result, spy;
        beforeEach(function () {
            var element = jasmine.createSpyObj("element", ["height", "outerHeight", "bind", "unbind", "attr"]);
            element.attr = function (a, b) { console.log(a + ' ' + b); }
            spyOn(angular, "element").and.callFake(function (a) {
                return element;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            controller.resetLeftNavFocus();
            $timeout.flush(1000);
        });

        it('Then angular.element to have been called', function () {
            expect(angular.element).toHaveBeenCalled();
        });
    });
    describe("When LeftNavController Loaded and setFocusToHamburger  is called ", () => {
        var controller, result, spy;
        beforeEach(function () {
            var element = jasmine.createSpyObj("element", ["height", "outerHeight", "bind", "unbind", "attr", "focus"]);
            element.attr = function (a, b) { console.log(a + ' ' + b); }
            spyOn(angular, "element").and.callFake(function (a) {
                return element;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            controller.setFocusToHamburger();
            $timeout.flush(50);
        });

        it('Then angular.element to have been called', function () {
            expect(angular.element).toHaveBeenCalled();
        });
    });

    describe("When onSuccessGetLeftNav method gets called with leftnavdata", () => {
        var controller, leftNavData, isGLNLoadSuccess;
        beforeEach(function () {
            leftNavData = {
                internalLinks: [{
                    "id": "2",
                    "businessProcessName": "Time Management",
                    "displayName": "Time sheet",
                    "iconCSS": "icon icon-time",
                    "tooltip": "Time management activities for managers",
                    "hasChildren": false,
                    "openInline": true,
                    "sortOrder": 2,
                    "applicableDevice": "All"
                }]
            };

            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
            });
            spyOn(controller, "getDeviceSpecificLeftNavItems").and.callThrough();
            spyOn(controller, "resizeLeftNavHeight");
            $serviceIntervalSpy = jasmine.createSpy('$timeout', controller.timeout).and.callThrough();
            controller.onSuccessGetLeftNav(leftNavData, "alias");
        })

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData);
        });

        it('Then $rootScope.GLNData should contain internal links', function () {
            expect($scope.leftNavData.internalLinks).toEqual(leftNavData.internalLinks);
        });

        it('Then isActingOnBehalfOf method of userInfoService should have been called', function () {
            expect(userInfoService.isActingOnBehalfOf).toHaveBeenCalled();
        });

        it('Then getDeviceSpecificLeftNavItems method should have been called', function () {
            expect(controller.getDeviceSpecificLeftNavItems).toHaveBeenCalled();
        });

        it('Then resizeLeftNavHeight method should have been called after 300 ms', function () {
            $serviceIntervalSpy.flush(300);
            expect(controller.resizeLeftNavHeight).toHaveBeenCalled();
        });
    });

    describe("When onSuccessGetLeftNav method gets called and lefnavdata having empty internal links", () => {
        var controller, leftNavData;
        beforeEach(function () {
            leftNavData = {
                internalLinks: []
            };

            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
            });

            controller.onSuccessGetLeftNav(leftNavData, "alias");

        })

        it('Then $scope.leftNavData should be defined', function () {
            expect($scope.leftNavData).toEqual(leftNavData);
        });

        it('Then $scope.leftNavDataExists should be equal to false', function () {
            expect($scope.leftNavDataExists).toEqual(false);
        });

        it('Then addMessage method of fxpMessageservice should have been called', function () {
            expect(fxpMessage.addMessage).toHaveBeenCalledWith("System Error has occurred. Please try again. If the problem persists, please contact IT support.", "error");
        });
    });

    describe("When getDeviceSpecificLeftNavItems method gets called in desktop view", () => {
        var controller, result;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                DeviceFactory: deviceFactory
            });
            result = controller.getDeviceSpecificLeftNavItems(leftNavItems.data);
        })

        it('Then it should return the leftnav items for the deskop view', function () {
            expect(result.internalLinks.length).toEqual(1);
        });
    });

    describe("When getDeviceSpecificLeftNavItems method gets called in mobile view", () => {
        var controller, result;
        beforeEach(function () {
            deviceFactory.isMobile = jasmine.createSpy("isMobile").and.callFake(function () {
                return true;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                DeviceFactory: deviceFactory
            });
            result = controller.getDeviceSpecificLeftNavItems(leftNavItems.data);
        })

        it('Then it should return the leftnav items for the mobile view', function () {
            expect(result.internalLinks.length).toEqual(0);
        });
    });

    describe("When resetToPersistedLeftNavPinSettings method gets called", function () {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                DeviceFactory: deviceFactory,
                SettingsService: settingsService,
                FxpContextService: fxpContextService
            });
            controller.$rootScope.isLeftNavPinned = false;
            controller.setLoggedInUserPreferences();
        });
        it('Then $rootScope.isLeftNavPinned should have been set to true', function () {
            expect(controller.$rootScope.isLeftNavPinned).toEqual(true);
        });
    });

    describe("When saveLeftnavPinSettings method gets called", function () {
        var controller;
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                DeviceFactory: deviceFactory,
                SettingsService: settingsService,
                FxpContextService: fxpContextService
            });
            controller.saveLeftNavPinSetting();
        });

        it('Then readContext method of fxpContextService should have been called', function () {
            expect(fxpContextService.readContext).toHaveBeenCalled();
        });
        it('Then saveSettings method of settingsService should have been called', function () {
            expect(settingsService.saveSettings).toHaveBeenCalled();
        });
    });
    describe("When saveLeftnavPinSettings method gets called and api throws exception", function () {
        var controller;
        beforeEach(function () {
            settingsService.saveSettings = jasmine.createSpy("saveSettings").and.callFake(function (a, b, c, d) {
                var defer = $q.defer();
                var error = {
                    status: 500,
                    statusText: "Internal Server Error",
                    data: "temp data"
                };
                defer.reject(error);
                return defer.promise;
            });
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
                DeviceFactory: deviceFactory,
                SettingsService: settingsService,
                FxpContextService: fxpContextService
            });
            controller.saveLeftNavPinSetting();
        });
        it('Then saveContext method of fxpContextService should not be called', function () {
            expect(fxpContextService.saveContext).not.toHaveBeenCalled();
        });
        it('Then logError method of fxpLoggerService should have been called', function () {
            $scope.$apply();
            expect(fxpLoggerService.logError).toHaveBeenCalled();
        });
    });

    describe("When highlightLeftNavItem method gets called by passing L0 LeftNav Item", () => {
        var controller;
        var item = {
            parentId: 2,
            id: 1,
            parentSequence: 1
        }
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setSelectedLeftNavIds").and.callThrough();
            controller.highlightLeftNavItem(item);
        })
        it('Then setSelectedLeftNavIds should have been called', function () {
            $scope.$apply();
            expect(controller.setSelectedLeftNavIds).toHaveBeenCalled();
        });

        it('Then $scope.selectedLeftNavItemId should be update ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(item.id);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should be update', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual(item.parentId);
        });
    });
    describe("When highlightLeftNavItem method gets called by passing L1 LeftNav Item", () => {
        var controller;
        var item = {
            parentId: null,
            id: 1,
            sequence: 1
        }
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "setSelectedLeftNavIds").and.callThrough();
            controller.highlightLeftNavItem(item);
        })
        it('Then setSelectedLeftNavIds should have been called', function () {
            $scope.$apply();
            expect(controller.setSelectedLeftNavIds).toHaveBeenCalledWith(item.id, -1, item.sequence);
        });

        it('Then $scope.selectedLeftNavItemId should be update ', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemId).toEqual(-1);
        });
        it('Then $scope.selectedLeftNavItemLinkId  should be update', function () {
            $scope.$apply();
            expect($scope.selectedLeftNavItemLinkId).toEqual(item.id);
        });
    });
    describe("When HighlightLeftNavByStateName is broadcasted", () => {
        var controller;
        var leftNavData = {
            internalLinks: [{
                "id": "2",
                "businessProcessName": "Manage Role Navigation",
                "targetUIStateName": "ManageRoleNavigation",
                "displayName": "Manage Role Navigation",
                "iconCSS": "icon icon-time",
                "tooltip": "",
                "hasChildren": false,
                "openInline": true,
                "sortOrder": 2,
                "applicableDevice": "All"
            }]
        };
        beforeEach(function () {
            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage
            });
            spyOn(controller, "highlightLeftNavItem");
            dashboardService.getGLNFlatDataStructure = jasmine.createSpy("getGLNFlatDataStructure").and.callFake(function (a) {
                var glnFlatData = [{
                    "id": "2",
                    "businessProcessName": "Manage Role Navigation",
                    "targetUIStateName": "ManageRoleNavigation",
                    "displayName": "Manage Role Navigation",
                    "iconCSS": "icon icon-time",
                    "tooltip": "",
                    "hasChildren": false,
                    "openInline": true,
                    "sortOrder": 2,
                    "applicableDevice": "All"
                }];
                return glnFlatData;
            });
            $scope.leftNavData.internalLinks = leftNavData.internalLinks;
            $scope.$broadcast("HighlightLeftNavByStateName", "ManageRoleNavigation");
        })
        it('Then highlightLeftNavItem should have been called', function () {
            $scope.$apply();
            expect(controller.highlightLeftNavItem).toHaveBeenCalledWith(leftNavData.internalLinks[0]);
        });
    });

    describe("When onSuccessGetLeftNav method gets called with leftnavdata consisting missing states", () => {
        var controller, leftNavData, isGLNLoadSuccess;
        beforeEach(function () {
            leftNavData = {
                internalLinks: [{
                    "id": "2",
                    "businessProcessName": "Time Management",
                    "displayName": "Time sheet",
                    "iconCSS": "icon icon-time",
                    "tooltip": "Time management activities for managers",
                    "hasChildren": false,
                    "openInline": true,
                    "sortOrder": 2,
                    "applicableDevice": "All",
                    "targetUIStateName": "stateWithMissingDependencies"
                }]
            };

            controller = $controller(LeftNavController, {
                $rootScope: $rootScope,
                $scope: $scope,
                $state: $state,
                DashboardService: dashboardService,
                AdminLandingService: adminLandingService,
                FxpLoggerService: fxpLoggerService,
                UserInfoService: userInfoService,
                FxpMessageService: fxpMessage,
            });
            Resiliency.statesWithMissingModules = ['stateWithMissingDependencies'];
            spyOn(controller, "checkLinksWithMissingModules").and.callThrough();
            controller.onSuccessGetLeftNav(leftNavData, "alias");
        })

        it('Then checkLinksWithMissingModules method should have been called', function () {
            $scope.$apply();
            expect(controller.checkLinksWithMissingModules).toHaveBeenCalled();
        });

        it('Then link with state, that is missing dependencies, should be marked as missing dependencies', function () {
            expect(leftNavData.internalLinks[0].dependenciesMissing).toEqual(true);
        });

    });


});