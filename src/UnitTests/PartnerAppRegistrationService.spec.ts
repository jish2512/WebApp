import { PartnerAppRegistrationService } from "../js/services/PartnerAppRegistrationService";
import { IFxpAppContext } from "../js/interfaces/IFxpAppContext";
var angular2Module;

class testAppInstance {
    public getRoutes() {
        return [{name:'Test1', url:'/test1'}];
    }
    public getAngular2Modules() {
        return [angular2Module];
    }
}

describe("Given PartnerAppRegistrationService", () => {	
	beforeEach(function () {		
		window["appInsight"] = {
            trackEvent : jasmine.createSpy("logEvent").and.callFake(function (a, b, c) {                    
                console.log(a + ' - ' + b + '-' + c);
            }),
            trackException : jasmine.createSpy("trackException").and.callFake(function (a, b, c) {                    
                console.log(a + ' - ' + b + '-' + c);
            })
        };
        window["FxpAppSettings"] = {};
       
	});
	describe("When getRegisteredRoutes method gets called", () => {
        var result;
		beforeEach(function () {           
            PartnerAppRegistrationService.registerPartnerApp('TestApp', testAppInstance);
            let fxpAppContext: IFxpAppContext;
            result = PartnerAppRegistrationService.getRegisteredRoutes(fxpAppContext);
            
		});
		it("Then MyApp instance should be registered", () => {
			expect(result.length).toEqual(1);
		});
    });
    describe("When registerPartnerApp gets called with existed app name", () => {
        var result;
		beforeEach(function () {           
            spyOn(console, "error").and.callThrough();
            PartnerAppRegistrationService.registerPartnerApp('TestApp', testAppInstance);            
		});
		it("Then error should be logged", () => {
			expect(console.error).toHaveBeenCalledWith('Application name with TestApp is already registered.')
		});
    });	
    describe("When getRegisteredAngular2Modules method gets called", () => {
        var result;
		beforeEach(function () {           
            PartnerAppRegistrationService.registerPartnerApp('TestApp1', testAppInstance);            
            result = PartnerAppRegistrationService.getRegisteredAngular2Modules();
            
		});
		it("Then MyApp instance should be registered", () => {
			expect(result.length).toEqual(1);
		});
    });	
    describe("When getRegisterEndpoints method gets called", () => {
        var result;
		beforeEach(function () {           
            PartnerAppRegistrationService.registerEndpoints('xyz','123');            
            result = PartnerAppRegistrationService.getRegisterEndpoints();
            
		});
		it("Then it should return the registered endpoints", () => {
			expect(result['xyz']).toEqual('123');
		});
	});
});