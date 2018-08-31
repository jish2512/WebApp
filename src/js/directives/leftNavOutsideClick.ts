export class LeftNavOutsideClickDirective implements angular.IDirective {
    static leftNavOutsideClick($rootScope, $document, $parse): angular.IDirective {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {


                if ($parse(attr.leftNavOutsideClick)($scope)) {
                    var outSideClickHandler = function($event) {
                        var el = $($event.target).closest(".leftBar");
                        $(".expandedtooltip").hide();
                        if (el.length === 0) {
                            if ($rootScope.isLeftNavOpen && !$rootScope.isLeftNavPinned) {
                                $rootScope.$apply(function() {
                                    $rootScope.isLeftNavOpen = false;
                                });
                            }
                        }
                    };

                    $document.bind('click', outSideClickHandler);
                    $scope.$on('$destroy', function() {
                        $document.unbind('click', outSideClickHandler);
                    });
                }
            }
        };
    }
}
