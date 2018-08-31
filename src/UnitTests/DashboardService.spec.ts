import{DashboardService}from '../js/services/dashboardService';
declare var angular:any;
describe("Given DashboardService UT Suite", () => {
    var $httpBackend, $q, $rootScope, state, timeout, fxpConfigurationService, fxploggerService, adalLoginHelperService, fxpMessageService, dashboardService, userInfoService, pageLoaderService, fxpTelemetryContext, fxpUIConstants, $timeoutSpy, $serviceIntervalSpy, propbagValue, $interval, userProfileService;
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
            $provide.service("FxpConfigurationService", function () {
                var config = {
                    "fxpServiceEndPoint": "https://fxpservicesapidev.azurewebsites.net/api/v1"
                }
                this.FxpAppSettings = config;
            });
            $provide.service("$state", function () {
                this.go = jasmine.createSpy("go").and.callFake(function (key, value) {
                    console.log(key);
                });
                this.get = jasmine.createSpy("go").and.callFake(function () {
                    return [];
                });
                this.current = { name: "personalization" };
            });
            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    return propBag();
                });
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log('logInformation : ' + a + ',' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d);
                    propbagValue = e;
                });

                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a) {
                    console.log('startTrackPerformance : ' + a);
                });

                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a) {
                    console.log('stopTrackPerformance : ' + a);
                });
            });

            $provide.service("AdalLoginHelperService", function () {
                this.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.returnValue(false);
            });
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log(a + '' + b);
                });
            });
            $provide.service("UserInfoService", function () {
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    console.log('getCurrentUser: ');
                    return "alias";
                });
                this.getLoggedInUserUpn = jasmine.createSpy("getLoggedInUserUpn").and.callFake(function () {
                    console.log('getLoggedInUserUpn: ');
                    return "thomas@microsft.com";
                });
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return "kane";
                });
                this.isActingOnBehalfOf = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return true;
                });
                this.getCurrentUserData = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return { "businessRole": "5", "roleGroupName": "FXP" };
                });
                this.getCurrentUserUpn = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return "kane@microsoft.com";
                });
            });
            $provide.service("PageLoaderService", function () {
                this.fnHidePageLoader = jasmine.createSpy("fnHidePageLoader").and.callFake(function () {
                    console.log('fnHidePageLoader called');
                });
            });
            $provide.service("FxpTelemetryContext", function () {
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "India";
                });
            });

            $provide.service("UserProfileService", function () {
                this.getBasicProfileByAlias = jasmine.createSpy("getBasicProfileByAlias").and.callFake(function (a, b) {
                    return {
                        then: function (callback) {
                            return callback({
                                businessRole: "5",
                                roleGroupName: "FXP"
                            });
                        }
                    }
                });
            });
            fxpUIConstants = {
                "UIMessages": {
                    GetLeftNavAuthFailureError: {
                        ErrorMessage: "Unable to Fetch Global LeftNav data",
                        ErrorMessageTitle: "Error occured while retrieving JWT Token for leftnav data"
                    },
                    UserRoleGroupFxpConfigNotFoundError: {
                        ErrorMessage: "Your profile is not mapped to a Dashboard. Please contact IT support.",
                        ErrorMessageTitle: "Error in HomeController from dashboard to fetch UIConfigurationByRoleGroupId"
                    }
                }
            };
        });
    });
    beforeEach(angular.mock.inject(function (_$httpBackend_, _$q_, _$rootScope_, $state, FxpConfigurationService, _$timeout_, FxpLoggerService, AdalLoginHelperService, FxpMessageService, UserInfoService, PageLoaderService, FxpTelemetryContext, UserProfileService, _$interval_, _DashboardService_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        state = $state;
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpConfigurationService = FxpConfigurationService;
        timeout = _$timeout_;
        fxploggerService = FxpLoggerService;
        adalLoginHelperService = AdalLoginHelperService;
        fxpMessageService = FxpMessageService;
        userInfoService = UserInfoService;
        pageLoaderService = PageLoaderService;
        fxpTelemetryContext = FxpTelemetryContext;
        userProfileService = UserProfileService;
        dashboardService = _DashboardService_;
        $interval = _$interval_;
        $timeoutSpy = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
        $serviceIntervalSpy = jasmine.createSpy('$timeout', dashboardService.timeout).and.callThrough();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000
    }));
    describe("When getLeftNavData method gets called by passing userId, rollGroupId", () => {
        var result;
        var userId = "alias";
        var roleGroupId = 1;
        var userRoleId = 5;
        var leftNavData = {
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
                    "hasChildren": false
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
                        "targetURL": "https://aka.ms/itweb",
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
        };
        beforeEach(function () {
            var fxpServiceEndPoint = fxpConfigurationService.FxpAppSettings.fxpServiceEndPoint;
            var url = fxpServiceEndPoint + "/user/" + userId + "/LeftNav?roleGroupId=" + roleGroupId + "&userRoleId=" + userRoleId;
            $httpBackend.expectGET(url)
                .respond(200, leftNavData);
            dashboardService.fxpServiceEndPoint = fxpServiceEndPoint;
            dashboardService.getLeftNavData(userId, 1, 5).then(function (response) {
                result = response;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });

        it("Then it should return left Nav Data", () => {
            expect(result.data).toEqual(leftNavData);
        });
        it("Then startTrackPerformance of fxploggerService should have been called ", () => {
            expect(fxploggerService.startTrackPerformance).toHaveBeenCalledWith("GetLeftNavData");
        });
        it("Then logInformation of fxploggerService should have been called ", () => {
            expect(fxploggerService.logInformation).toHaveBeenCalledWith('Fxp.DashboardService', 'getLeftNavData');
        });
    });

    describe("When getLeftNavData of dashboardService gets called and adalrequest count reaches 5", () => {
        beforeEach(function () {
            dashboardService.adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.returnValue(true);
            dashboardService.iReqCount = 4;
            dashboardService.getLeftNavData("userAlias", "1", "5");
            $serviceIntervalSpy.flush(1000);
        });
        it("Then startTrackPerformance of fxploggerService should have been called ", () => {
            expect(fxploggerService.startTrackPerformance).toHaveBeenCalledWith("GetLeftNavData");
        });
        it("Then stopTrackPerformance of fxploggerService should have been called ", () => {
            expect(fxploggerService.stopTrackPerformance).toHaveBeenCalledWith("GetLeftNavData");
        });
        it("Then logError of fxploggerService should have been called ", () => {
            expect(fxploggerService.logError).toHaveBeenCalledWith("Fxp.DashboardService", "Error occured while retrieving JWT Token for leftnav data", "2603", null);
        });
        it("Then addMessage of fxploggerService should have been called ", () => {
            expect(fxpMessageService.addMessage).toHaveBeenCalledWith("Unable to Fetch Global LeftNav data", "error");
        });
    });

    describe("When fxpConfigurationFailed of dashboardService gets called", () => {
        beforeEach(function () {
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":"1","roleGroupName":"Resource"}';
            dashboardService.fxpConfigurationFailed();
        })
        it("Then logError of fxploggerService should have been called ", () => {
            expect(fxploggerService.logError).toHaveBeenCalledWith('Fxp.DashboardService', 'Error in HomeController from dashboard to fetch UIConfigurationByRoleGroupId', '', '', propbagValue);
        });
        it("Then addMessage of fxpMessageService should have been called ", () => {
            expect(fxpMessageService.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', 'error');
        });
        it("Then fnHidePageLoader of pageLoaderService should have been called ", () => {
            expect(pageLoaderService.fnHidePageLoader).toHaveBeenCalled();
        });
    })

    describe("When updateRoleGroupInUserInfoSession of dashboardService gets called", () => {
        beforeEach(function () {
            sessionStorage['alias-userInfo'] = '{"alias":"v- sabyra","firstName":"Sandeepkumar","middleName":null,"lastName":"Byragoni","displayName":"Sandeepkumar Byragoni","preferredFirstName":null,"reportsTo":"vemami","reportsToDisplayName":"Veera Mamilla","businessDomain":null,"reportsToFullName":"Mamilla, Veera Reddy","businessRoleId":59,"seniority":null,"businessRole":"Non Services User","standardTitle":"XR - MSR IT Operations","email":"v- sabyra@microsoft.com","fullName":"Sandeepkumar Byragoni","businessRoleDisplayName":"Non Services User","roleGroupId":"1","roleGroupName":"Resource"}';
            var roleGroup = {
                Id: 2,
                Name: "Delivery Resource"
            }
            dashboardService.updateRoleGroupInUserInfoSession(roleGroup);
        })
        it("Then roleGroupId in sessionStorge of currenUser should be updated", () => {
            var userInfo = JSON.parse(sessionStorage["alias-userInfo"]);
            expect(userInfo.roleGroupId).toEqual(2);
        });
        it("Then roleGroupName in sessionStorge of currenUser should be updated", () => {
            var userInfo = JSON.parse(sessionStorage["alias-userInfo"]);
            expect(userInfo.roleGroupName).toEqual("Delivery Resource");
        });
    })

    describe("When getGLNFlatDataStructure method gets called", () => {
        var result;
        beforeEach(function () {
            var leftnavData = [{
                "id": "100",
                "businessProcessName": "FXP Dashboard",
                "displayName": "Dashboard",
                "iconCSS": "icon icon-people",
                "tooltip": "Takes you to the dashboard defined for your persona",
                "targetUIStateName": "DashBoard",
                "openInline": true,
                "sortOrder": 1,
                "hasChildren": false
            }, {
                    "id": "103",
                    "businessProcessName": "Administration",
                    "displayName": "Administration",
                    "iconCSS": "icon icon-people",
                    "tooltip": "Administration",
                    "sortOrder": 3,
                    "hasChildren": true,
                    "children": [{
                        "id": "110",
                        "displayName": "Act On Behalf of",
                        "iconCSS": "icon icon-people",
                        "tooltip": "Takes you to the Act On Behalf page",
                        "targetUIStateName": "ActOnBehalf",
                        "openInline": true,
                        "sortOrder": 1,
                        "hasChildren": false
                    }, {
                            "id": "111",
                            "displayName": "UserLookupPersonalization",
                            "iconCSS": "icon icon-people",
                            "tooltip": "Takes you to the userlookup page",
                            "targetUIStateName": "UserLookupPersonalization",
                            "openInline": true,
                            "sortOrder": 2,
                            "hasChildren": false
                        }]
                }]

            result = dashboardService.getGLNFlatDataStructure(leftnavData);
        })
        it("Then it should return flat data array which will contain 3 objects", () => {
            expect(result.length).toEqual(3);
        });
    })   
});
