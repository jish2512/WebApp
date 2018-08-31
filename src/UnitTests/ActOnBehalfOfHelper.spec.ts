/// <chutzpah_reference path="../lib/jasmine-2.4.0/mock-ajax.js" />
import {ActOnBehalfOfHelper} from '../js/factory/ActOnBehalfOfHelper';
declare var angular:any;
describe("Given ActOnBehalfOfHelper", () => {
    var $rootScope, $httpBackend, $q, userProfileService, fxpLoggerService, fxpMessageService, adalAuthenticationService, fxpContextService, fxpTelemetryContext, userInfoService, deferred, fxpUIConstants, actOnBehalfOfHelper, propBagValue, propbag;
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
                    userInfo: { userName: "sfdsf" }
                }
            });
            $provide.service("FxpContextService", function () {
                
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
                this.isObo = jasmine.createSpy("isObo").and.callFake(function () {
                    return true;
                });
                this.setCurrentUser = jasmine.createSpy("setCurrentUser").and.callFake(function () {
                });
                this.getCalimsSvc = jasmine.createSpy("getCalimsSvc").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback(
                                {

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

                this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {
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
                    SelectedUserProfileInformation: {
                        ErrorMessage: "System Error. Unable to retrieve on behalf of user profile. Please try again",
                        ErrorMessageTitle: "Error while retriving Onbehlafof user infromation"
                    }
                }
            };
        });
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, _$httpBackend_, _$q_, UserProfileService, FxpLoggerService, FxpMessageService, adalAuthenticationService, FxpContextService, FxpTelemetryContext, UserInfoService, _ActOnBehalfOfHelper_) {
        $httpBackend = _$httpBackend_;
        userProfileService = UserProfileService;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $rootScope.fxpUIConstants = fxpUIConstants;
        fxpLoggerService = FxpLoggerService;
        adalAuthenticationService = adalAuthenticationService;
        fxpMessageService = FxpMessageService;
        fxpContextService = FxpContextService;
        fxpTelemetryContext = FxpTelemetryContext;
        userInfoService = UserInfoService;
        actOnBehalfOfHelper = _ActOnBehalfOfHelper_;
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    describe("When we call the getUserProfileAndClaims method", function () {
        var result;
        beforeEach(function () {
            var oboUserProfile = { Alias: "v-gagdf" };
            actOnBehalfOfHelper.getUserProfileAndClaims(oboUserProfile).then(function (response) {
                result = response;
            });
        })
        it("Then it should call getBasicProfile method with alias", function () {
            expect(userProfileService.getBasicProfile).toHaveBeenCalled();
        });

        it("Then it should call setCurrentUser method of userProfileService", function () {
            expect(userProfileService.setCurrentUser).toHaveBeenCalled();
        });

        it("Then it should call setOBOUserContext method of fxpLoggerService", function () {
            expect(fxpLoggerService.setOBOUserContext).toHaveBeenCalled();
        });

        it("Then it should call getCalimsSvc method of userProfileService", function () {
            expect(userProfileService.getCalimsSvc).toHaveBeenCalled();
        });
    });

    describe("When we call the getUserProfileAndClaims method with Exception", function () {
        var result;
        beforeEach(function () {
            var oboUserProfile = { Alias: "v-gagdf" };
            userProfileService.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                throw Error("getBasicProfile throwing error");
            });
            actOnBehalfOfHelper.getUserProfileAndClaims(oboUserProfile).then(function (response) {
                result = response;
            }).catch(function (ex) {
                result = ex;
            });
        })
        it("Then it should call addMessage method", function () {
            expect(fxpMessageService.addMessage).toHaveBeenCalledWith("System Error. Unable to retrieve on behalf of user profile. Please try again", "error");
        });
    });

    describe("When we call the getUserProfileAndClaims method with getBasicProfile Exception", function () {
        var result, error;
        var oboUserProfile = { Alias: "v-gagdf" };
        beforeEach(function () {
            userProfileService.getBasicProfile = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in getBasicProfile"
                };
                defer.reject(error);
                return defer.promise;
            });
        });
        it("Then it should call addMessage method", function () {
            actOnBehalfOfHelper.getUserProfileAndClaims(oboUserProfile).then(function (response) {
            }).catch(function (ex) {
                result = ex;
                expect(result.messege).toEqual('Error in getBasicProfile');
                expect(fxpMessageService.addMessage).toHaveBeenCalledWith("System Error. Unable to retrieve on behalf of user profile. Please try again", "error");
            });
        });
    });
    describe("When we call the getUserProfileAndClaims method with getCalimsSvc Exception", function () {
        var result, error;
        var oboUserProfile = { Alias: "v-gagdf" };
        beforeEach(function () {
            userProfileService.getCalimsSvc = jasmine.createSpy("getBasicProfile").and.callFake(function () {
                var defer = $q.defer();
                error = {
                    messege: "Error in getCalimsSvc"
                };
                defer.reject(error);
                return defer.promise;
            });
        })
        it("Then it should call addMessage method", function () {
            actOnBehalfOfHelper.getUserProfileAndClaims(oboUserProfile).then(function (response) {
            }).catch(function (ex) {
                result = ex;
                expect(result.messege).toEqual('Error in getCalimsSvc');
                expect(fxpMessageService.addMessage).toHaveBeenCalledWith("System Error. Unable to retrieve on behalf of user profile. Please try again", "error");
            });
        });
    });

    describe("When we call the getObOUserConfiguration  with valid Tenant Name", function () {
        var result;
        beforeEach(function () {
            var selectedUserData = { roleGroupId: 1, TenantName: "ES" };
            $httpBackend.expectGET("/Home/GetConfiguration/ES/1")
                .respond(200, { "result": { DominName: "Services" } });
            actOnBehalfOfHelper.getObOUserConfiguration(selectedUserData).then(function (response) {
                result = response.data.result;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then result should not be undefined", function () {
            expect(result).not.toBeUndefined();
            expect(result).toEqual({ DominName: "Services" });
        });
        it("Then result should not be null", function () {
            expect(result).not.toBeNull();
            expect(result).toEqual({ DominName: "Services" });
        });
    });

    describe("When we call the getObOUserConfiguration without valid Tenant Name", function () {
        var result;
        beforeEach(function () {
            var selectedUserData = { roleGroupId: 1, TenantName: null };
            $httpBackend.expectGET("/Home/GetConfiguration/-1/1")
                .respond(500, {}, "internal server Error");
            actOnBehalfOfHelper.getObOUserConfiguration(selectedUserData).then(function (response) {
                result = response.data.result;
            }).catch(function (ex) {
                result = ex
            });
            $httpBackend.flush();
        });
        it("Then it should call logEvent method", function () {
            expect(fxpLoggerService.logEvent).toHaveBeenCalledWith('Fxp.actOnBehalfofuser', "getObOUserConfiguration-TenantId not found", propbag)
        });
        it("Then it should return status 500", function () {
            expect(result.status).toEqual(500);
        })
    });

    describe("When we call getPropBag", function () {
        var result;
        beforeEach(function () {
            result = actOnBehalfOfHelper.getPropBag();
        })
        it("Then it result should be defined", function () {
            expect(result).toBeDefined();
        });
    });

    describe("When we call getMetricPropBag", function () {
        var result;
        beforeEach(function () {
            var startTime = new Date();
            var endTime = new Date();
            result = actOnBehalfOfHelper.getMetricPropBag(startTime, endTime);
        })
        it("Then it result should not Undefined", function () {
            expect(result).not.toBeUndefined();
        });
    });
})
