/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />

//to run the test from this file please execute it via specRunner and click on each specs individually to see the result.
//At present tests are throwing error when run together

describe("Given UserProfileService UT Suite", () => {
    var userInfoService;
    var userProfileService;
    var adalLoginHelperService;
    var fxpLogger;
    var fxpMessage;
    var fxpConstants;
    var upn = "v-ronald@microsoft.com";
    var userAlias = "v-ronald";
    var $httpBackend;
    var $q;
    var $timeout
    var $rootScope;
    var fxpContextService;
    var fxpConfigurationService;
    var fxpTelemetryContext;
    var $log;
    var fxpUIConstants;
    var propBagValue;
    var $serviceIntervalSpy;
    var $timeoutSpy;

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
            $provide.service("AdalLoginHelperService", function () {
                this.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.returnValue(false);
                this.acquireToken = jasmine.createSpy("acquireToken").and.callFake(function (a, callback) {
                    callback(a);
                });
                this.getCachedToken = jasmine.createSpy("getCachedToken").and.returnValue("saff214454fds54545");
            });
            $provide.service("FxpContextService", function () {
                var self = this;
                self.data = [];
                var claims = "{ \"FirstName\": \"Ronald\", \"LastName\": \"Jay\", \"Alias\": \"v-ronald@microsoft.com\", \"Applications\":[ { \"fieldexprience\": { \"ApplicationName\": \"fieldexprience\", \"Roles\": { \"AppRole1\": { \"RoleName\": null, \"Permissions\": [] }, \"FxpAppRole1\": { \"RoleName\": null, \"Permissions\": [] } } } } ]}";
                self.data["v-ronald-userInfo"] = claims;
                this.saveContext = jasmine.createSpy("saveContext").and.callFake(function (key, value) {
                    self.data[key] = value; $log.log(key + ":" + value);
                });
                this.readContext = jasmine.createSpy("readContext").and.callFake(function (key) {
                    var defer = $q.defer();
                    var res = {};
                    if (self.data[key] == undefined)
                        res.IsError = true;
                    else {
                        res.Result = self.data[key];
                        res.IsError = false;
                    }
                    console.log(res);
                    defer.resolve(res);
                    return defer.promise;
                });
            });
            $provide.service("FxpLoggerService", function () {
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log(a + ':' + b);
                });
                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    propBagValue = e;
                    console.log(a + ':' + b);
                });
                this.logMetric = jasmine.createSpy("logMetric").and.callFake(function (a, b, c, d) {
                    $log.log(a + ' - ' + b + ' - ' + c + ' - ' + d);
                });
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function (a, b) {
                    $log.log(a + ' - ' + b); return new propBag();
                });
                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a, b) {
                    $log.log(a + ' - ' + b);
                });
                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a, b) {
                    $log.log(a + ' - ' + b);
                });

            });
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    $log.log(a + '' + b);
                });
            });
            $provide.service("FxpConfigurationService", function () {
                var config = {
                    "OpsProfileEndPoint": "https://oneprofilesitapipack.trafficmanager.net/api/v1",
                    "OpsClaimsEndPoint": "https://oneprofilesitclaims.trafficmanager.net/api/v1"
                }
                this.FxpAppSettings = config;
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
            });
            fxpUIConstants = {
                "UIMessages": {
                    AuthzServiceReturnsError: {
                        ErrorMessage: "Authorization failed. Please contact IT Support.",
                        ErrorMessageTitle: ""
                    },
                    AADAuthFailureError: {
                        ErrorMessage: "System Error has occurred. Please try again. If the problem persists, please contact IT support.",
                        ErrorMessageTitle: "Error occured while retrieving JWT Token"
                    },
                    AuthServiceReturnsBlankAppRoleError: {
                        ErrorMessage: "Your profile does not have permissions to access this content. Please contact IT support.",
                        ErrorMessageTitle: "Error in getUserClaims from service which returns Blank App Roles"
                    },
                    AuthServiceReturnsBlankAppError: {
                        ErrorMessage: "Your profile does not have permissions to access this content. Please contact IT support.",
                        ErrorMessageTitle: "Error in getUserClaims from service which Returns Error"
                    },
                    UserProfileBusinessRoleMissingError: {
                        ErrorMessageTitle: 'Your profile is not mapped to a Dashboard. Please contact IT support.',
                        ErrorMessage: 'Your profile is not mapped to a Dashboard. Please contact IT support.'
                    },
                    ProfileServiceCallFailedError: {
                        ErrorMessage: "System Error has occurred: Unable to retrieve your  profile information. Please try again",
                        ErrorMessageTitle: "Error in getBasicProfile from service"
                    },
                    UserProfileRoleGroupMissingError: {
                        ErrorMessage: "Your professional services profile is not assigned to any rolegroup. Please contact IT support.",
                        ErrorMessageTitle: "Error in getBasicProfileSvc from service RoleGroup is missing"
                    }
                }
            };

        });
    });

    beforeEach(inject(function (_$httpBackend_, _$q_, _$timeout_, _$rootScope_, _$log_, FxpLoggerService, AdalLoginHelperService, FxpMessageService, FxpContextService, FxpConfigurationService, FxpTelemetryContext, UserInfoService, _UserProfileService_) {
        $httpBackend = _$httpBackend_;
        userProfileService = _UserProfileService_;
        $q = _$q_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        $log = _$log_;
        fxpLogger = FxpLoggerService;
        fxpMessage = FxpMessageService;
        adalLoginHelperService = AdalLoginHelperService;
        fxpConfigurationService = FxpConfigurationService;
        fxpContextService = FxpContextService;
        fxpTelemetryContext = FxpTelemetryContext;
        userInfoService = UserInfoService;
        $timeoutSpy = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
        $serviceIntervalSpy = jasmine.createSpy('$timeout', userProfileService.timeout).and.callThrough();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    describe("When we have getBasicProfile and isRefresh is true ", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            spyOn(userProfileService, "getBasicProfileSvc").and.callThrough();
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details such as FirstName BusinessRole,BusinessRoleID ", () => {
            expect(result.FirstName).toEqual("Ronald");
            expect(result.LastName).toEqual("Jay");
            expect(result.BusinessRole).toEqual("RM");
            expect(result.BusinessRoleId).toEqual(1001);
        });
        it("Then it should check if getBasicProfileSvc was called with useralias", () => {
            expect(userProfileService.getBasicProfileSvc).toHaveBeenCalledWith("v-ronald", false);
        });
        it("Then it should check logInformation was called with params ", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfileService', "getBasicProfile(alias) End");
        });
        it("Then it should if startTrackPerformance was called ", () => {
            expect(userProfileService.fxplogger.startTrackPerformance).toHaveBeenCalledWith("GetBasicProfileWithAdal");
        });
        it("Then it should check if logMetric was called ", () => {
            expect(userProfileService.fxplogger.logMetric).toHaveBeenCalled();
        });
        it("Then it should check if createPropertyBag was called ", () => {
            expect(userProfileService.fxplogger.createPropertyBag).toHaveBeenCalled();
        });
        it("Then it should check for Profile details ", () => {
            expect(userProfileService.fxplogger.stopTrackPerformance).toHaveBeenCalledWith("GetBasicProfileWithAdal");
        });
    });
    describe("When we fetch getBasicProfile details with BusinessRole ID 0 and BusinessRole,Seniority is null", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 0, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            spyOn(userProfileService, "getBasicProfileSvc").and.callThrough();
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should check if BusinessRoleID is 0 and BusinessRole,Seniority is null", () => {
            expect(result.BusinessRoleId).toEqual(0);
            expect(result.BusinessRole).toBeNull();
            expect(result.Seniority).toBeNull();
        });
        it("Then it should also check if getBasicProfileSvc is called with useralias", () => {
            console.log("Result ->" + result.FirstName);
            expect(userProfileService.getBasicProfileSvc).toHaveBeenCalledWith("v-ronald", false);
        });
        it("Then it should also check if logInformation is called or not", () => {

            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfileService', "getBasicProfile(alias) End");
        });
        it("Then it should check if startTrackPerformance is called or not", () => {

            expect(userProfileService.fxplogger.startTrackPerformance).toHaveBeenCalledWith("GetBasicProfileWithAdal");
        });
        it("Then it should log error if BusinessRoleID,BusinessRole is null or undefined", () => {

            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Your profile is not mapped to a Dashboard. Please contact IT support.', "2608", null);

        });
        it("Then it should show message if BusinessRoleID,BusinessRole is null or undefined", () => {

            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', "error");
        });
        it("Then it should check logmetric was called", () => {

            expect(fxpLogger.logMetric).toHaveBeenCalled();
        });

        it("Then it should check if stopTrackPerformance was called ", () => {

            expect(fxpLogger.stopTrackPerformance).toHaveBeenCalledWith("GetBasicProfileWithAdal");
        });
    });
    describe("When we have getBasicProfile and isRefresh is false", () => {
        var userProfileMockData = "{\"FirstName\": \"Ronald\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Ronald, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-ronald\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\",\"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
        sessionStorage[userAlias + "-" + "userInfo"] = userProfileMockData;
        var res;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            spyOn(userProfileService, 'getBasicProfileByAlias').and.callThrough();
            spyOn(userProfileService, 'getBasicUserProfile').and.callThrough();
            res = userProfileService.getBasicProfile(userAlias, false);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should check for  Basic Profile data ", () => {
            expect(res).toBeDefined();
            res.then(function (response) {
                expect(response.FirstName).toEqual("Ronald");
                expect(response.LastName).toEqual("Jay");
            });
        });
        it("Then it should check if getBasicUserProfile is called  ", () => {
            expect(userProfileService.getBasicUserProfile).toHaveBeenCalled();
        });
        it("Then it should check if getBasicProfileByAlias is getting called  ", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });
    });
    describe("When we have getBasicProfile and it throws 404 error as url request fails it goes to catch block", () => {
        var result;
        beforeEach(function () {

            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(404, "", {}, "No data available");
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
                console.log(ex)
            });
            $httpBackend.flush();
        });
        it("Then it should log error Error in getBasicProfile from service", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", "Error in getBasicProfile from service", "2600", "", propBagValue);
        });
        it("Then it should show error message System Error has occurred: Unable to retrieve your  profile information. Please try again ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("System Error has occurred: Unable to retrieve your  profile information. Please try again", "error");
        });
        it("Then it should logMetric ", () => {
            expect(userProfileService.fxplogger.logMetric).toHaveBeenCalled();
        });
        it("Then it check url request status to be 404 ", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No data available");

        });
    });
    describe("When we have getUserThumbnail and adalrequest count reaches 5", () => {
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            userProfileService.iCount = 4;
            userProfileService.getUserThumbnail(userAlias, true);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://graph.windows.net/myorganization/users/ as url ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://graph.windows.net/myorganization/users/");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error occured while retrieving JWT Token", '2602', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });
    describe("When we have getUserThumbnail and image is available for the user", () => {
        var imageResult;
        beforeEach(function () {
            $httpBackend.expectGET("https://graph.windows.net/myorganization/users/v-ronald/thumbnailPhoto?api-version=1.5")
                .respond(200, { "ImageText": "Image is available" }, {}, "Success");
            userProfileService.getUserThumbnail(userAlias, true).then(function (data) {
                imageResult = data;
            }).catch(function (e) {
                console.log(e);
            });

            $httpBackend.flush();
        })
        it("Then it should check if accessTokenRequestInProgress is getting called with https://graph.windows.net/myorganization/users/ ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://graph.windows.net/myorganization/users/");
        });
        it("Then it should check if logInformation is getting called ", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfileService', "GetUserThumbnail");
        });
        it("Then it should check if image is available and imageStatus is 200", () => {
            expect(imageResult.data.ImageText).toEqual("Image is available");
            expect(imageResult.status).toEqual(200);
            expect(imageResult.statusText).toEqual("Success");
        });
    });
    describe("When we have getUserThumbnail and no image is available for the user", () => {
        var imageResult;
        beforeEach(function () {
            $httpBackend.expectGET("https://graph.windows.net/myorganization/users/v-ronald/thumbnailPhoto?api-version=1.5")
                .respond(404, "", {}, "No Image available");
            userProfileService.getUserThumbnail(userAlias, true).then(function (data) {
            }).catch(function (e) {
                imageResult = e;
                console.log(e);
            });
            $httpBackend.flush();
        })
        it("Then it should check if accessTokenRequestInProgress is getting called with https://graph.windows.net/myorganization/users/ ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://graph.windows.net/myorganization/users/");
        });
        it("Then it should check if image is unavailable and imageStatus is 404", () => {
            expect(imageResult.status).toEqual(404);
            expect(imageResult.statusText).toEqual("No Image available");
        });

    });
    describe("When we have getUserClaims", () => {
        var res;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Alias\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
            res = userProfileService.getUserClaims("OneProfile");
            expect(res).toBeDefined();
        })
        it("Then it should return ApplicationName when sessionStorage has claims", () => {
            expect(res.ApplicationName).toEqual("OneProfile");
        });
    });
    describe("When we have getUserClaims,sessionStorage has claims and wrong appID is passed", () => {
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Alias\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
        })
        it("Then it should log and throw error and show error Message Your profile does not have permissions to access this content. Please contact IT support. ", () => {
            try {
                var res = userProfileService.getUserClaims("field");
            }
            catch (e) {
                console.log(res);
                expect(e.message).toEqual("Your profile does not have permissions to access this content. Please contact IT support.");
                expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Error in getUserClaims from service which Returns Error', "2610", null);
                expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
            }
        });
    });
    describe("When we have getUserClaims,sessionStorage has claims and application Roles is  undefined", () => {
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Alias\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\"},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
        })
        it("Then it should log and throw error and show error message Your profile does not have permissions to access this content. Please contact IT support. ", () => {
            try {
                var res = userProfileService.getUserClaims("OneProfile");
            }
            catch (e) {
                console.log(res);
                expect(e.message).toEqual("Your profile does not have permissions to access this content. Please contact IT support.");
                expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Error in getUserClaims from service which returns Blank App Roles', "2611", null);
                expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
            }

        });
    });
    describe("When we have getUserClaims,sessionStorage has claims and application Roles is  empty", () => {
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Alias\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":\"\"},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
        })
        it("Then it should log and throw error and show error message Your profile does not have permissions to access this content. Please contact IT support. ", () => {
            try {
                var res = userProfileService.getUserClaims("OneProfile");
            }
            catch (e) {
                console.log(res);
                expect(e.message).toEqual("Your profile does not have permissions to access this content. Please contact IT support.");
                expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Error in getUserClaims from service which returns Blank App Roles', "2611", null);
                expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
            }
        });
    });
    describe("When we have getUserClaims,sessionStorage has claims and appID is null", () => {
        var res;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Alias\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
            res = userProfileService.getUserClaims(null);
        })
        it("Then it should return userClaims.Applications ", () => {
            expect(res.OneProfile.ApplicationName).toEqual("OneProfile");
        });
    });
    describe("When we have getUserClaims and sessionStorage does not have claims", () => {
        var res;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            userProfileService.isObo = jasmine.createSpy("isObo").and.returnValue(false);
            sessionStorage.clear();

        });
        it("Then it should log and throw error and show error message.", () => {
            try {
                var res = userProfileService.getUserClaims("OneProfile");
            }
            catch (e) {
                console.log(res);
                expect(e.message).toEqual("Your profile does not have permissions to access this content. Please contact IT support.");
                expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Error in getUserClaims from service which Returns Error', "2606", null);
                expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
            }
        });
    });
    describe("When we have getBasicProfileSvc adalrequest count reaches 5", () => {
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            userProfileService.iUCount = 4;
            userProfileService.getBasicProfileSvc(userAlias);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/ as url ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error occured while retrieving JWT Token", '2604', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });
    describe("When we have getBasicProfileSvc and url request status is successful", () => {
        var res1;
        beforeEach(function () {
            var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 0, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfileSvc(userAlias)
                .then(function (data) {
                    res1 = data;
                }).catch(function (e) { });
            $httpBackend.flush();
        });
        it("Then it should  check for user data such First Name, LastName", () => {
            expect(res1.data.FirstName).toEqual("Ronald");
        });
        it("Then it should  check for url request status to be 200", () => {
            expect(res1.status).toEqual(200);
        });
        it("Then it should  check accessTokenRequestInProgress was called with https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/");
        });
        it("Then it should  check if logInformation was called", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfileService', "GetBasicProfileSvc");
        });
    });
    describe("When we have getBasicProfileSvc and url request status is not successful", () => {
        var res1;
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(404, "", {}, "No data available");
            userProfileService.getBasicProfileSvc(userAlias)
                .then(function (data) {
                    res1 = data;
                }).catch(function (e) {
                    res1 = e;
                });
            $httpBackend.flush();
        })
        it("Then it should if accessTokenRequestInProgress as called with https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/");
        });
        it("Then it should  check for url request status to be 404", () => {
            expect(res1.statusText).toEqual("No data available");
            expect(res1.status).toEqual(404);
        });
    });
    describe("When we have getBasicUserProfile and sessionStorage has User Data", () => {
        var res;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var data = "{\"FirstName\": \"Ronald\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Ronald, Jay\", \"EmailName\": null, \"Alias\": \"v-ronald\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001,\"Seniority\":\"Associate\", \"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            sessionStorage[userAlias + "-" + "userInfo"] = data
            spyOn(userProfileService, 'getBasicProfileByAlias').and.callThrough();
            res = userProfileService.getBasicUserProfile(false);
            $serviceIntervalSpy.flush(1000);

        })
        it("Then it should fetch Basic Profile and compare for First Name and Last Name ", () => {
            expect(res).toBeDefined();
            res.then(function (response) {
                expect(response.FirstName).toEqual("Ronald");
                expect(response.LastName).toEqual("Jay");
            });
        });
        it("Then it should check if getBasicProfileByAlias was called ", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });
    });
    describe("When we have getBasicUserProfile and sessionStorage is empty", () => {
        var result;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            sessionStorage.clear();
            spyOn(userProfileService, 'getBasicProfileByAlias').and.callThrough();
            spyOn(userProfileService, 'getBasicProfile').and.callThrough();

            userProfileService.getBasicUserProfile(false).then(function (response) {
                result = response;
            });
            $httpBackend.flush();
        })
        it("Then it should fetch Basic profile and compare FirstName ,LastName", () => {
            expect(result.FirstName).toEqual("Ronald");
            expect(result.LastName).toEqual("Jay");
        });
        it("Then it should check if getBasicProfile was called", () => {
            expect(userProfileService.getBasicProfile).toHaveBeenCalled();
        });
        it("Then it should check if getBasicProfileByAlias was called", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });
    });
    describe("When we have getBasicUserProfileLoggedInUser when sessionStorage has userData", () => {
        var res;
        beforeEach(function () {
            userProfileService.loggedInUserAlias = userAlias;
            var data = "{\"FirstName\": \"Ronald\", \"LastName\": \"Jay\", \"MiddleName\": null, \"FullName\": \"Ronald, Jay\",\"DisplayName\": \"DisplayName\", \"PreferredFirstName\": \"PreferredFirstName\", \"ReportsToDisplayName\": \"ReportsToDisplayName\", \"EmailName\": null, \"Alias\": \"v-ronald\", \"Domain\": \"Global Practice Ops\", \"PersonnelNumber\": 365317, \"PrimaryTool\": null, \"ReportsTo\": \"v-roger\", \"ReportsToFirstName\": null, \"ReportsToLastName\": null, \"ReportsToMiddleName\": null, \"CostCenterCode\": \"79038\", \"HiringDate\": \"2014-01-06T00:00:00\", \"TerminationDate\": null, \"ServiceJobTitle\": \"Software Development\", \"HomeLocation\": { \"HomeCountry\": \"IN \", \"HomeState\": null, \"HomeCity\": \"Hyderabad\", \"HomeLocLongitude\": null, \"HomeLocLatitude\": null }, \"WorkLocation\": { \"WorkCountry\": null, \"WorkState\": null, \"WorkCity\": null, \"WorkLocLatitude\": null, \"WorkLocLogitude\": null }, \"Weekdays\": [], \"ResourceType\": \"Business Support\", \"AlignmentType\": \"Domain Aligned\", \"StandardTitle\": \"Software Development Engineer 2\", \"CompanyCode\": 1190, \"SubAreaCode\": \"7000\", \"CountryCode\": \"IN \", \"HomeLocationNotFoundInd\": false, \"StandardTimeZone\": \"Dummy\", \"ResourceStatus\": \"2\", \"ResourceCategory\": \"FTE\", \"BusinessRole\": \"RM\", \"BusinessRoleId\": 1001, \"Seniority\":\"Associate\", \"ResumeUrl\": null, \"FunctionHierarchyCode\": \"FB3J\" }";
            sessionStorage[userAlias + "-" + "userInfo"] = data
            spyOn(userProfileService, 'getBasicProfileByAlias').and.callThrough();
            res = userProfileService.getBasicUserProfileLoggedInUser(false);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should fetch Basic Profile and compare for First Name and Last Name ", () => {
            expect(res).toBeDefined();
            res.then(function (response) {
                expect(response.FirstName).toEqual("Ronald");
                expect(response.LastName).toEqual("Jay");
            });
        });
        it("Then it should check if getBasicProfileByAlias was called ", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });
    });
    describe("When we have getBasicUserProfileLoggedInUser and sessionStorage is empty", () => {
        var result;
        beforeEach(function () {
            userProfileService.loggedInUserAlias = userAlias;
            var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            sessionStorage.clear();
            spyOn(userProfileService, 'getBasicProfileByAlias').and.callThrough();
            spyOn(userProfileService, 'getBasicProfile').and.callThrough();

            userProfileService.getBasicUserProfileLoggedInUser(false).then(function (response) {
                result = response;
            });
            $httpBackend.flush();
        })
        it("Then it should fetch Basic profile and compare FirstName ,LastName", () => {
            expect(result.FirstName).toEqual("Ronald");
            expect(result.LastName).toEqual("Jay");
        });
        it("Then it should check if getBasicProfile was called", () => {
            expect(userProfileService.getBasicProfile).toHaveBeenCalled();
        });
        it("Then it should check if getBasicProfileByAlias was called", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });
    });
    describe("When we have setLoggedInUser is called ", () => {
        beforeEach(function () {
            userProfileService.setLoggedInUser(userAlias);
        })
        it("Then it should check if loggedInUserAlias is getting called with userAlias", () => {
            expect(userProfileService.loggedInUserAlias).toEqual("v-ronald");
        });
        it("Then it should check if setLoggedInUser is getting called with userAlias", () => {
            expect(userProfileService.userInfoService.setLoggedInUser).toHaveBeenCalledWith("v-ronald")
        });
    });
    describe("When we have OnBehalf and isActingOnBehalfOf returns true ", () => {
        var res;
        beforeEach(function () {
            res = userProfileService.isObo();
        })
        it("Then it should check if return is true", () => {
            expect(res).toEqual(true);
        });
        it("Then it should check if isActingOnBehalfOf is called", () => {
            expect(userProfileService.userInfoService.isActingOnBehalfOf).toHaveBeenCalledWith();
        });
    });
    describe("When we have OnBehalf and isActingOnBehalfOf returns false ", () => {
        var res;
        beforeEach(function () {
            userProfileService.userInfoService.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.returnValue(false);
            res = userProfileService.isObo();
        })
        it("Then it should check if return is false", () => {
            expect(res).toEqual(false);
        });
        it("Then it should check if isActingOnBehalfOf is called", () => {
            expect(userProfileService.userInfoService.isActingOnBehalfOf).toHaveBeenCalledWith();
        });
    });
    describe("When we have search profile and adalRequest count reaches 5", () => {
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            userProfileService.iUCount = 4;
            userProfileService.searchProfile(userAlias);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald as url ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfile', "Error occured while retrieving JWT Token", '2604', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });
    describe("When we have search profile url request is a success", () => {
        var res1;
        beforeEach(function () {
            var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 0, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald")
                .respond(200, userProfileMockData);

            userProfileService.searchProfile(userAlias)
                .then(function (data) {
                    res1 = data;
                    console.log("only data");
                    expect(data.data.FirstName).toEqual("Ronald");
                    expect(data.status).toEqual(200);
                    console.log(data)
                }).catch(function (e) { });
            $httpBackend.flush();
        });
        it("Then it should check for userProfile details searched profile such as First Name , Last Name ,alias", () => {
            expect(res1.data.FirstName).toEqual("Ronald");
            expect(res1.data.Alias).toEqual("v-ronald");
            expect(res1.data.FullName).toEqual("Ronald, Jay");
        });
        it("Then it should check url status request is 200", () => {
            expect(res1.status).toEqual(200);
        });
        it("Then it should check if accessTokenRequestInProgress was called", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald");
        });
        it("Then it should check if logInformation was called", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfileService', "searchProfile");
        });
    });
    describe("When we have search profile url request is not a success", () => {
        var res1;
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald")
                .respond(404, "", {}, "No searched profile available");

            userProfileService.searchProfile(userAlias)
                .then(function (data) {
                    res1 = data;
                }).catch(function (e) {
                    res1 = e;
                });
            $httpBackend.flush();
        });
        it("Then it should check for url status to be 404", () => {
            expect(res1.statusText).toEqual("No searched profile available");
            expect(res1.status).toEqual(404);
        });
        it("Then it should if accessTokenRequestInProgress was called", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/searchprofile?searchText=v-ronald");
        });
    });
    describe("When we have getUserClaimsSvc and OBO is false ", () => {
        var res;
        var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/claim/")
                .respond(200, claims);
            userProfileService.isObo = jasmine.createSpy("isObo").and.returnValue(false);
            userProfileService.fxplogger.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                console.log(a + ':' + b);
            });
            userProfileService.getUserClaimsSvc(userAlias).then(function (response) {
                res = response;
            });
            $httpBackend.flush();
        });

        it("Then it should get claims and check userdetails such as fisrtName, upn", () => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.data.FirstName).toEqual("Ronald");
            expect(res.data.LastName).toEqual("Jay");
            expect(res.data.Upn).toEqual("v-ronald@microsoft.com");
        });
        it("Then it should check if logInformation is called with GetUserClaimsSvc", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfile', 'GetUserClaimsSvc');
        });

    });
    describe("When we have getCalimsSvc and sessionStorage has claims", () => {
        beforeEach(function () {
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            sessionStorage["fxpUserClaims" + "_" + userAlias] = claims;
            userProfileService.getCalimsSvc(userAlias);
        });
        it("Then it should check if setCurrentUserUpn is called", () => {
            expect(userProfileService.userInfoService.setCurrentUserUpn).toHaveBeenCalledWith("v-ronald@microsoft.com");
        });
    });
    describe("When we have getCalimsSvc and sessionStorage is empty", () => {
        var res;
        var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
        beforeEach(function () {
            spyOn(userProfileService, 'getUserClaimsSvc').and.callThrough();
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald")
                .respond(200, claims);
            sessionStorage.clear();
            userProfileService.getCalimsSvc(userAlias).then(function (response) {
                res = response;
            });
            $httpBackend.flush();
        });
        it("Then it should check if getUserClaimsSvc is called", () => {
            expect(userProfileService.getUserClaimsSvc).toHaveBeenCalled();
        });
        it("Then it should check if setCurrentUserUpn is called", () => {
            expect(userProfileService.userInfoService.setCurrentUserUpn).toHaveBeenCalledWith("v-ronald@microsoft.com");
        });

        it("Then it should check if saveContext is called", () => {
            expect(userProfileService.fxpcontext.saveContext).toHaveBeenCalled();
        });
        it("Then it should check if logMetric is called", () => {
            expect(userProfileService.fxplogger.logMetric).toHaveBeenCalled();
        });

        it("Then it should check if logInformation is called with getUserClaimsSvc() End", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith("Fxp.UserProfileService", "getUserClaimsSvc() End");
        });

    });
    describe("When we have getCalimsSvc and sessionStorage is empty and no applications in claims available", () => {
        var res;
        var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":[]}";
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald")
                .respond(200, claims);
            sessionStorage.clear();
            userProfileService.getCalimsSvc(userAlias).then(function (response) {
                res = response;
            });
            $httpBackend.flush();
        });

        it("Then it should logError with Error in getUserClaims from service which returns Blank App Roles", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error in getUserClaims from service which returns Blank App Roles", '2611', null);
        });
        it("Then it should show error message Your profile does not have permissions to access this content. Please contact IT support.", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
        });
    });
    describe("When we have getCalimsSvc and sessionStorage is empty and getUserClaimsSvc throw some error", () => {
        beforeEach(function () {
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald")
                .respond(500, claims);
            sessionStorage.clear();
            userProfileService.getCalimsSvc(userAlias);
            $httpBackend.flush();
            userProfileService.getUserClaimsSvc = jasmine.createSpy("getUserClaimsSvc").and.callFake(function (a, b) {
                return new Promise(function (resolve, reject) {
                    reject('error');
                });
            });
        });
        it("Then it should check if logError is called", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalled();
        });
        it("Then it should check if addMessage is called", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalled();
        });
        it("Then it should check if logMetric is called", () => {
            expect(userProfileService.fxplogger.logMetric).toHaveBeenCalled();
        });
    });
    describe("When we have getUserClaimsSvc OBO is true ", () => {
        var resClaims;
        beforeEach(function () {
            var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":{\"OneProfile\":{\"ApplicationName\":\"OneProfile\",\"Roles\":{\"ResourceProfileReader\":{\"RoleName\":\"ResourceProfileReader\",\"Permissions\":[{\"ResourceName\":\"ResourceAccreditation\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceDelegationDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceJobSkillDetails\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceProfessionalCertification\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceServiceProfile\",\"ResourceOperation\":\"view\"},{\"ResourceName\":\"ResourceWeeklyShiftPlan\",\"ResourceOperation\":\"view\"}]}}},\"GlobalResourceManagement\":{\"ApplicationName\":\"GlobalResourceManagement\",\"Roles\":{\"Requestor\":{\"RoleName\":\"Requestor\",\"Permissions\":[]}}}}}";
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald")
                .respond(200, claims);
            userProfileService.isObo = jasmine.createSpy("isObo").and.returnValue(true);
            userProfileService.getUserClaimsSvc(userAlias).then(function (response) {
                resClaims = response;
            });
            $httpBackend.flush();
        });
        it("Then it should check if startTrackPerformance is called with params ", () => {
            expect(userProfileService.fxplogger.startTrackPerformance).toHaveBeenCalledWith("GetUserClaims");
        });
        it("Then it should check if logInformation is called with GetUserClaimsSvc", () => {
            expect(userProfileService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.UserProfile', 'GetUserClaimsSvc');
        });
        it("Then it should get claims and check userdetails such as fisrtName, upn", () => {
            expect(resClaims.data.FirstName).toEqual("Ronald");
            expect(resClaims.data.LastName).toEqual("Jay");
            expect(resClaims.data.Upn).toEqual("v-ronald@microsoft.com");
        });
    });
    describe("When we have getUserClaimsSvc OBO is true and no applications in claims available ", () => {
        var res;
        var claims = "{\"FirstName\":\"Ronald\",\"LastName\":\"Jay\",\"Upn\":\"v-ronald@microsoft.com\",\"Applications\":[]}";
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald")
                .respond(200, claims);
            sessionStorage.clear();
            userProfileService.getCalimsSvc(userAlias).then(function (response) {
                res = response;
            });
            $httpBackend.flush();
        });
        it("Then it should logError with Error in getUserClaims from service which returns Blank App Roles", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error in getUserClaims from service which returns Blank App Roles", '2611', null);
        });
        it("Then it should show error message Your profile does not have permissions to access this content. Please contact IT support.", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith("Your profile does not have permissions to access this content. Please contact IT support.", "error");
        });
    });
    describe("When we have getUserClaimsSvc OBO is true and adalrequest count reaches 5 ", () => {
        beforeEach(function () {
            sessionStorage.clear();
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            userProfileService.iReqCount = 4;
            userProfileService.getUserClaimsSvc(userAlias);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald as url ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitclaims.trafficmanager.net/api/v1/userclaims?alias=v-ronald");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });
    describe("When we have getUserClaimsSvc OBO is false and adalrequest count reaches 5 ", () => {
        beforeEach(function () {
            userProfileService.isObo = jasmine.createSpy("isObo").and.returnValue(false);
            sessionStorage.clear();
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            userProfileService.iReqCount = 4;
            userProfileService.getUserClaimsSvc(userAlias);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://oneprofilesitclaims.trafficmanager.net/api/v1/claim/ as url ", () => {
            expect(userProfileService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitclaims.trafficmanager.net/api/v1/claim/");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith('Fxp.UserProfileService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
    });
    describe("When we have getBasicProfile and having DisplayName, PreferredFirstName, ReportsToDisplayName, Seniority and BusinessRole", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare DisplayName, PreferredFirstName, ReportsToDisplayName, Seniority and BusinessRole ", () => {
            expect(result.DisplayName).toEqual("DisplayName");
            expect(result.PreferredFirstName).toEqual("PreferredFirstName");
            expect(result.ReportsToDisplayName).toEqual("ReportsToDisplayName");
            expect(result.Seniority).toEqual("Associate");
            expect(result.BusinessRole).toEqual("RM");
        });
    });
    describe("When we have getBasicProfile and DisplayName, PreferredFirstName, ReportsToDisplayName, Seniority and BusinessRole having null values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare DisplayName, PreferredFirstName, ReportsToDisplayName, Seniority and BusinessRole ", () => {
            expect(result.DisplayName).toBeNull;
            expect(result.PreferredFirstName).toBeNull;
            expect(result.ReportsToDisplayName).toBeNull;
            expect(result.Seniority).toBeNull;
            expect(result.BusinessRole).toBeNull;
        });
    });
    describe("When we have getBasicProfile and BusinessRole, Seniority having values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare BusinessRoleDisplayName ", () => {
            expect(result.BusinessRoleDisplayName).toEqual("Associate RM");
        });
    });
    describe("When we have getBasicProfile and BusinessRole having values and Seniority having null values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare BusinessRoleDisplayName ", () => {
            expect(result.BusinessRoleDisplayName).toEqual("RM");
        });
    });
    describe("When we have getBasicProfile and BusinessRole having values and Seniority having blank values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare BusinessRoleDisplayName ", () => {
            expect(result.BusinessRoleDisplayName).toEqual("RM");
        });
    });
    describe("When we have getBasicProfile and BusinessRole having null values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare BusinessRoleDisplayName ", () => {
            expect(result.BusinessRoleDisplayName).toBeUndefined();
        });
    });
    describe("When we have getBasicProfile and BusinessRole having blank values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "", "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Basic Profile details and compare BusinessRoleDisplayName ", () => {
            expect(result.BusinessRoleDisplayName).toBeUndefined();
        });
    });
    describe("When we have getBasicProfile and BusinessRoleId having null values", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": null, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should log error if BusinessRoleID is null", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Your profile is not mapped to a Dashboard. Please contact IT support.', "2608", null);
        });
        it("Then it should show message if BusinessRoleID is null", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', "error");
        });

    });
    describe("When we have getBasicProfile and BusinessRoleId having 0 value", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 0, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should log error if BusinessRoleID is 0", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Your profile is not mapped to a Dashboard. Please contact IT support.', "2608", null);
        });
        it("Then it should show message if BusinessRoleID is 0", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', "error");
        });



    });
    describe("When we have getBasicProfile and BusinessRoleId having value and BusinessRole having null value", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": null, "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should log error if BusinessRole is null", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Your profile is not mapped to a Dashboard. Please contact IT support.', "2608", null);
        });
        it("Then it should show message if BusinessRole is null", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', "error");
        });
    });
    describe("When we have getBasicProfile and BusinessRoleId having value, BusinessRole having blank value", () => {
        var result;
        var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": null, "PreferredFirstName": null, "ReportsToDisplayName": null, "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "", "BusinessRoleId": 1001, "Seniority": null, "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            userProfileService.getBasicProfile(userAlias, true).then(function (data) {
                result = data;
            }).catch(function (ex) {
                result = ex;
            });
            $httpBackend.flush();
        });
        it("Then it should log error if BusinessRole is blank", () => {
            expect(userProfileService.fxplogger.logError).toHaveBeenCalledWith("Fxp.UserProfileService", 'Your profile is not mapped to a Dashboard. Please contact IT support.', "2608", null);
        });
        it("Then it should show message if BusinessRole is blank", () => {
            expect(userProfileService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('Your profile is not mapped to a Dashboard. Please contact IT support.', "error");
        });
    });

    describe("When we have refreshBasicUserProfileInContext", () => {
        var result;
        beforeEach(function () {
            userProfileService.currentUserAlias = userAlias;
            var userProfileMockData = { "FirstName": "Ronald", "LastName": "Jay", "MiddleName": null, "FullName": "Ronald, Jay", "DisplayName": "DisplayName", "PreferredFirstName": "PreferredFirstName", "ReportsToDisplayName": "ReportsToDisplayName", "EmailName": null, "Alias": "v-ronald", "Domain": "Global Practice Ops", "PersonnelNumber": 365317, "PrimaryTool": null, "ReportsTo": "v-roger", "ReportsToFirstName": null, "ReportsToLastName": null, "ReportsToMiddleName": null, "CostCenterCode": "79038", "HiringDate": "2014-01-06T00:00:00", "TerminationDate": null, "ServiceJobTitle": "Software Development", "HomeLocation": { "HomeCountry": "IN ", "HomeState": null, "HomeCity": "Hyderabad", "HomeLocLongitude": null, "HomeLocLatitude": null }, "WorkLocation": { "WorkCountry": null, "WorkState": null, "WorkCity": null, "WorkLocLatitude": null, "WorkLocLogitude": null }, "Weekdays": [], "ResourceType": "Business Support", "AlignmentType": "Domain Aligned", "StandardTitle": "Software Development Engineer 2", "CompanyCode": 1190, "SubAreaCode": "7000", "CountryCode": "IN ", "HomeLocationNotFoundInd": false, "StandardTimeZone": "Dummy", "ResourceStatus": "2", "ResourceCategory": "FTE", "BusinessRole": "RM", "BusinessRoleId": 1001, "Seniority": "Associate", "ResumeUrl": null, "FunctionHierarchyCode": "FB3J" };
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/profile/v-ronald/basic/")
                .respond(200, userProfileMockData);
            sessionStorage.clear();
            spyOn(userProfileService, 'getBasicProfile').and.callThrough();

            userProfileService.refreshBasicUserProfileInContext(false).then(function (response) {
                result = response;
            });
            $httpBackend.flush();
        })
        it("Then it should fetch Basic profile and compare FirstName ,LastName", () => {
            expect(result.FirstName).toEqual("Ronald");
            expect(result.LastName).toEqual("Jay");
        });
        it("Then it should check if getBasicProfile was called", () => {
            expect(userProfileService.getBasicProfile).toHaveBeenCalled();
        });
    });

});

