/// <reference path="../typings/jasmine.d.ts" />
import { } from 'jasmine';
//import * as angular from "angular";
import { UserInfoService } from '../js/services/UserInfoService';
declare var angular: any;

describe("Given UserInfoService", () => {
    var userInfoService
    beforeEach(angular.mock.module('FxPApp'));

	beforeEach(angular.mock.inject(function (UserInfoService) {
        userInfoService = UserInfoService;
    }));

    describe("When we call the  getCurrentUser of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setCurrentUser("v-ffsd");
            result = userInfoService.getCurrentUser();
        })
        it("Then it should return current User on getCurrentUser call", function () {
            expect(result).toEqual("v-ffsd");
        });

        it("Then it should defined current User on getCurrentUser call", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call the  getCurrentUser with null of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setCurrentUser(null);
            result = userInfoService.getCurrentUser();
        })
        it("Then it should return current User null on getCurrentUser call", function () {
            expect(result).toBeNull();
        });
    });

    describe("When we call the  getLoggedInUser of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setLoggedInUser("v-asjhcadj");
            result = userInfoService.getLoggedInUser();
        })
        it("Then it should return LoggedInUser on getLoggedInUser call", function () {
            expect(result).toEqual("v-asjhcadj");
        });
        it("Then it should defined LoggedInUser on getLoggedInUser call", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call the  getLoggedInUser with null of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setLoggedInUser(null);
            result = userInfoService.getLoggedInUser();
        })
        it("Then it should return LoggedInUser on getLoggedInUser call", function () {
            expect(result).toBeNull();
        });
    });

    describe("When we call the  getCurrentUserUpn in OBO of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            spyOn(userInfoService, "setUpAjaxCallsHeaders").and.callThrough();
            spyOn(userInfoService, "isActingOnBehalfOf").and.returnValue(true);
            userInfoService.setCurrentUserUpn("v-aksk@microsoft.com");
            result = userInfoService.getCurrentUserUpn();
        })
        it("Then it should return CurrentUserUPN  in OBO on getCurrentUserUpn call", function () {
            expect(result).toEqual("v-aksk@microsoft.com");
        });

        it("Then it should be defined CurrentUserUPN  in OBO on getCurrentUserUpn call", function () {
            expect(result).toBeDefined();
        });
        it("Then it should call the setUpAjaxCallsHeaders method  in OBO", function () {
            expect(userInfoService.setUpAjaxCallsHeaders).toHaveBeenCalled();
        });
    });


    describe("When we call the  getCurrentUserUpn not in OBO of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            spyOn(userInfoService, "setUpAjaxCallsHeaders").and.callThrough();
            spyOn(userInfoService, "isActingOnBehalfOf").and.returnValue(false);
            userInfoService.setCurrentUserUpn("v-sdcsagd@microsoft.com");
            result = userInfoService.getCurrentUserUpn();
        })
        it("Then it should return CurrentUserUPN not in OBO on getCurrentUserUpn call", function () {
            expect(result).toEqual("v-sdcsagd@microsoft.com");
        });

        it("Then it should be defined CurrentUserUPN not in OBO on getCurrentUserUpn call", function () {
            expect(result).toBeDefined();
        });
        it("Then it should call the setUpAjaxCallsHeaders method not in OBO", function () {
            expect(userInfoService.setUpAjaxCallsHeaders).toHaveBeenCalled();
        });
    });

    describe("When we call the  getLoggedInUserUpn of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setLoggedInUserUpn("v-aksk@microsoft.com");
            result = userInfoService.getLoggedInUserUpn();
        })
        it("Then it should return LoggedInUserUPN on getLoggedInUserUpn call", function () {
            expect(result).toEqual("v-aksk@microsoft.com");
        });

        it("Then it should defined LoggedInUserUPN on getLoggedInUserUpn call", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call the  getLoggedInUserUpn with null of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.setLoggedInUserUpn(null);
            result = userInfoService.getLoggedInUserUpn();
        })
        it("Then it should return LoggedInUserUPN with null  on getLoggedInUserUpn call", function () {
            expect(result).toBeNull();
        });
    });

    describe("When we call the  getCurrentUserData with out OBO mode of the UserInfoService", function () {
        var result, userData;
        beforeEach(function () {
            sessionStorage.clear();
            userData = { "firstName": "Harvinder", "lastName": "Murali Krishna", "middleName": null, "fullName": "Harvinder Murali Krishna", "preferredFirstName": null }
            sessionStorage.setItem("v-soaa-userInfo", JSON.stringify(userData));
            userInfoService.loggedInUser = "v-soaa";
            userInfoService.currentUser = "v-soaa";
            result = userInfoService.getCurrentUserData();
        })
        it("Then it should return the loggedInUser Data", function () {
            expect(result).toEqual(userData);
        });

        it("Then it should be defined the loggedInUser Data", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call the  getCurrentUserData with OBO mode of the UserInfoService", function () {
        var result, userData;
        beforeEach(function () {
            sessionStorage.clear();
            userInfoService.loggedInUser = "v-soad";
            userInfoService.currentUser = "v-soaa";
            userData = { "firstName": "Harvinder", "lastName": "Murali Krishna", "middleName": null, "fullName": "Harvinder Murali Krishna", "preferredFirstName": null }
            userInfoService.setOBOUserSessionInfo(JSON.stringify(userData));
            result = userInfoService.getCurrentUserData();
        })
        it("Then it should return the OBOuser Data", function () {
            expect(result).toEqual(userData);
        });

        it("Then it should be defined the OBOuser Data", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call the  isActingOnBehalfOf of the UserInfoService", function () {
        var result;
        beforeEach(function () {
            userInfoService.loggedInUser = null;
            userInfoService.currentUser = null;
            result = userInfoService.isActingOnBehalfOf();
        })
        it("Then it should return false", function () {
            expect(result).toEqual(false);
        });

        it("Then it should return defined bool value", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When getCurrentUserContext method gets called", function () {
        var result;
        beforeEach(function () {  
            userInfoService.currentUser = 'testuser';
            sessionStorage['testuser-userInfo'] = '{"firstName":"test"}';
            sessionStorage['fxpUserClaims_testuser'] = '{"defaultAppRole":"TestRole"}';
            result = userInfoService.getCurrentUserContext();
        })
        it("Then userInfo and userClaims should be defined", function () {
            expect(result.userInfo).toBeDefined();
            expect(result.userClaims).toBeDefined();
        });       
    });
});