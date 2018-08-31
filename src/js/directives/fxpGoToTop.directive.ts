/* fxpGoToTop directive is used to scroll to top*/

export class FxpGoToTopDirective implements angular.IDirective {
    static fxpGoToTop(): angular.IDirective {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            let onClick = function() {
                if (attrs.parent) {
                    $(attrs.parent).scrollTop(0);
                }
                if (attrs.focuson) {
                    $(attrs.focuson).focus();
                }
            },
                cleanUp = function() {
                    element.off('click');
                };
            element.on('click', onClick);
            scope.$on('$destroy', cleanUp);
        }
    }
}