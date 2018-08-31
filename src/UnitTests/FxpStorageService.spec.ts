
import {FxpStorageService} from '../js/services/FxpStorageService';
declare var angular:any;
describe("Given FxpStorageService UT Suite", () => {
    var window, fxpStorageService, storageKey, storageValue;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(function () {
        storageKey = "alias-breadcrumb";
        storageValue = [{
            displayName: 'User Lookup Personalization',
            href: '#/userlookuppersonalization'
        },
            {
                displayName: 'Left Nav Personalization',
                href: '#/leftnavpersonalization'
            }];
    })
    beforeEach(angular.mock.inject(function (_$window_, _FxpStorageService_) {
        window = _$window_;
        fxpStorageService = _FxpStorageService_;
    }))
    describe("When saveInLocalStorage method gets called", () => {
        beforeEach(function () {
            fxpStorageService.saveInLocalStorage(storageKey, storageValue);
        });
        it("Then localStorage should be updated with given key and value", () => {
            expect(localStorage[storageKey]).toEqual(JSON.stringify(storageValue));
        });
    });

    describe("When getFromLocalStorage method gets called", () => {
        var result;
        beforeEach(function () {
            result = fxpStorageService.getFromLocalStorage(storageKey);
        });
        it("Then it will return value of requested key from localStorage", () => {            
            expect(result).toEqual(storageValue);
        });
    });
    describe("When deleteFromLocalStorage method gets called", () => {
        var result;
        var tempStorageKey = "tempStorageKey";
        beforeEach(function () {
            localStorage[tempStorageKey] = "TempValue";
            fxpStorageService.deleteFromLocalStorage(tempStorageKey);
        });
        it("Then tempStorageKey value should be delete from localStorage", () => {
            expect(localStorage[tempStorageKey]).not.toBeDefined();
        });
    });
})