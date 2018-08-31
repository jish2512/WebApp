import {fxpBreadcrumbLink} from '../js/directives/fxpBreadcrumbLink';
declare var angular :any;
describe("Given fxpBreadcrumbsLink Directive", () => {
    var $state, $rootScope, $scope, element, $compile, fxpBreadcrumbService;

    beforeEach(angular.mock.module('FxPApp'));
    //beforeEach(module('ui.router'));
    beforeEach(function () {
        angular.mock.module(function ($provide) {

            $provide.service("FxpBreadcrumbService", function () {
                this.logBreadcrumbTelemetryInfo = jasmine.createSpy("logBreadcrumbTelemetryInfo").and.callFake(function (a, b) {
                    console.log("BreadcrumbEventTye:" + a + ",BreadcrumbItem" + b);
                });

            });

        });
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, FxpBreadcrumbService) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        fxpBreadcrumbService = FxpBreadcrumbService;
    }));

    describe("When clicked on breadcrumb link and it has targetEventName", () => {
        beforeEach(function () {
            $scope.item = {
                "displayName": "Overview",
                "targetEventName": "getBasicProfileInformationRoute"
            };
            $rootScope.fxpBreadcrumb = [{ "displayName": "Dashboard", "href": "#/Home" }, { "displayName": "PageA", "href": "#/PageA" }, { "displayName": "PageB", "href": "#/PageB" }];
            $rootScope.$on('getBasicProfileInformationRoute', function (event) {
                $scope.success = true;
            });

            element = angular.element('<a fxp-breadcrumb-link breadcrumb-item="item"></a>');
            var compiledelem = $compile(element)($scope);
            compiledelem.triggerHandler('click');
            $scope.$digest();
        })

        it('Then it should invoke the function and $scope.success value should be true ', function () {
            expect($scope.success).toEqual(true);
        });
    })

})
