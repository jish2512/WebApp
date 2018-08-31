/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {PersonalizationService} from '../js/services/PersonalizationService';
declare var angular :any;

describe("Given PersonalizationService UT Suite", () => {
    var $httpBackend;
    var $q;
    var $rootScope;
    var fxpConfigurationService;
    var $serviceIntervalSpy;
    var personalizationService;
    var personalizationUser;
    var $log;
    var propBagValue;
    var propBag;
    var fxpLogger;
    var fxpMessage;
    var adalLoginHelperService;
    var $timeoutSpy;
    var fxpUIConstants;

    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(function () {
        propBag = function () {
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
            $provide.service("FxpConfigurationService", function () {
                var config = {
                    "FxpServiceEndPoint": "https://fxpservicesapidev.azurewebsites.net/api/v1",
                    "OpsProfileEndPoint": "https://oneprofilesitapipack.trafficmanager.net/api/v1"
                }
                this.FxpAppSettings = config;
            });
            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log(a + '' + b);
                });
            });
            $provide.service("FxpLoggerService", function () {
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log("Inforamtion");
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
                    console.log(a + ' - ' + b); return new propBag();
                });
                this.stopTrackPerformance = jasmine.createSpy("stopTrackPerformance").and.callFake(function (a, b) {
                    console.log("stopTrackPerformance");
                    console.log(a + ' - ' + b);
                });
                this.startTrackPerformance = jasmine.createSpy("startTrackPerformance").and.callFake(function (a, b) {
                    console.log(a + ' - ' + b);
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
                        ErrorMessage: "System Error has occurred: Unable to retrieve your profile information. Please try again",
                        ErrorMessageTitle: "Error in getBasicProfile from service"
                    },
                    UserProfileRoleGroupMissingError: {
                        ErrorMessage: "Your professional services profile is not assigned to any rolegroup. Please contact IT support.",
                        ErrorMessageTitle: "Error in getBasicProfileSvc from UserProfile service RoleGroup is missing"
                    }
                }
            };
        });
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$q_, _$rootScope_, _$timeout_, FxpLoggerService, AdalLoginHelperService, FxpMessageService, _FxpConfigurationService_, PersonalizationService) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpConfigurationService = _FxpConfigurationService_;
        personalizationService = PersonalizationService;
        fxpLogger = FxpLoggerService;
        fxpMessage = FxpMessageService;
        adalLoginHelperService = AdalLoginHelperService;
        $timeoutSpy = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
        $serviceIntervalSpy = jasmine.createSpy('$timeout', personalizationService.timeout).and.callThrough();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000
    }));

    describe("When calling getMasterLeftNavItems method", () => {
        var result;
        var L0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 10,
                            "displayName": "Bulk Events Upload",
                            "hasChildren": false,
                            "sortOrder": 8,
                            "parentId": 2
                        }
                    ],
                    "id": 2,
                    "displayName": "Resource Management",
                    "hasChildren": true,
                    "sortOrder": 2,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/leftNav/master")
                .respond(200, L0L1Data);
            personalizationService.getMasterLeftNavItems().then(function (response) {
                result = response.data.result;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Global Navigation details such as L0 and L1's", () => {
            expect(result[0].displayName).toEqual("Resource Management");
            expect(result[0].children[0].displayName).toEqual("Bulk Events Upload");
        });
        it("Then it should log Information", () => {
            expect(personalizationService.fxplogger.logInformation).toHaveBeenCalledWith("Fxp.PersonalizationService", "getMasterLeftNavItems");
        });
    });
    describe("When calling getMasterLeftNavItems and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.getMasterLeftNavItems();
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/leftNav/master as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/leftNav/master");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling getMasterLeftNavItems and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/leftNav/master")
                .respond(404, "", {}, "No Data available");
            personalizationService.getMasterLeftNavItems().then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Global Navigation details such as L0 and L1's", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No Data available");
        });
    });
    describe("When calling getPersonalizedNavItems method", () => {
        var result;
        var personalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization?roleGroupId=1&userRoleId=5")
                .respond(200, personalL0L1Data);
            personalizationService.getPersonalizedNavItems("v-ronald", 1,5).then(function (response) {
                result = response.data.result;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Personalizied Navigation details such as L0 and L1's", () => {
            expect(result[0].displayName).toEqual("Profile");
            expect(result[0].children[0].displayName).toEqual("Skill Assessment");
        });
        it("Then it should log Information", () => {
            expect(personalizationService.fxplogger.logInformation).toHaveBeenCalledWith("Fxp.PersonalizationService", "getPersonalizedNavItems");
        });
    });
    describe("When calling getPersonalizedNavItems and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.getPersonalizedNavItems("v-ronald", 1,5);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization?roleGroupId=1&userRoleId=5 as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization?roleGroupId=1&userRoleId=5");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling getPersonalizedNavItems and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization?roleGroupId=1&userRoleId=5")
                .respond(404, "", {}, "No Data available");
            personalizationService.getPersonalizedNavItems("v-ronald", 1, 5).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should fetch Global Navigation details such as L0 and L1's", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No Data available");
        });
    });
    describe("When calling savePersonalizedNavItems method", () => {
        var result;
        var savePersonalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectPOST("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization", savePersonalL0L1Data)
                .respond(200, "success");
            personalizationService.savePersonalizedNavItems("v-ronald", savePersonalL0L1Data).then(function (response) {
                result = response;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should save Personalized Navigation details such as L0 and L1's", () => {
            expect(result.data).toEqual("success");
            expect(result.status).toEqual(200);
        });
        it("Then it should log Information", () => {
            expect(personalizationService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.PersonalizationService', "savePersonalizedNavItems");
        });
    });
    describe("When calling savePersonalizedNavItems and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.savePersonalizedNavItems("v-ronald", {});
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling savePersonalizedNavItems and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectPOST("https://fxpservicesapidev.azurewebsites.net/api/v1/user/v-ronald/leftNav/personalization", {"ShouldAssignRoles":true})
                .respond(500, "", {}, "Service Failed");
            personalizationService.savePersonalizedNavItems("v-ronald", {}).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw Service Failed while Saving Personalized Navigation details such as L0 and L1's", () => {
            expect(result.status).toEqual(500);
            expect(result.statusText).toEqual("Service Failed");
        });
    });
    describe("When calling persistUserPersonalization for persist user", () => {
        var result;
        beforeEach(function () {
            personalizationService.persistUserPersonalization("user", "v-ronald");
        });
        it("Then value should be save in localStorage", () => {
            expect(localStorage.getItem("selectedUserPersonalization")).toBeDefined();
        });
        it("Then saved value should be save in localStorage", () => {
            expect(localStorage.getItem("selectedUserPersonalization")).toBeDefined();
        });
    });
    describe("When calling persistUserPersonalization for persist leftNavList", () => {
        var result;
        beforeEach(function () {
            personalizationService.persistUserPersonalization("leftNavList", { id: 300, displayText: 'FxP' });
        });
        it("Then value should be save in localStorage", () => {
            expect(localStorage.getItem("selectedUserPersonalization")).toBeDefined();
        });
    });
    describe("When calling persistUserPersonalization for persist personalizedList", () => {
        var result;
        beforeEach(function () {
            personalizationService.persistUserPersonalization("personalizedList", { id: 301, displayText: 'FxP' });
        });
        it("Then value should be save in localStorage", () => {
            expect(localStorage.getItem("selectedUserPersonalization")).toBeDefined();
        });
    });
    describe("When calling getPersistedPersonalization for get persisted user information", () => {
        var result;
        beforeEach(function () {
            result = personalizationService.getPersistedPersonalization();
        });
        it("Then it should be return persisted user information", () => {
            expect(result).toEqual("personalizedList");
        });
    });
    describe("When calling removePersistedUserPersonalization", () => {
        var result;
        beforeEach(function () {
            personalizationService.removePersistedUserPersonalization();
        });
        it("Then persisted user personalization information should be removed from localStorage", () => {
            expect(localStorage.getItem("selectedUserPersonalization")).toEqual(null);
        });
    });
    describe("When calling getRoleGroup", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("/Home/GetRoleGroup?roleGroupId=2")
                .respond(200, 5);
            personalizationService.getRoleGroup(2).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should return Role Group Id", () => {
            expect(result).toEqual(5);
        });
    });
    describe("When calling getRoleGroupDetails", () => {
        var result;
        var roleGroupDetails = [{
            "RoleGroupId": 3,
            "RoleGroupName": "Functional Manager",
            "BusinessRoles": [
                {
                    "BusinessRoleName": "DM",
                    "BusinessRoleID": 1
                },
                {
                    "BusinessRoleName": "ADM",
                    "BusinessRoleID": 3
                },
                {
                    "BusinessRoleName": "DFDM",
                    "BusinessRoleID": 2
                },
                {
                    "BusinessRoleName": "NM",
                    "BusinessRoleID": 4
                }
            ]
        }];
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/master/rolegroup")
                .respond(200, roleGroupDetails);
            personalizationService.getRoleGroupDetails().then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should return Role Group Id", () => {
            expect(result[0].RoleGroupId).toEqual(3);
        });
        it("Then it should return Role Group Name", () => {
            expect(result[0].RoleGroupName).toEqual("Functional Manager");
        });
        it("Then it should return list of BusinessRoles", () => {
            expect(result[0].BusinessRoles.length).toBeGreaterThan(0);
        });
        it("Then it should return BusinessRoleId", () => {
            expect(result[0].BusinessRoles[0].BusinessRoleID).toEqual(1);
        });
        it("Then it should return BusinessRoleName", () => {
            expect(result[0].BusinessRoles[0].BusinessRoleName).toEqual("DM");
        });
    });
    describe("When calling getRoleGroupDetails and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("https://oneprofilesitapipack.trafficmanager.net/api/v1/master/rolegroup")
                .respond(404, "", {}, "No Data available");
            personalizationService.getRoleGroupDetails().then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw error", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No Data available");
        });
    });
    describe("When calling getRoleGroupDetails and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.getRoleGroupDetails();
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://oneprofilesitapipack.trafficmanager.net/api/v1/master/rolegroup as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://oneprofilesitapipack.trafficmanager.net/api/v1/master/rolegroup");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', 'Error occured while retrieving JWT Token', '2611', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling getRolePersonalizedNavItems ", () => {
        var result;
        var personalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/userRole/73/leftNav/personalization?roleGroupId=1")
                .respond(200, personalL0L1Data);
            personalizationService.getRolePersonalizedNavItems(73,1).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should return l0 Display Name", () => {
            expect(result.result[0].displayName).toEqual("Profile");
        });
    });
    describe("When calling getRolePersonalizedNavItems and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/userRole/73/leftNav/personalization?roleGroupId=1")
                .respond(404, "", {}, "No Data available");
            personalizationService.getRolePersonalizedNavItems(73,1).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw error", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No Data available");
        });
    });
    describe("When calling getRoleGroupDetails and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.getRolePersonalizedNavItems(73, 1);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/userRole/73/leftNav/personalization?roleGroupId=1 as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/userRole/73/leftNav/personalization?roleGroupId=1");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', 'Error occured while retrieving JWT Token', '2603', null );
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling getRoleGroupPersonalizedList  ", () => {
        var result;
        var personalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization")
                .respond(200, personalL0L1Data);
            personalizationService.getRoleGroupPersonalizedList(1).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should return l0 Display Name", () => {
            expect(result.result[0].displayName).toEqual("Profile");
        });
    });
    describe("When calling getRoleGroupPersonalizedList  and no data is available", () => {
        var result;
        beforeEach(function () {
            $httpBackend.expectGET("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization")
                .respond(404, "", {}, "No Data available");
            personalizationService.getRoleGroupPersonalizedList(1).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw error", () => {
            expect(result.status).toEqual(404);
            expect(result.statusText).toEqual("No Data available");
        });
    });
    describe("When calling getRoleGroupPersonalizedList  and adalrequest count reaches 5", () => {
        var result;
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.getRoleGroupPersonalizedList(1)
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', 'Error occured while retrieving JWT Token', '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling saveRoleGroupPersonalizedNavItems method", () => {
        var result;
        var savePersonalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectPOST("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization", savePersonalL0L1Data)
                .respond(200, "success");
            personalizationService.saveRoleGroupPersonalizedNavItems(1,null, savePersonalL0L1Data).then(function (response) {
                result = response;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should save Role Group details such as L0 and L1's", () => {
            expect(result.data).toEqual("success");
            expect(result.status).toEqual(200);
        });
        it("Then it should log Information", () => {
            expect(personalizationService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.PersonalizationService', "saveRoleGroupPersonalizedNavItems");
        });
    });
    describe("When calling saveRoleGroupPersonalizedNavItems method when user role is passed ", () => {
        var result;
        var savePersonalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectPOST("https://fxpservicesapidev.azurewebsites.net/api/v1/userRole/73/leftNav/personalization", savePersonalL0L1Data)
                .respond(200, "success");
            personalizationService.saveRoleGroupPersonalizedNavItems(null, "73", savePersonalL0L1Data).then(function (response) {
                result = response;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should save Role Group details such as L0 and L1's", () => {
            expect(result.data).toEqual("success");
            expect(result.status).toEqual(200);
        });
        it("Then it should log Information", () => {
            expect(personalizationService.fxplogger.logInformation).toHaveBeenCalledWith('Fxp.PersonalizationService', "saveRoleGroupPersonalizedNavItems");
        });
    });
    describe("When calling saveRoleGroupPersonalizedNavItems and adalrequest count reaches 5", () => {
        var result;
        var savePersonalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            adalLoginHelperService.accessTokenRequestInProgress = jasmine.createSpy("accessTokenRequestInProgress").and.callFake(function () { return true });
            personalizationService.iReqCount = 4;
            personalizationService.saveRoleGroupPersonalizedNavItems(1, 73, savePersonalL0L1Data, true);
            $serviceIntervalSpy.flush(1000);
        });
        it("Then it should call accessTokenRequestInProgress with https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization as url ", () => {
            expect(personalizationService.adalLoginHelperService.accessTokenRequestInProgress).toHaveBeenCalledWith("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization");
        });
        it("Then it should log error Error occured while retrieving JWT Token", () => {
            expect(personalizationService.fxplogger.logError).toHaveBeenCalledWith('Fxp.PersonalizationService', "Error occured while retrieving JWT Token", '2603', null);
        });
        it("Then it should show message System Error has occurred. Please try again. If the problem persists, please contact IT support. ", () => {
            expect(personalizationService.fxpMessageSvc.addMessage).toHaveBeenCalledWith('System Error has occurred. Please try again. If the problem persists, please contact IT support.', 'error');
        });
        it("Then it should stop Stack Performance", () => {
            expect(personalizationService.fxplogger.stopTrackPerformance).toHaveBeenCalled();
        });

    });
    describe("When calling saveRoleGroupPersonalizedNavItems and no data is available", () => {
        var result;
        var savePersonalL0L1Data = {
            "result": [
                {
                    "isPersonalisationAllowed": true,
                    "children": [
                        {
                            "isPersonalisationAllowed": true,
                            "children": null,
                            "id": 16,
                            "displayName": "Skill Assessment",
                            "hasChildren": false,
                            "sortOrder": 1,
                            "parentId": 15
                        }
                    ],
                    "id": 15,
                    "displayName": "Profile",
                    "hasChildren": true,
                    "sortOrder": 3,
                    "parentId": 0
                }
            ]
        };
        beforeEach(function () {
            $httpBackend.expectPOST("https://fxpservicesapidev.azurewebsites.net/api/v1/roleGroup/1/leftNav/personalization", savePersonalL0L1Data)
                .respond(500, "", {}, "Service Failed");
            personalizationService.saveRoleGroupPersonalizedNavItems(1, 73, savePersonalL0L1Data).then(function (response) {
                result = response.data;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should throw Service Failed while Saving Personalized Navigation details such as L0 and L1's", () => {
            expect(result.status).toEqual(500);
            expect(result.statusText).toEqual("Service Failed");
        });
    });
});