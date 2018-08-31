export class ChangeTabIndexByClassDirective implements angular.IDirective {
    static changeTabIndexByClass($timeout, $window): angular.IDirective {
        var directive = {
            restrict: 'A',
            link: link

        }
        return directive;
        function link(scope, elem, attr) {

            var changeTabIndexHandler = function(e) {
                changeTabIndex(scope, attr);
            };
            elem.on('click keydown keypress', changeTabIndexHandler);



            var resizeHandler = function() {
                scope.$apply(function() {
                    changeTabIndex(scope, attr);
                });
            }
            angular.element($window).bind('resize', resizeHandler);

            scope.$on('$destroy', function() {
                elem.off('click keydown keypress', changeTabIndexHandler);
                angular.element($window).unbind('resize', resizeHandler);
            });


            function changeTabIndex(scope, attr) {
                var attributes = scope.$eval(attr.changeTabIndexByClass);
                var className = attributes.className;
                var tabindex = attributes.tabindex;
                modifyTabindex(className, tabindex);
                $timeout(function() {
                    modifyTabindex(className, tabindex);
                }, 1000);
            };
            function modifyTabindex(className, tabindex) {
                $(className).attr('tabindex', tabindex);
            }
            changeTabIndex(scope, attr);
        };
    }
}
 

ChangeTabIndexByClassDirective.changeTabIndexByClass.$inject = ["$timeout", "$window"]
