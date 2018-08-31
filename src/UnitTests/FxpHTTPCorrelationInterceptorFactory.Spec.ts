import {httpCorrelationInterceptor,httpRetryInterceptor} from '../js/factory/FxpHttpInterceptorFactory'
import { CommonUtils } from '../js/utils/CommonUtils';
declare var angular:any;
describe("Given FxpHTTPCorrelationInterceptorFactory", function () { 
    (function ($) {
        var correlator = {
            getCorrelationId: function () {
                return "64f406ae-e0d7-4e20-97e0-e27774d4e534";
            }
        };
        $["correlator"] = correlator;
    })(jQuery);
    var userInfoService, fxpConfigurationService, fxpHttpCorrelationInterceptor, fxpLoggerService;  
    var configData = {
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "method": "GET",
        "url": "../../templates/pageLoader.template.html",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Authorization": "Bearer  "
        }
    };
    var isActingOnBehalf = false;



    // beforeEach(function () {
    //     angular.module('FxPApp');
    // });
    beforeEach(angular.mock.module("FxPApp", function ($provide) {
        $provide.service('UserInfoService', function () {
            this.getCurrentUserUpn = jasmine.createSpy("getCurrentUserUpn").and.callFake(function () {
                return "User456";
            });
            this.isActingOnBehalfOf = jasmine.createSpy("isActingOnBehalfOf").and.callFake(function () {
                return isActingOnBehalf;
            });
             this.getAADObjectID = jasmine.createSpy("getAADObjectID").and.callFake(function () {
                return "1234-123";
            });
        });
        $provide.service('FxpConfigurationService', function () {
            var config = {
                "FxpConfigurationStrings": {
                    "AdalAuthExcludeExtn": "\.(html?|js|css|gif|jpe?g|png|bmp)"
                }
            };
            this.FxpBaseConfiguration = config;
        });
        $provide.service('FxpLoggerService', function () {
            this.createPropertyBag = jasmine.createSpy("createPropertyBag").and.callFake(function () {
                return {
                    addToBag: jasmine.createSpy("addToBag").and.callFake(function (a, b) {
                        console.log('propbag =>' + a + ':' + b);
                    })
                };
            });
            this.logEvent = jasmine.createSpy("logEvent").and.callFake(function (a, b) {
                console.log('logEvent : ' + a + ',' + b);
            });
        });        
    }));
    beforeEach(angular.mock.inject(function (FxpHttpCorrelationInterceptor, UserInfoService,FxpLoggerService) {
        fxpHttpCorrelationInterceptor = FxpHttpCorrelationInterceptor;
        userInfoService = UserInfoService;
        fxpLoggerService = FxpLoggerService;
    }));
    describe("When we have request interceptor with ActingOnBehalf returning true ", function () {
        var responseConfig;
        var pattern="-/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i";
        beforeEach(function () {
            isActingOnBehalf = true;
            responseConfig = fxpHttpCorrelationInterceptor.request(configData);
        });
        it("Then it should update X-CorrelationId value of config data", function () {
            expect(responseConfig.headers["X-CorrelationId"]).toBeDefined(); 
        });
        it("Then it should call isActingOnBehalfOf Service", function () {
            expect(userInfoService.isActingOnBehalfOf).toHaveBeenCalled();
        });
        it("Then it should call getCurrentUserUpn Service method", function () {
            expect(userInfoService.getCurrentUserUpn).toHaveBeenCalled();
        });
        it("Then it should update X-ActonBehalfMode value of Config Data", function () {
            expect(responseConfig.headers["X-ActonBehalfMode"]).toBeDefined();
            expect(responseConfig.headers["X-ActonBehalfMode"]).toBe("true");

        });
        it("Then it should update XX-OnBehalfOfUsere value of Config Data", function () {
            expect(responseConfig.headers["X-OnBehalfOfUser"]).toBeDefined();
            expect(responseConfig.headers["X-OnBehalfOfUser"]).toBe("User456");

        });


    });
    describe("When we have request to interceptor with ActingOnBehalf returning false ",  () =>{
        var responseConfig;
        beforeEach(function () {
            configData.headers["X-ActonBehalfMode"] = undefined;
            configData.headers["X-OnBehalfOfUser"] = undefined;
            isActingOnBehalf = false;
            responseConfig = fxpHttpCorrelationInterceptor.request(configData);
        });
        it("Then it should update X-CorrelationId value of config data collection", function () {
            expect(responseConfig.headers["X-CorrelationId"]).toBeDefined();
        });
        it("Then it should call isActingOnBehalfOf Service and reutrn value as false", function () {
            expect(userInfoService.isActingOnBehalfOf).toHaveBeenCalled();

        });
        it("Then it should not call getCurrentUserUpn Service method", function () {
            expect(userInfoService.getCurrentUserUpn).not.toHaveBeenCalled();
        });
        it("Then it should not update X-ActonBehalfMode value of Config Data", function () {
            expect(responseConfig.headers["X-ActonBehalfMode"]).toBe(undefined);
        });
        it("Then it should not update XX-OnBehalfOfUsere value of Config Data", function () {
            expect(responseConfig.headers["X-OnBehalfOfUser"]).toBe(undefined);
        });
    });

});
