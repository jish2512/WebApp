/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />

//to run the test from this file please execute it via specRunner and click on each specs individually to see the result.
//At present tests are throwing error when run together
import {FxpBreadcrumbService} from '../js/services/FxpBreadcrumbService';
declare var angular:any;
describe("Given FxpBreadcrumbService UT Suite", () => {
    var $state, $rootScope, fxpStorageService, userInfoService, dashboardService, fxpBreadcrumbService, 
        fxpConfigurationService, window, routes, fxpLogger, fxpRouteService, fxpTelemetryContext, $timeout;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {        
        routes = [{
            AppHeader: "Dashboard",
            BreadcrumbText: "Dashboard",
            PageTitle: "FXP Dashboard",
            RouteConfig: "",
            StateName: "Dashboard",
            Style: "icon icon-people"
        }]
        var FXP =
            {
                Telemetry:
                {
                    Helper:
                    {
                        FxpLogHelper:
                        {
                            getTimeStamp: function () {
                                return new Date();
                            }
                        }
                    }
                }
            }
        angular.mock.module(function ($provide) {
            $provide.service("FxpStorageService", function () {
                this.saveInLocalStorage = jasmine.createSpy("saveInLocalStorage").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });
                this.getFromLocalStorage = jasmine.createSpy("getFromLocalStorage").and.callFake(function (a) {
                    return null;
                });
                this.deleteFromLocalStorage = jasmine.createSpy("deleteFromLocalStorage").and.callFake(function (a) {
                    console.log("deleteFromLocalStorage " + a);
                });
            });
            $provide.service("UserInfoService", function () {
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    return "testalias";
                });
                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return "v-jimazu";
                });
                this.getLoggedInUserUpn = jasmine.createSpy("getLoggedInUserUpn").and.callFake(function () {
                    return "v-jimazu@microsoft.com";
                });
                this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                    return true;
                });
                this.getCurrentUser = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    return "v-nagowd";
                });
                this.getCurrentUserUpn = jasmine.createSpy("getCurrentUser").and.callFake(function () {
                    return "v-nagowd@microsoft.com";
                });
            });
            $provide.service("FxpConfigurationService", function () {
                this.FxpBaseConfiguration = {
                    "NonGLNStateCollectionForBreadcrumb": ["profile"],                    
                    "FxpConfigurationStrings": {
                        "UIStrings": {
                            LandingPageRouteStateName: "dashboard"
                        }
                    }
                };
            });

            $provide.service("FxpTelemetryContext", function () {
                this.getGeography = jasmine.createSpy("getGeography").and.callFake(function () {
                    return "12.021.212";
                });
            });

            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    var propertybag = {addToBag:null};
                    propertybag.addToBag = function (a, b) {
                    }
                    return propertybag;
                });

                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });
            });

            $provide.service("DashboardService", function () {               
                this.getUserBasicInformation = jasmine.createSpy("getUserBasicInformation").and.callFake(function () {
                    var obj = {
                        UserUPN: "kane@microsoft.com",
                        BusinessRole: "5",
                        RoleGroupName: "FXP",
                        ScreenRoute: "personalization",
                        GeoLocation: "India",
                        OBOUserUPN: "kane@microsoft.com",
                        OBOUserBusinessRole: "5",
                        OBOUserRoleGroupName: "FXP"
                    };
                    return obj
                });
            });

            $provide.service("FxpRouteService", function () {
                this.getDefaultStateName = jasmine.createSpy("getDefaultStateName").and.callFake(function () {
                    return "Dashboard";
                });
            });
        });
    });
    beforeEach(angular.mock.inject(function (_$state_, _$rootScope_, FxpStorageService, UserInfoService, DashboardService, FxpConfigurationService,
     FxpLoggerService, FxpRouteService, FxpTelemetryContext, _FxpBreadcrumbService_, _$window_, _$timeout_) {
        $state = _$state_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        fxpStorageService = FxpStorageService;
        userInfoService = UserInfoService;
        dashboardService = DashboardService;
        fxpConfigurationService = FxpConfigurationService;
        fxpLogger = FxpLoggerService;
        fxpTelemetryContext = FxpTelemetryContext;
        fxpBreadcrumbService = _FxpBreadcrumbService_;
        window = _$window_;
        window.loggedInUserConfig = {
            Routes: routes
        };
        $state = {
            current: {
                name: "TimeApproval",
                params: { breadcrumb: "Time Approval" }
            }
        };

    }));

    describe("When setBreadcrumbFromRoute method gets called", () => {
        var item = {
            displayName: "Time Approval",
            href: "#/TimeApproval"
        };
        beforeEach(function () {
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };
            fxpBreadcrumbService.$state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "#/TimeApproval";
            });
            spyOn(fxpBreadcrumbService, 'setCurrentPageBreadcrumb');
            fxpBreadcrumbService.setBreadcrumbFromRoute(fxpBreadcrumbService.$state.current);
        });
        it("Then setCurrentPageBreadcrumb method should have been called", () => {
            expect(fxpBreadcrumbService.setCurrentPageBreadcrumb).toHaveBeenCalledWith(item);
        });
    });
    describe("When setBreadcrumbFromRoute method gets called and BreadcrumbText of current state is empty", () => {
        beforeEach(function () {
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumb: "" }
                }
            };
            fxpBreadcrumbService.$state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return "TimeApproval";
            });
            spyOn(fxpBreadcrumbService, 'setCurrentPageBreadcrumb');
            fxpBreadcrumbService.setBreadcrumbFromRoute(fxpBreadcrumbService.$state.current);
        });
        it("Then setCurrentPageBreadcrumb method should not have been called", () => {
            expect(fxpBreadcrumbService.setCurrentPageBreadcrumb).not.toHaveBeenCalled();
        });
    });
    describe("When setBreadcrumbFromRoute method gets called and $state.href is empty or undefined", () => {
        beforeEach(function () {
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumb: "TimeApproval" }
                }
            };
            fxpBreadcrumbService.$state.href = jasmine.createSpy("href").and.callFake(function (a) {
                return null;
            });
            spyOn(fxpBreadcrumbService, 'setCurrentPageBreadcrumb');
            fxpBreadcrumbService.setBreadcrumbFromRoute(fxpBreadcrumbService.$state.current);
        });
        it("Then setCurrentPageBreadcrumb method should not have been called", () => {
            expect(fxpBreadcrumbService.setCurrentPageBreadcrumb).not.toHaveBeenCalled();
        });
    });
    describe("When calling setCurrentPageBreadcrumb method", () => {
        var breadcrumbItem = { "displayName": "TimeApproval", "href": "#/Home" };
        beforeEach(function () {
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };            
            spyOn(fxpBreadcrumbService, 'setBreadcrumb');
            spyOn(fxpBreadcrumbService, 'startNewBreadcrumbOnSpecificState');
            fxpBreadcrumbService.setCurrentPageBreadcrumb(breadcrumbItem);
        });        
        it("Then startNewBreadcrumbOnSpecificState method should have been called", () => {
            expect(fxpBreadcrumbService.startNewBreadcrumbOnSpecificState).toHaveBeenCalledWith("TimeApproval");
        });        
        it("Then setBreadcrumb method should have been called", () => {
            expect(fxpBreadcrumbService.setBreadcrumb).toHaveBeenCalledWith(breadcrumbItem);
        });
    });
    describe("When setCurrentPageBreadcrumb method called when leftnavitem is clicked", () => {
        var breadcrumbItem = { "displayName": "TimeApproval", "href": "#/Home" };        
        beforeEach(function () {            
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };            
            spyOn(fxpBreadcrumbService, 'setBreadcrumb');
            fxpBreadcrumbService.isLeftNavItemClicked = true;
            fxpBreadcrumbService.setCurrentPageBreadcrumb(breadcrumbItem);
        });       
        it("Then breadcrumb array should be reset", () => {
            expect(fxpBreadcrumbService.$rootScope.fxpBreadcrumb).toEqual([]);
        });
        it("Then fxpBreadcrumbService.isLeftNavItemClicked should be reset to false", () => {
            expect(fxpBreadcrumbService.isLeftNavItemClicked).toEqual(false);
        });
        it("Then setBreadcrumb method should have been called", () => {
            expect(fxpBreadcrumbService.setBreadcrumb).toHaveBeenCalledWith(breadcrumbItem);
        });
    });
    describe("When setBreadcrumbItem method gets called", () => {
        var breadcrumbItem = { "displayName": "Dashboard", "href": "#/Home" };
        beforeEach(function () {
            spyOn(fxpBreadcrumbService, 'setBreadcrumb');
            fxpBreadcrumbService.setBreadcrumbItem(breadcrumbItem);
        });
        it("Then setBreadcrumb method should have been called", () => {
            expect(fxpBreadcrumbService.setBreadcrumb).toHaveBeenCalledWith(breadcrumbItem);
        });
    });
    describe("When setBreadcrumb method gets called", () => {
        var breadcrumbItem = { "displayName": "Dashboard", "href": "#/Home" };
        var storageKey = "v-nagowd-breadcrumb";
        beforeEach(function () {
            spyOn(fxpBreadcrumbService, "getExpectedBreadcrumbForCurrentState");
            fxpBreadcrumbService.setBreadcrumb(breadcrumbItem);
        });
        it("Then getExpectedBreadcrumbForCurrentState method should have been called", () => {
            expect(fxpBreadcrumbService.getExpectedBreadcrumbForCurrentState).toHaveBeenCalled();
        });
        it("Then getCurrentUser method of UserInfoService should have been called", () => {
            expect(userInfoService.getCurrentUser).toHaveBeenCalled();
        });
        it("Then getFromLocalStorage method of FxpStorageService should have been called", () => {
            expect(fxpStorageService.getFromLocalStorage).toHaveBeenCalledWith(storageKey);
        });
        it("Then saveInLocalStorage method of FxpStorageService should have been called", () => {
            expect(fxpStorageService.saveInLocalStorage).toHaveBeenCalled();
        });
        it("Then it should update $rootScope.fxpBreadcrumb value", () => {
            expect($rootScope.fxpBreadcrumb).toEqual([breadcrumbItem]);
        });
    });
    describe("When setBreadcrumb method gets called if $rootScope.fxpBreadcrumb having current state breadcrumb array", () => {
        var breadcrumbItem = { "displayName": "Time Approval", "href": "#/TimeApproval" };
        var storageKey = "v-nagowd-breadcrumb";
        var breadcrumbItemList;
        beforeEach(function () {
            spyOn(fxpBreadcrumbService, "getExpectedBreadcrumbForCurrentState").and.callThrough();
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };
            breadcrumbItemList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "Time Approval", "href": "#/TimeApproval" }];
            fxpStorageService.getFromLocalStorage = jasmine.createSpy("getFromLocalStorage").and.callFake(function (a) {
                if (a != "272438972")
                    return { "43474556": breadcrumbItemList };
                else
                    return null;
            });
            $rootScope.fxpBreadcrumb = breadcrumbItemList;
            fxpBreadcrumbService.setBreadcrumb(breadcrumbItem);
        });
        it("Then $rootScope.fxpBreadcrumb value should be updated from localstorage ", () => {
            expect($rootScope.fxpBreadcrumb).toEqual(breadcrumbItemList);
        });
    });

    describe("When setBreadcrumb method gets called if $rootScope.fxpBreadcrumb having current state breadcrumb array and current state is navigated through different state", () => {
        var breadcrumbItem = { "displayName": "Time Approval", "href": "#/TimeApproval" };
        var storageKey = "v-nagowd-breadcrumb";
        var breadcrumbItemList;
        beforeEach(function () {
            spyOn(fxpBreadcrumbService, "getExpectedBreadcrumbForCurrentState").and.callThrough();
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };
            breadcrumbItemList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "Time Approval", "href": "#/TimeApproval" }];
            fxpStorageService.getFromLocalStorage = jasmine.createSpy("getFromLocalStorage").and.callFake(function (a) {
                if (a != "272438972")
                    return { "43474556": breadcrumbItemList };
                else
                    return null;
            });
            $rootScope.fxpBreadcrumb = [{ "displayName": "Time Entry", "href": "#/TimeEntry" }];
            fxpBreadcrumbService.setBreadcrumb(breadcrumbItem);
        });
        it("Then $rootScope.fxpBreadcrumb value should not be updated from localstorage ", () => {
            expect($rootScope.fxpBreadcrumb).not.toEqual(breadcrumbItemList);
        });
    });

    describe("When calling setBreadcrumb method and curent state breadcrumb already exist in storage", () => {
        var storageKey = "v-nagowd-breadcrumb";
        var breadcrumbItem = { "displayName": "Dashboard", "href": "#/Home" };
        var breadcrumbItemList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "Time Approval", "href": "#/TimeApproval" }];
        var breadcrumb = { "1701947049": [breadcrumbItem] };
        localStorage[storageKey] = breadcrumb;

        beforeEach(function () {
            fxpStorageService.getFromLocalStorage = jasmine.createSpy("getFromLocalStorage").and.callFake(function (a) {
                if (a != "1047680875")
                    return { "-539571969": breadcrumbItemList };
                else
                    return null;
            });
            fxpBreadcrumbService.setBreadcrumb(breadcrumbItem, "dashboard");
        });
        it("Then it should call getFromLocalStorage method of FxpStorageService", () => {
            expect(fxpStorageService.getFromLocalStorage).toHaveBeenCalledWith(storageKey);
        });
        it("Then it should update  Breadcrumb  value", () => {
            expect(fxpBreadcrumbService.$rootScope.fxpBreadcrumb).toEqual(breadcrumbItemList);
        });
        it("Then it should not call  saveInLocalStorage method", () => {
            expect(fxpStorageService.saveInLocalStorage).not.toHaveBeenCalled();
        });
    });
    describe("When updateBreadcrumb method gets called with breadcrumbItem which is existed in breadcrumList ", () => {
        var result;
        beforeEach(function () {
            var breadcrumbItem = { "displayName": "Dashboard", "href": "#/Home" };
            var breadcrumbList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "TimeApproval", "href": "#/TimeApproval" }];
            result = fxpBreadcrumbService.updateBreadcrumb(breadcrumbList, breadcrumbItem);
        });
        it("Then it should return spliced breadcrumb array ", () => {
            expect(result.length).toEqual(1);
        });
    });
    describe("When updateBreadcrumb method gets called with breadcrumbItem which is not existed in breadcrumList ", () => {
        var result;
        beforeEach(function () {
            var breadcrumbItem = { "displayName": "TimeEntry", "href": "#/TimeEntry" };
            var breadcrumbList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "TimeApproval", "href": "#/TimeApproval" }];
            result = fxpBreadcrumbService.updateBreadcrumb(breadcrumbList, breadcrumbItem);
        });
        it("Then it should return expectedBreadcrumb which will contain new breadcrumbItem", () => {
            expect(result.length).toEqual(3);
        });
    });
    describe("When getExpectedBreadcrumbForCurrentState method gets called", () => {
        var breadcrumbItem, breadcrumbList;
        beforeEach(function () {
            breadcrumbItem = { "displayName": "Dashboard", "href": "#/Home" };
            breadcrumbList = [{ "displayName": "Dashboard", "href": "#/Home" }];
            spyOn(fxpBreadcrumbService, "updateBreadcrumb").and.callThrough();
            fxpBreadcrumbService.getExpectedBreadcrumbForCurrentState(breadcrumbList, breadcrumbItem);
        });
        it("Then updateBreadcrumb method should have been called", () => {
            expect(fxpBreadcrumbService.updateBreadcrumb).toHaveBeenCalledWith(breadcrumbList, breadcrumbItem);
        });
    });
    describe("When startNewBreadcrumbOnSpecificState method gets called", () => {
        beforeEach(function () {
            $rootScope.fxpBreadcrumb = [{ "displayName": "Dashboard", "href": "#/Home" }];
            fxpBreadcrumbService.startNewBreadcrumbOnSpecificState("dashboard");
        });
        it("Then it should not reset $rootScope.fxpBreadcrumb value", () => {
            expect($rootScope.fxpBreadcrumb.length).toEqual(1);
        });
    });
    describe("When startNewBreadcrumbOnSpecificState method gets called and curent state is not part of GLN", () => {
        beforeEach(function () {
            fxpBreadcrumbService.$rootScope.fxpBreadcrumb = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "TimeAproval", "href": "#/TimeAproval" }];
            fxpBreadcrumbService.startNewBreadcrumbOnSpecificState("profile");
        });
        it("Then it should reset fxpBreadcrumb with empty array", () => {
            expect(fxpBreadcrumbService.$rootScope.fxpBreadcrumb.length).toEqual(0);
        });
    });         
    describe("When calling logBreadcrumbInformation log the current user basic info and breadcrumb event type as BreadcrumbLoad", () => {
        beforeEach(function () {
            fxpBreadcrumbService.$rootScope.fxpBreadcrumb = [{ "displayName": "TimeAproval", "href": "#/TimeAproval" }];
            fxpBreadcrumbService.$rootScope.sessionId = "13213213qw";
            sessionStorage["v-jimazu-userInfo"] = "{\"FirstName\": \"Jishnu\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Ronald, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-jimazu\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\",\"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            sessionStorage["v-nagowd-userInfo"] = "{\"FirstName\": \"Naresh\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Naresh, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-naresh\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\",\"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            fxpBreadcrumbService.logBreadcrumbTelemetryInfo("BreadcrumbLoad",null);
        });
        it("Then it should call the logInformation from fxpLogger", () => {
            expect(fxpLogger.logInformation).toHaveBeenCalled()
        });
    });
    describe("When calling logBreadcrumbInformation log the current user basic info and breadcrumb event type as BreadcrumbClick", () => {
        beforeEach(function () {
            fxpBreadcrumbService.$rootScope.fxpBreadcrumb = [{ "displayName": "Personalize User Navigation > Personalize Left Navigation > ", "href": "#/leftnavpersonalization" }];
            fxpBreadcrumbService.$rootScope.sessionId = "13213213qw";
            sessionStorage["v-jimazu-userInfo"] = "{\"FirstName\": \"Jishnu\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Ronald, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-jimazu\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\",\"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            sessionStorage["v-nagowd-userInfo"] = "{\"FirstName\": \"Naresh\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Naresh, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-naresh\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\",\"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            var breadcrumbItem = { "displayName": "Personalize User Navigation", "href": "#/leftnavpersonalization"}
            fxpBreadcrumbService.logBreadcrumbTelemetryInfo("BreadcrumbClick", breadcrumbItem);
        });
        it("Then it should call the logInformation from fxpLogger", () => {
            expect(fxpLogger.logInformation).toHaveBeenCalled()
        });
    });
    describe("When setBreadcrumb method gets called if previous tab breadcrumb array is stored in localStorage ", () => {
        var breadcrumbItem = { "displayName": "Time Approval", "href": "#/TimeApproval" };
        var storageKey = "testalias-breadcrumb";
        var breadcrumbItemList;
        beforeEach(function () {
            spyOn(fxpBreadcrumbService, "getExpectedBreadcrumbForCurrentState").and.callThrough();
            fxpBreadcrumbService.$state = {
                current: {
                    name: "TimeApproval",
                    data: { breadcrumbText: "Time Approval" }
                }
            };
            breadcrumbItemList = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "Time Approval", "href": "#/TimeApproval" }];
            fxpStorageService.getFromLocalStorage = jasmine.createSpy("getFromLocalStorage").and.callFake(function (a) {
                return breadcrumbItemList;
            });
            fxpBreadcrumbService.setBreadcrumb(breadcrumbItem);
        });
        it("Then deleteFromLocalStorage method of fxpStorageService have been called", () => {
            expect(fxpStorageService.deleteFromLocalStorage).toHaveBeenCalled();
        });
    });
    describe("When setTempBreadcrumbArray method gets called", () => {
        beforeEach(function () {
            fxpBreadcrumbService.setTempBreadcrumbArray("#/PageC");
        });
        it("Then saveInLocalStorage method of fxpStorageService should have been called", () => {
            expect(fxpStorageService.saveInLocalStorage).toHaveBeenCalled();
        });
    });    
    describe("When overrideBreadcrumbText  method gets called", () => {        
        beforeEach(function () {            
            spyOn(fxpBreadcrumbService,"updateDisplayNameForCurrentBreadcrumbItem").and.callThrough();
            fxpBreadcrumbService.overrideBreadcrumbText("xyz");            
        });
        it("Then updateDisplayNameForCurrentBreadcrumbItem method should have been called", () => {           
            expect(fxpBreadcrumbService.updateDisplayNameForCurrentBreadcrumbItem).toHaveBeenCalledWith("xyz");
        });
    });   
    describe("When updateDisplayNameForCurrentBreadcrumbItem  method gets called ", () => {       
        beforeEach(function () {        
            $rootScope.fxpBreadcrumb = [{displayName:"xyz",href:"#/xyz"},{displayName:"abc",href:"#/abc"}]
            fxpBreadcrumbService.updateDisplayNameForCurrentBreadcrumbItem("abc123");         
        });
        it("Then current state/url breadcrumb displayName should be overided with abc123", () => {           
            expect($rootScope.fxpBreadcrumb[1].displayName).toEqual("abc123");
        });
    });
    describe("When getBreadcrumbItemIndex method gets called if breadcrumbItem is not found", () => {       
        var breadcrumbItemIndex;
        beforeEach(function () {        
            $rootScope.fxpBreadcrumb = [{displayName:"xyz",href:"#/xyz"}, {displayName:"abc",href:"#/abc"}];
            breadcrumbItemIndex = fxpBreadcrumbService.getBreadcrumbItemIndex($rootScope.fxpBreadcrumb, "pqr");
        });
        it("Then it should return the breadcrumbItemIndex as -1", () => {           
            expect(breadcrumbItemIndex).toEqual(-1);
        });
    });
    describe("When getBreadcrumbItemIndex method gets called by passing required parameters", () => {
        var breadcrumbItemIndex;
        beforeEach(function () {        
            $rootScope.fxpBreadcrumb = [{displayName:"xyz",href:"#/xyz"}, {displayName:"abc",href:"#/abc"}];
            breadcrumbItemIndex = fxpBreadcrumbService.getBreadcrumbItemIndex($rootScope.fxpBreadcrumb, "abc");
        });
        it("Then it should return the breadcrumbItemIndex", () => {           
            expect(breadcrumbItemIndex).toEqual(1);
        });
    });
    describe("When updateBreadcrumbUrlByName method gets called by passing required parameters", () => {
        beforeEach(function () {        
            $rootScope.fxpBreadcrumb = [{displayName:"xyz",href:"#/xyz"}, {displayName:"abc",href:"#/abc"}];
            fxpBreadcrumbService.updateBreadcrumbUrlByName("abc", "#/abc123");
        });
        it("Then $rootScope.fxpBreadcrumb should be updated with new href of existed breadcrumbItem", () => {           
            expect($rootScope.fxpBreadcrumb[1].href).toEqual("#/abc123");
        });
    });
    describe("When updateBreadcrumbUrlByName method gets called more than one time", () => {
        beforeEach(function () {
            $rootScope.fxpBreadcrumb = [{ displayName: "xyz", href: "#/xyz" }, { displayName: "abc", href: "#/abc" }];
            fxpBreadcrumbService.updateBreadcrumbUrlByName("xyz", "#/xyz123");
            fxpBreadcrumbService.updateBreadcrumbUrlByName("abc", "#/abc123" );
        });
        it("Then $rootScope.fxpBreadcrumb should be updated with new href of existed breadcrumbItems", () => {
            expect($rootScope.fxpBreadcrumb[0].href).toEqual("#/xyz123");
            expect($rootScope.fxpBreadcrumb[1].href).toEqual("#/abc123");
        });
    });
    describe("When updateBreadcrumbUrlByName method gets called with breadcrumbName which is not existed in current fxpBreadcrumb and newUrl", () => {
        beforeEach(function () {
            $rootScope.fxpBreadcrumb = [{ displayName: "xyz", href: "#/xyz" }, { displayName: "abc", href: "#/abc" }];
            fxpBreadcrumbService.updateBreadcrumbUrlByName("mno", "#/mn0123");
        });
        it("Then $rootScope.fxpBreadcrumb should not be updated", () => {
            expect($rootScope.fxpBreadcrumb.length).toEqual(2);
            expect($rootScope.fxpBreadcrumb[0].href).toEqual("#/xyz");
            expect($rootScope.fxpBreadcrumb[1].href).toEqual("#/abc");
        });
    });
});