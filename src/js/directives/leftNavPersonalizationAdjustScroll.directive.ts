export class LeftNavPrsonalizationAdjustScrollDirective implements angular.IDirective {
    static leftNavPrsonalizationAdjustScroll(): angular.IDirective {
        return {
            restrict: 'A',

            link: function(scope, elem, attr) {
                var focusEventHandler = function($event) {
                    $(".partner-app").scrollLeft(0);
                };
                elem.bind("focus", focusEventHandler);
                scope.$on('$destroy', function() {
                    elem.unbind("focus", focusEventHandler);
                });
            }
        };
    }
}
