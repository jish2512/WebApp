export class LeftNavPersonalizationScreenReaderDirective implements angular.IDirective {
    static leftNavPersonalizationScreenReader(): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                var allMenuElements = $(".manage-personalization").find(".fxpTabbableElem");
                var ariaLabel = $(allMenuElements[0]).attr('aria-label');
                $(allMenuElements[0]).attr('aria-label', 'Use arrow keys to move through or expand collapse' + ariaLabel);
            }
        };
    }
}
