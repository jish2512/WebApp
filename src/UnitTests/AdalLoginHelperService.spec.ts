import {AdalLoginHelperService} from '../js/services/AdalLoginHelperService';
declare var angular:any;
describe("Given AdalLoginHelperService UT Suite", function () {

    var $q;
    var resource;
    var adal;
    var adalLoginHelperService;
    var endpoint;
 

    beforeEach(angular.mock.module("FxpUtils"));

    beforeEach(function () {
        var AuthenticationContext = function (a) {
            var obj;
            return {     
                 obj : {
                    'CONSTANTS': 'constants',
                    'REQUEST_TYPE': 'requestType'
                 }           
            }
        };   

        angular.mock.module(function ($provide) {
            $provide.service("$resource", function () {
              
            }); 

            $provide.service("adalAuthenticationService", function () {
                this.config =  {
                    'instance': 'instance',
                    'tenant': 'tenant',
                    'clientId': 'clientId',
                    'endpoints': {
                        endpoint: 'endpoints'
                    }
                }
            });                     
        });   
    });


    beforeEach(angular.mock.inject(function (_$q_, adalAuthenticationService, $resource,   AdalLoginHelperService) {
        $q = _$q_;      
        resource = "https://microsoft.onmicrosoft.com/FXPCouchBaseAPI";       
        adal = new AuthenticationContext(adalAuthenticationService.config);     
        adalLoginHelperService = AdalLoginHelperService;     
        endpoint = "https://oneprofiledevapi.azurewebsites.net";
    }));

    describe("When invoking accessTokenRequestInProgress method if token is cached", () => {
        var result;
        beforeEach(function () {

            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "abc";
            });

            adal._getItem = jasmine.createSpy("_getItem").and.callFake(function (a) {
                return "abc";
            });

            adal.getCachedToken = jasmine.createSpy("getCachedToken").and.callFake(function (a) {
                return "abc";
            });
            result = adalLoginHelperService.accessTokenRequestInProgress(endpoint);
        })

        it('Then it should return false', function () {            
            expect(result).toEqual(false);    
        });

        it('Then getResourceForEndpoint method of adal service should have been called', function () {                       
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(endpoint);           
        });

        it('Then _getItem method of adal service should have been called', function () {            
            expect(adal._getItem).toHaveBeenCalledWith('adal.token.keys');         
        });

        it('Then getCachedToken method of adal service should have been called', function () {           
            expect(adal.getCachedToken).toHaveBeenCalledWith('abc');
        });



    });   

    describe("When invoking accessTokenRequestInProgress method if token is not cached", () => {     
        var result;
        beforeEach(function () {
            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "Tue May 23 2014 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2015 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2017 19:12:59 GMT+0530 (India Standard Time) GMT:;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT";
            });

            adal._getItem = jasmine.createSpy("_getItem").and.callFake(function (a) {
                return "Tue May 23 2014 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2015 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2017 19:12:59 GMT+0530 (India Standard Time) GMT:;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT";
            });

            adal.getCachedToken = jasmine.createSpy("getCachedToken").and.callFake(function (a) {
                return null;
            });    
            result = adalLoginHelperService.accessTokenRequestInProgress(endpoint);
        })

        //it('Then it should return  true', function () {             
        //    expect(result).toEqual(true);              
        //});

        it('Then getResourceForEndpoint method of adal service should have been called', function () {
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(endpoint);
        });

        it('Then _getItem method of adal service should have been called', function () {
            expect(adal._getItem).toHaveBeenCalledWith('adal.token.keys');
        });

        it('Then getCachedToken method of adal service should have been called', function () {           
            expect(adal.getCachedToken).toHaveBeenCalledWith('Tue May 23 2014 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2015 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2017 19:12:59 GMT+0530 (India Standard Time) GMT:;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT');
        });
        
    });

    describe("When invoking isTokenRetrievalStarted method if _getItem method of adal returns null", () => {
        var result;
        beforeEach(function () {
            adal._getItem = jasmine.createSpy("_getItem").and.callFake(function (a) {
                return null;
            });
            result = adalLoginHelperService.isTokenRetrievalStarted(resource);
        })

        it('Then it should return false', function () {                   
            expect(result).toEqual(false);          
        });

        it('Then _getItem method of adal service should have been called', function () {           
            expect(adal._getItem).toHaveBeenCalledWith('undefined' + resource);
        });
    });

    describe("When invoking isTokenRetrievalStarted method if we have log entries then current time is less than the 10 seconds advance to the last log entry", () => {   
        var result;
        beforeEach(function () {
            //pass proper date format
            adal._getItem = jasmine.createSpy("_getItem").and.callFake(function (a) {
                return "Tue May 23 2014 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2015 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2017 19:12:59 GMT+0530 (India Standard Time) GMT:;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT";
            });
            result = adalLoginHelperService.isTokenRetrievalStarted(resource);
        })

        //it('Then it should return true', function () {                                       
        //    expect(result).toEqual(true);       
        //});

        it('Then _getItem method of adal service should have been called', function () {
            expect(adal._getItem).toHaveBeenCalledWith('undefined' + resource);
        });
    });

    describe("When invoking isTokenRetrievalStarted method if we have log entries then current time is not less than the 10 seconds advance to the last log entry", () => {
        var result;
        beforeEach(function () {
            adal._getItem = jasmine.createSpy("_getItem").and.callFake(function (a) {
                return "Tue May 23 2014 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2015 19:12:59 GMT+0530 (India Standard Time) GMT;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT:;Tue May 23 2016 19:12:59 GMT+0530 (India Standard Time) GMT";
            });
            result = adalLoginHelperService.isTokenRetrievalStarted(resource);
        })

        it('Then it should return false', function () {
            expect(result).toEqual(false);
        });

        it('Then _getItem method of adal service should have been called', function () {
            expect(adal._getItem).toHaveBeenCalledWith('undefined' + resource);
        });
    });

    describe("When invoking getCachedToken method if the token is not cached", () => {
        var result;
        beforeEach(function () {
            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "xyz";
            });

            result = adalLoginHelperService.getCachedToken(resource);
        })

        it('Then it should return null', function () {           
            expect(result).toBeNull();            
        });

        it('Then getResourceForEndpoint method of adal service should have been called', function () {        
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(resource);
        });
    }); 
   
    describe("When invoking getCachedToken method if the token is cached", () => {
        var result;
        beforeEach(function () {
            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "xyz";
            });
            adal.getCachedToken = jasmine.createSpy("getCachedToken").and.callFake(function (a) {
                return "abcd";
            });  
            result = adalLoginHelperService.getCachedToken(resource);
        })   

        it('Then it should return cached token', function () {      
            expect(result).toEqual("abcd");           
        });

        it('Then getResourceForEndpoint method of adal service should have been called', function () {
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(resource);
        });

        it('Then getCachedToken method of adal service should have been called', function () {                     
            expect(adal.getCachedToken).toHaveBeenCalledWith('xyz');
        });
    }); 

    describe("When invoking acquireToken method if the token is not cached", () => {
        var startTime, endTime;
        beforeEach(function () {

            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "abc";
            });

            adal.acquireToken = jasmine.createSpy("acquireToken").and.callFake(function (a, b) {
                return "abc";
            });

            adal.getCachedToken = jasmine.createSpy("getCachedToken").and.callFake(function (a) {
                return null;
            });
            startTime = new Date().getTime();
            adalLoginHelperService.acquireToken(resource);
            endTime = new Date().getTime();
        })

        it('Then it should  wait for one second', function () {
            expect(endTime).toBeGreaterThan(startTime + 999);
        });
        
        it('Then getResourceForEndpoint method of adal service should have been called', function () {
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(resource);
        });

        it('Then acquireToken method of adal service should have been called', function () {
            expect(adal.acquireToken).toHaveBeenCalledWith('abc', undefined);
        });
        
        it('Then getCachedToken method of adal service should have been called', function () {   
            expect(adal.getCachedToken).toHaveBeenCalledWith('abc');
        });
    });

    describe("When invoking acquireToken method if the token is cached", () => {
        var startTime, endTime;
        beforeEach(function () {
            adal.getResourceForEndpoint = jasmine.createSpy("getResourceForEndpoint").and.callFake(function (a) {
                return "abc";
            });

            adal.acquireToken = jasmine.createSpy("acquireToken").and.callFake(function (a,b) {
                return "abc";
            });

            adal.getCachedToken = jasmine.createSpy("getCachedToken").and.callFake(function (a) {
                return "xyz";
            });  
            startTime = new Date().getTime();
            adalLoginHelperService.acquireToken(resource);
            endTime = new Date().getTime();
        })          

        it('Then it should not wait for one second', function () {
            expect(endTime).toBeLessThan(startTime + 1000);                
        });
        it('Then getResourceForEndpoint method of adal service should have been called', function () {
            expect(adal.getResourceForEndpoint).toHaveBeenCalledWith(resource);          
        });
        it('Then acquireToken method of adal service should have been called', function () {
            expect(adal.acquireToken).toHaveBeenCalledWith('abc', undefined);
        });
        it('Then getCachedToken method of adal service should have been called', function () {          
            expect(adal.getCachedToken).toHaveBeenCalledWith('abc');
        });
    });

});