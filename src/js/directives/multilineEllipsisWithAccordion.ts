export class MultilineEllipsisWithAccordionDirective implements angular.IDirective {
    static multilineEllipsisWithAccordion($timeout, $rootScope): angular.IDirective {
        return {
            restrict: 'A',
            scope: {
                multilineEllipsisWithAccordion: "=",
                accordionExpandCollapse: "="
            },
            link: function(scope, elem, attr) {
                var accpdrionBtn,
                    applyMultiLineEllipsis = function() {
                        var divHeight = elem.outerHeight();
                        var getLastWordRegex = /\W*\s(\S)*$/;
                        var lineHeight;
                        var lines;

                        try {
                            lineHeight = parseInt($(elem).css('line-height'));
                            lines = Math.round(divHeight / lineHeight);
                            var actualText = elem.text();
                            $(elem).attr('text-before-ellipse', actualText);
                        } catch (e) {

                        }
                        if (lines > scope.multilineEllipsisWithAccordion) {
                            var containerHeight = lineHeight * scope.multilineEllipsisWithAccordion + 1;
                            while (elem.outerHeight() > containerHeight) {
                                elem.text(function(index, text) {
                                    return text.replace(getLastWordRegex, '...');
                                });

                            }
                            $(elem).addClass("elipsis-applied");
                        } else if (lines == scope.multilineEllipsisWithAccordion && !$(elem).hasClass("elipsis-applied")) {
                            $(elem).parents('td').find('[multiline-ellipsis-button]').css('visibility', 'hidden');
                        }
                    };

                function multilineElipsis() { $timeout(function() { applyMultiLineEllipsis() }); }
                function resetEllipsis(event) {
                    var target = $(event.target).parents('td').find('[multiline-ellipsis-with-accordion]');
                    var textBeforeEllipsis = target.attr('text-before-ellipse');
                    var ellipsedText = elem.text();
                    if (textBeforeEllipsis) {
                        target.text(textBeforeEllipsis);
                        target.attr('text-before-ellipse', ellipsedText);
                        scope.$apply(function() {
                            scope.accordionExpandCollapse = !scope.accordionExpandCollapse
                        });
                    }
                }
                $timeout(function() {
                    accpdrionBtn = $(elem).parents('td').find('button[multiline-ellipsis-button]');
                    if (accpdrionBtn) {
                        accpdrionBtn.on("click", resetEllipsis);
                    }
                });
                multilineElipsis();
                scope.$on('$destroy', cleanUp);
                function cleanUp() {
                    accpdrionBtn.off("click", resetEllipsis);

                }
            }
        };
    }
}
MultilineEllipsisWithAccordionDirective.multilineEllipsisWithAccordion.$inject = ['$timeout', '$rootScope'];

