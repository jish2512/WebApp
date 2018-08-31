import {pageTourEventService} from '../js/services/pageTourEventService'
declare var angular:any;
describe("Given pageTourEventService", () => {
    var pageTourEventService, $rootScope, $scope, userProfileService,
         PageTourEventService ;
    beforeEach(angular.mock.module('FxPApp'));
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(() =>  {
        sessionStorage.clear();
        sessionStorage["alias-userInfo"] = "{ \"name\": \"test user\" }";
       
        angular.mock.module(function ($provide) {
            $provide.service('UserProfileService', function (){});
          
        })
    })
  beforeEach(angular.mock.inject(function (_$rootScope_, UserProfileService, _PageTourEventService_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        userProfileService = UserProfileService;
        PageTourEventService = _PageTourEventService_;
    }));

describe('When leftnav is NOT pinned and Pagetour-initialize event is broadcasted', function () {
        beforeEach(function () {
            $rootScope.isLeftNavOpen = false;
            $rootScope.isLeftNavPinned = false;
            PageTourEventService.init();
            $rootScope.$emit('pageTour-initialize');
        });
        it('-> leftnav should get pinned and open', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toEqual(true);
            expect($rootScope.isLeftNavOpen).toEqual(true);

        });
      
    });
    describe('When leftnav is pinned and Pagetour-initialize event is broadcasted', function () {
        beforeEach(function () {
            $rootScope.isLeftNavOpen = true;
            $rootScope.isLeftNavPinned = true;
            PageTourEventService.init();
            $rootScope.$emit('pageTour-initialize');
        });
        it('-> leftnav should be pinned and open', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toEqual(true);
            expect($rootScope.isLeftNavOpen).toEqual(true);
        });
    });
    describe('When pagetour close event is broadcasted when leftnav was pinned', function () {
        beforeEach(function () {
            PageTourEventService.currentLeftNavPinState = true;
            $rootScope.isLeftNavOpen = true;
            $rootScope.isLeftNavPinned = true;
            PageTourEventService.init();
            $rootScope.$emit('pageTour-Completed');
        });
        it('Then leftnav should be pinned', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toEqual(true);
            expect($rootScope.isLeftNavOpen).toEqual(true);
        });
    });

    describe('When pagetour close event is broadcasted when leftnav was not pinned', function () {
        beforeEach(function () {
            PageTourEventService.currentLeftNavPinState = false;
            $rootScope.isLeftNavOpen = true;
            $rootScope.isLeftNavPinned = true;
            PageTourEventService.init();
            $rootScope.$emit('pageTour-Completed');
        });
        it('Then leftnav should be pinned', function () {
            $scope.$apply();
            expect($rootScope.isLeftNavPinned).toEqual(false);
            expect($rootScope.isLeftNavOpen).toEqual(false);
        });
    });
});