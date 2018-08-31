export function ScrollToTopDirective() {

    return {
        link: link,
        restrict: 'EA',
        template: '<button type="button" title="Go to top" class="scroll-to-top font-caption-alt">Back to top</button>'
    }
    function link(scope, $elm) {
        function scrollToTop() {
            angular.element('.partner-app > div, .fxp-body').animate({ scrollTop: '0px' }, "slow");
        }

        $elm.on('click', scrollToTop);
        scope.$on('$destroy', function() {
            $elm.off('click', scrollToTop);
        });
    }

}

