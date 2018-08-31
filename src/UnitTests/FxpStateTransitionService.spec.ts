/// <reference path="../typings/jasmine.d.ts" />

import { FxpConstants } from "../js/common/ApplicationConstants";
import { FxpStateTransitionService } from "../js/services/FxpStateTransitionService";

declare var angular: any;
describe('Given FxpStateTransitionService Suite', function () {
    var injector, state, fxpStateTransitionService;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("$injector", function () {
                this.get = jasmine.createSpy("get").and.callFake(function (a) {
                    return {
                        onStart: function (a, b) { },
                        onSuccess: function (a, b) { },
                        onError: function (a, b) { },
                        onInvalid: function (a, b) { }
                    };
                });
            });
            $provide.service("$state", function () {
                this.onInvalid = jasmine.createSpy("onInvalid").and.callFake(function () {
                    console.log('onInvalid');
                });
            });
        });
    });

    beforeEach(angular.mock.inject(function ($injector, $state, FxpStateTransitionService) {
        injector = $injector;
        state = $state;
        fxpStateTransitionService = FxpStateTransitionService;
    }));   

    describe("When onStateChangeStart method gets invoked", function () {
        var toState;
        beforeEach(function () {
            var transition = {
                to: function(){return {name: 'Dashboard'}},
                params: function(a){return {alias: 'Test1'}},
                from: function(){return {name: 'Home'}},
                error: function(){return undefined}
            }
            fxpStateTransitionService.onStateChangeStart((item)=>{
                toState = item.toState;
            });
            fxpStateTransitionService.onStartStateChangeHandler(transition);
        });
        it('Then toState value should be defined', function () {
            expect(toState.name).toEqual('Dashboard');
        });
    });

    describe("When onStateChangeSuccess method gets invoked", function () {
        var toState;
        beforeEach(function () {
            var transition = {
                to: function(){return {name: 'Dashboard'}},
                params: function(a){return {alias: 'Test1'}},
                from: function(){return {name: 'Home'}},
                error: function(){return undefined}
            }
            fxpStateTransitionService.onStateChangeSuccess((item)=>{
                toState = item.toState;
            });
            fxpStateTransitionService.onSuccessStateChangeHandler(transition);
        });
        it('Then toState value should be defined', function () {
            expect(toState.name).toEqual('Dashboard');
        });
    });

    describe("When onStateChangeFailure method gets invoked", function () {
        var item;
        beforeEach(function () {
            var transition = {
                to: function(){return {name: 'Dashboard'}},
                params: function(a){return {alias: 'Test1'}},
                from: function(){return {name: 'Home'}},
                error: function(){return 'transition was ignored'}
            }
            fxpStateTransitionService.onStateChangeFailure((response)=>{
                item = response;
            });
            fxpStateTransitionService.onErrorStateChangeHandler(transition);
        });
        it('Then item.error should be defined', function () {
            expect(item.error).toEqual('transition was ignored');
        });
    });

    describe("When onStateNotFound method gets invoked", function () {
        var toState, fromState;
        beforeEach(function () {
            toState = {name: 'Test'};
            fromState = {name: 'Home'};           
            fxpStateTransitionService.onStateNotFound((item)=>{
                toState = item.toState;
            });
            fxpStateTransitionService.onInvalidStateHandler(toState, fromState, injector);
        });
        it('Then toState value should be defined', function () {
            expect(toState.name).toEqual('Test');
        });
    });
    
    describe("When getStateInfo method gets called with transition ", function () {
        var result;
        beforeEach(function () {
            var transition = {
                to: function(){return {name: 'Dashboard'}},
                params: function(a){return {alias: 'Test1'}},
                from: function(){return {name: 'Home'}},
                error: function(){return undefined}
            }
            result = fxpStateTransitionService.getStateInfo(transition);
        });
        it('Then it should return the object with state details', function () {
            expect(result.toState).toBeDefined();
        });
    });
});