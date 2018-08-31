import {AdminLandingService} from '../js/services/AdminLandingService';
declare var angular:any;
describe("Given AdminLandingService UT Suite", () => {
    var $httpBackend, $q, $rootScope, timeout, fxpConfigurationService, fxploggerService, adalLoginHelperService, $base64, fxpMessageService, adminLandingService, fxpUIConstants, $timeoutSpy, $serviceIntervalSpy,userProfileService;
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
            $provide.service("FxpLoggerService", function () {
                this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                    return  propBag();
                });
                this.logInformation = jasmine.createSpy("logInformation").and.callFake(function (a, b) {
                    console.log('logInformation : ' + a + ',' + b);
                });

                this.logError = jasmine.createSpy("logError").and.callFake(function (a, b, c, d, e) {
                    console.log('logError : ' + a + ',' + b + ',' + c + ',' + d);
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
            $provide.service("$base64", function () {
                this.encode = jasmine.createSpy("encode").and.callFake(function (a, b) {
                    return {
                        then: function (callback) { return callback("T25lUHJvZmlsZS5Qcm9maWxlQWRtaW4sT25lUHJvZmlsZS5SZXNvdXJjZVByb2ZpbGVSZWFkZXIsR2xvYmFsUmVzb3VyY2VNYW5hZ2VtZW50LkFkbWluLEdsb2JhbFJlc291cmNlTWFuYWdlbWVudC5SZXF1ZXN0b3IsR2xvYmFsUmVzb3VyY2VNYW5hZ2VtZW50LlJlc291cmNlLEZpZWxkRXhwcmllbmNlLkZ4UEFkbWluLEZpZWxkRXhwcmllbmNlLkZYUFNFLEZpZWxkRXhwcmllbmNlLkxlZnROYXZBZG1pbixGaWVsZEV4cHJpZW5jZS5PQk9BZG1pbg=="); }
                    }
                });
            });

            $provide.service("FxpMessageService", function () {
                this.addMessage = jasmine.createSpy("addMessage").and.callFake(function (a, b) {
                    console.log(a + '' + b);
                });
            });
            $provide.service("UserProfileService", function () {
                this.getCalimsSvc = jasmine.createSpy("getCalimsSvc").and.callFake(function () {
                    return {
                        then: function (callback) {
                            return callback({
                                'Alias': 'radasg@microsoft.com',
                                'Applications': '{"FieldExprience":{"ApplicationName":"FieldExprience","Roles":{"LeftNavAdmin":{"RoleName":"LeftNavAdmin","Permissions":[{"ResourceName":"AppSettings","ResourceOperation":"Read"},{"ResourceName":"AppSettings","ResourceOperation":"Write"},{"ResourceName":"LeftNav","ResourceOperation":"Read"},{"ResourceName":"LeftNav","ResourceOperation":"Write"},{"ResourceName":"UserGroupSettings","ResourceOperation":"Read"},{"ResourceName":"UserGroupSettings","ResourceOperation":"Write"},{"ResourceName":"UserSettings","ResourceOperation":"Read"},{"ResourceName":"UserSettings","ResourceOperation":"Write"}]},"FXPSE":{"RoleName":"FXPSE","Permissions":[{"ResourceName":"LeftNav","ResourceOperation":"Read"},{"ResourceName":"SystemMessages","ResourceOperation":"Delete"},{"ResourceName":"SystemMessages","ResourceOperation":"Read"},{"ResourceName":"SystemMessages","ResourceOperation":"Write"}]},"FxPAdmin":{"RoleName":"FxPAdmin","Permissions":[{"ResourceName":"FxPAdmin","ResourceOperation":"DefaultAction"}]},"OBOAdmin":{"RoleName":"OBOAdmin","Permissions":[{"ResourceName":"OBOAdmin","ResourceOperation":"DefaultAction"}]}}}}'

                            });
                        }
                    }
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$q_, _$rootScope_,  FxpConfigurationService, _$timeout_, FxpLoggerService, AdalLoginHelperService, _$base64_, FxpMessageService,UserProfileService, _AdminLandingService_) {
                $httpBackend = _$httpBackend_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $rootScope.fxpUIConstants = fxpUIConstants;
                fxpConfigurationService = FxpConfigurationService;
                timeout = _$timeout_;
                fxploggerService = FxpLoggerService;
                adalLoginHelperService = AdalLoginHelperService;
                $base64 = _$base64_;
                fxpMessageService = FxpMessageService;
                userProfileService = UserProfileService;
                adminLandingService = _AdminLandingService_;
                $timeoutSpy = jasmine.createSpy('$timeout', _$timeout_).and.callThrough();
                $serviceIntervalSpy = jasmine.createSpy('$timeout', adminLandingService.timeout).and.callThrough();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 550000
            }));


            describe("When GetAdminDataFromServer method gets called", () => {
                var result;
                var adminTilesData = {
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
                };
                beforeEach(function () {
                    var fxpServiceEndPoint = fxpConfigurationService.FxpAppSettings.fxpServiceEndPoint;
                    var url = fxpServiceEndPoint + "/adminTiles/";
                    $httpBackend.expectGET(url)
                        .respond(200, adminTilesData);
                    adminLandingService.fxpServiceEndPoint = fxpServiceEndPoint;
                    adminLandingService.GetAdminDataFromServer().then(function (response) {
                        result = response;
                    }).catch(function (ex) {
                        result = ex;
                    });
                    $httpBackend.flush();
                });
                it("Then it should return admin tiles data", () => {
                    expect(result.data).toEqual(adminTilesData);
                });
                it("Then startTrackPerformance of fxploggerService should have been called ", () => {
                    expect(fxploggerService.startTrackPerformance).toHaveBeenCalledWith("GetAdminDataFromServer");
                });
                it("Then logInformation of fxploggerService should have been called ", () => {
                    expect(fxploggerService.logInformation).toHaveBeenCalledWith('Fxp.AdminLandingService', 'getAdminDataFromServer');
                });
    });



     
});
   