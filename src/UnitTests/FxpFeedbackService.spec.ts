/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />

//to run the test from this file please execute it via specRunner and click on each specs individually to see the result.
//At present tests are throwing error when run together
import {FxpFeedbackService}from '../js/services/FxpFeedbackService';
declare var angular:any;
describe("Given FxpFeedbackService UT Suite", () => {
    var fxpFeedbackService, propBagValue, propBag, fxpLogger, userInfoService, fxpTelemetryContext, userProfileService, rootScope;
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

            $provide.service("UserInfoService", function () {
                this.getCurrentUserData = jasmine.createSpy("getCurrentUserData").and.callFake(function () {
                    return {
                        businessRole: "NonServiceUser",
                        roleGroupName: "NonServiceUser",
                        fullName: "MyName"
                    }
                });

                this.getCurrentUserUpn = jasmine.createSpy("getCurrentUserUpn").and.callFake(function () {
                    return "v-asfd@microsoft.com";
                });

                this.getLoggedInUser = jasmine.createSpy("getLoggedInUser").and.callFake(function () {
                    return "v-cccc@microsoft.com";
                });

                this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                    return true;
                });

                this.getLoggedInUserUpn = jasmine.createSpy("getLoggedInUserUpn").and.callFake(function () {
                    return "v-cccc@microsoft.com";
                });
            });

            $provide.service("FxpTelemetryContext", function () {
                this.getEnvironmentDetails = jasmine.createSpy("getEnvironmentDetails").and.callFake(function () {
                    return {
                        environmentName: "Dev",
                        program: "Fxp",
                        serviceOffering: "Feild Exprience",
                        serviceLine: "Fxp service"
                    }
                });
            });

            $provide.service("UserProfileService", function () {
                this.getBasicProfileByAlias = jasmine.createSpy("getBasicProfileByAlias").and.callFake(function () {
                    return {
                        then: function (callback) { return callback({ fullName: "MyName", businessRole: "NonServiceUser", roleGroupName: "NonServiceUser" }); }
                    }
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function (FxpLoggerService, _$rootScope_, UserInfoService, FxpTelemetryContext, UserProfileService, _FxpFeedbackService_) {
        fxpLogger = FxpLoggerService;
        userInfoService = UserInfoService;
        rootScope = _$rootScope_,
            fxpTelemetryContext = FxpTelemetryContext;
        userProfileService = UserProfileService
        fxpFeedbackService = _FxpFeedbackService_;
    }));

    describe("When calling logFeedbackInformation with feedbackInfo After API Success ", () => {
        beforeEach(function () {
            var userFeedbackInfo = {
                "type": "frown", "userId": "v-xxxx@microsoft.com", "feedbackText": "", "TotalDuration": "1231222.122",
                "tags": {
                    "ActionButtonType": "Click", "BusinessRole": "Non Services User",
                    "RoleGroupName": "Non Services User", "ScreenRoute": "Home", "GeoLocation": "167.220.238.149", "OBOUserUPN": "", "OBOUserBusinessRole": "",
                    "OBOUserRoleGroupName": ""
                }
            };
            var feedbackStatusInfo = "user feedback submission success";
            var status = "success";
            var error = null;
            fxpFeedbackService.logFeedbackInformation(userFeedbackInfo, feedbackStatusInfo, status, error);
        });

        it("Then it should log the userFeedbackInfo with success call", () => {
            expect(fxpFeedbackService.fxplogger.logInformation).toHaveBeenCalled();
        });
    });

    describe("When calling logFeedbackInformation with feedbackInfo After API with Failure ", () => {
        beforeEach(function () {
            var userFeedbackInfo = {
                "type": "frown", "userId": "v-xxxx@microsoft.com", "feedbackText": "", "TotalDuration": "1231222.122",
                "tags": {
                    "ActionButtonType": "Click", "BusinessRole": "Non Services User",
                    "RoleGroupName": "Non Services User", "ScreenRoute": "Home", "GeoLocation": "167.220.238.149", "OBOUserUPN": "",
                    "OBOUserBusinessRole": "", "OBOUserRoleGroupName": ""
                }
            };
            var feedbackStatusInfo = "user feedback submission success";
            var status = "error";
            var error = "Api call Failed";
            fxpFeedbackService.logFeedbackInformation(userFeedbackInfo, feedbackStatusInfo, status, error);
        });

        it("Then it should log the userFeedbackInfo with success call", () => {
            expect(fxpFeedbackService.fxplogger.logError).toHaveBeenCalled();
        });
    });

    describe("When calling setBrowserTitle from feedbackService ", () => {
        var setBrowserTitle, result;
        beforeEach(function () {
            setBrowserTitle = "TamDashBoard"
            spyOn(rootScope, '$broadcast').and.callThrough();
            result = fxpFeedbackService.setBrowserTitle(setBrowserTitle);
        });

        it("Then it should call addToFeedbackPropBag method", () => {
            expect(rootScope.$broadcast).toHaveBeenCalledWith("FeedbackContext")
        });
    });

    describe("When calling setScreenRoute from feedbackService ", () => {
        var screenRoute, result;
        beforeEach(function () {
            screenRoute = "Home"
            spyOn(rootScope, '$broadcast').and.callThrough();
            result = fxpFeedbackService.setScreenRoute(screenRoute);
        });

        it("Then it should call addToFeedbackPropBag method", () => {
            expect(rootScope.$broadcast).toHaveBeenCalledWith("FeedbackContext")
        });
    });

    describe("When calling getFeedbackPropBagItems from feedbackService ", () => {
        var screenRoute, result;
        beforeEach(function () {
            result = fxpFeedbackService.getFeedbackPropBagItems();
        });
        it("Then it should call getFeedbackPropBagItems method", () => {
            expect(result).not.toBeNull();
        });
    });

    describe("When calling setSubsctiptionId from feedbackService ", () => {
        var subsctiptionId, result;
        beforeEach(function () {
            subsctiptionId = "6546465465465"
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpFeedbackService.setSubscriprtionId(subsctiptionId);
            result = fxpFeedbackService.getSubscriprtionId();
        });

        it("Then it should call addToFeedbackPropBag method", () => {
            expect(rootScope.$broadcast).toHaveBeenCalledWith("FeedbackConfiguration")
        });

        it("Then it should call GetSubsctiptionId should not null method", () => {
            expect(result).not.toBeNull();
        });

        it("Then it should call GetSubsctiptionId should have data method", () => {
            expect(result).toBeDefined()
        });
    });

    describe("When calling getEnvironmentDetails from feedbackService ", () => {
        var result;
        beforeEach(function () {
            result = fxpFeedbackService.getEnvironmentDetails();
        });

        it("Then it should call fxpTelemetryContext getEnvironmentDetails method", () => {
            expect(fxpTelemetryContext.getEnvironmentDetails).toHaveBeenCalled();
        });

        it("Then it should call fxpTelemetryContext method", () => {
            expect(result).toBeDefined();
        });
    });

    describe("When calling setFeedbackEndpoint from feedbackService ", () => {
        var result, endpoint;
        beforeEach(function () {
            endpoint = "https://google.com"
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpFeedbackService.setFeedbackEndpoint(endpoint);
            result = fxpFeedbackService.getFeedbackEndpoint();
        });

        it("Then it should call broadcast function", () => {
            expect(rootScope.$broadcast).toHaveBeenCalled();
        });

        it("Then it shouldnot eturn not null data", () => {
            expect(result).toBeDefined();
        });
    });

    describe("When calling setFeedbackEndpoint from feedbackService ", () => {
        var result, userId;
        beforeEach(function () {
            userId = "gcudasfy@gaha"
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpFeedbackService.setUserId(userId);
            result = fxpFeedbackService.getUserID();
        });

        it("Then it should return not null data", () => {
            expect(result).toBeDefined();
        });
    });

    describe("When calling setSubscriprtionId from feedbackService ", () => {
        var result, subscriprtionId;
        beforeEach(function () {
            subscriprtionId = "65465465465464"
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpFeedbackService.setSubscriprtionId(subscriprtionId);
            result = fxpFeedbackService.getSubscriprtionId();
        });

        it("Then it should return not null data", () => {
            expect(result).toBeDefined();
        });
    });

    describe("When calling setFeedbackItemCollection and getFeedbackItemCollection from feedbackService ", () => {
        var itemcollection, result;
        beforeEach(function () {
            itemcollection = [{ Icon: "Somevalue" }]
            spyOn(rootScope, '$broadcast').and.callThrough();
            fxpFeedbackService.setFeedbackItemCollection(itemcollection);
            result = fxpFeedbackService.getFeedbackItemCollection()
        });

        it("Then it should call $broadcast", () => {
            expect(rootScope.$broadcast).toHaveBeenCalled();
        });

        it("Then it should call getFeedbackItemCollection method", () => {
            expect(result).toBeDefined();
        });
    });

    describe("When calling setFeedbackServiceProperties from feedbackService ", () => {
        var result, usersDetails;
        beforeEach(function () {
            usersDetails = {
                businessRole: "NonServiceUser",
                roleGroupName: "NonServiceUser",
                fullName: "MyName"
            }
            spyOn(fxpFeedbackService, "getEnvironmentDetails").and.callThrough();
            spyOn(fxpFeedbackService, "addFeedbackPropBagRange").and.callThrough()
            spyOn(fxpFeedbackService, "removeFeedbackPropBagRange").and.callThrough()
            result = fxpFeedbackService.setFeedbackServiceProperties(usersDetails);
        });

        it("Then it should call removeFeedbackPropBagRange method", () => {
            expect(fxpFeedbackService.removeFeedbackPropBagRange).toHaveBeenCalled();
        });

        it("Then it should call addFeedbackPropBagRange method", () => {
            expect(fxpFeedbackService.addFeedbackPropBagRange).toHaveBeenCalledWith(usersDetails);
        });
    });

    describe("When calling setUserDetailsToFeedback from feedbackService ", () => {
        var result, usersDetails;
        beforeEach(function () {
            spyOn(fxpFeedbackService, "setFeedbackServiceProperties").and.callThrough();
            result = fxpFeedbackService.setUserDetailsToFeedback();
        });

        it("Then it should call getBasicProfileByAlias method", () => {
            expect(userProfileService.getBasicProfileByAlias).toHaveBeenCalled();
        });

        it("Then it should call getCurrentUserData method", () => {
            expect(userInfoService.getCurrentUserData).toHaveBeenCalled();
        });

        it("Then it should call getCurrentUserUpn method", () => {
            expect(userInfoService.getCurrentUserUpn).toHaveBeenCalled();
        });

        it("Then it should call setFeedbackServiceProperties method", () => {
            expect(fxpFeedbackService.setFeedbackServiceProperties).toHaveBeenCalled();
        });
    });
});

