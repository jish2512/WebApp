import {FxpComponentDirectives} from '../js/directives/fxpItems.directive';
declare var angular:any;
describe("FXPComponents directive", function () {
    var rootScope, scope, deviceFactory, $templateCache, $compile;
    beforeEach(angular.mock.module('FXPComponents'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {
            $provide.service("DeviceFactory", function () {
                this.isMobile = jasmine.createSpy("setCurrentUser").and.callFake(function () {
                    return true;
                });
            });
        });
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, _$templateCache_, DeviceFactory, _$compile_) {
        rootScope = _$rootScope_;
        $templateCache = _$templateCache_;
        scope = _$rootScope_.$new();
        deviceFactory = DeviceFactory;
        $compile = _$compile_;
    }));
    //fxpleftnavigation
    describe("When fxpleftnavigation is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/leftnavigation.html", "<div>fxpleftnavigation</div>");
            element = $compile(angular.element('<fxpleftnavigation></fxpleftnavigation>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpleftnavigation</div>');
        });
    });
    //fxpheader
    describe("When fxpheader is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxpheader.html", "<div>fxpheader</div>");
            element = $compile(angular.element('<fxpheader></fxpheader>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpheader</div>');
        });
    });
    //footer
    describe("When footer is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/footer.html", "<div>fxpfooter</div>");
            element = $compile(angular.element('<fxpfooter></fxpfooter>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpfooter</div>');
        });
    });
    //fxpmessage
    describe("When fxpmessage is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxpmessage.html", "<div>fxpmessage</div>");
            element = $compile(angular.element('<fxpmessage></fxpmessage>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpmessage</div>');
        });
    });
    //actobo-header
    describe("When actobo-header is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/actobo-header.html", "<div>actOboHeader</div>");
            element = $compile(angular.element('<act-obo-header></act-obo-header>'))(scope);
            var compiledelem = $compile(element)(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>actOboHeader</div>');
        });
    });
    //pageLoader
    describe("When pageLoader is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/pageLoader.template.html", "<div>pageLoader</div>");
            element = $compile(angular.element('<page-loader></page-loader>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('pageLoader');
        });
    });
    //fxpbreadcrumb
    describe("When fxpbreadcrumb is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxpbreadcrumb.html", "<div>fxpbreadcrumb</div>");
            element = $compile(angular.element('<fxpbreadcrumb></fxpbreadcrumb>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpbreadcrumb</div>');
        });
    });
    //fxphelpmenu
    describe("When fxphelpmenu is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxphelpmenu.html", "<div>fxphelpmenu</div>");
            element = $compile(angular.element('<fxphelpmenu></fxphelpmenu>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxphelpmenu</div>');
        });
    });
    //fxpnotification
    describe("When fxpnotification is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxpnotification.html", "<div>fxpnotification</div>");
            element = $compile(angular.element('<fxpnotification></fxpnotification>'))(scope);
            var compiledelem = $compile(element)(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxpnotification</div>');
        });
    });
    //fxpsystemupdatemsg
    describe("When fxpsystemupdatemsg is loaded", function () {
        var element;
        beforeEach(function () {
            $templateCache.put("bundles/templates/system-update-msg-banner.html", "<div>system-update-msg-banner</div>");
            element = $compile(angular.element('<fxpsystemupdatemsg></fxpsystemupdatemsg>'))(scope);
            scope.$digest();
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>system-update-msg-banner</div>');
        });
    });
});
 
describe("FXPComponents directive for ToastNotificationController", function () {
    var rootScope, scope, deviceFactory, $templateCache, $compile;
    beforeEach(angular.mock.module('FXPComponents'));
    beforeEach(function () {
        angular.mock.module(function ($provide, $controllerProvider) {
            $controllerProvider.register('ToastNotificationController', function ($scope) {
            });
            $provide.service("DeviceFactory", function () {
                this.isMobile = jasmine.createSpy("setCurrentUser").and.callFake(function () {
                    return true;
                });
            });
        });
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, _$templateCache_, DeviceFactory, _$compile_) {
        rootScope = _$rootScope_;
        $templateCache = _$templateCache_;
        scope = _$rootScope_.$new();
        deviceFactory = DeviceFactory;
        $compile = _$compile_;
    }));
    describe("When fxptoastnotification is loaded", function () {
        var element,controller;
        beforeEach(function () {
            $templateCache.put("bundles/templates/fxptoastnotification.html", "<div>fxptoastnotification</div>");
            element = $compile(angular.element('<fxptoastnotification></fxpleftnavigation>'))(scope);
            scope.$digest();
            controller = element.controller;
        });
        it('then directive should compile and give html data ', function () {
            expect(element[0].innerHTML).toContain('<div>fxptoastnotification</div>');
        });
    });
});