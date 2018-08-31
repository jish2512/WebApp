import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

export class MultilineEllipsisDirective implements angular.IDirective {
    static multilineEllipsis($timeout, $rootScope): angular.IDirective {
        return {
            restrict: 'A',
            scope: {
                multilineEllipsis: "="
            },
            link: function(scope, elem, attr) {
                var applyMultiLineEllipsis = function($event?) {
                    var divHeight = elem.outerHeight();
                    var getLastWordRegex = /\W*\s(\S)*$/;
                    var lineHeight;
                    var lines;

                    try {
                        lineHeight = parseInt($(elem).css('line-height'));
                        lines = Math.round(divHeight / lineHeight);
                    } catch (e) {

                    }
                    if (lines > scope.multilineEllipsis) {
                        var containerHeight = lineHeight * scope.multilineEllipsis + 1;
                        while (elem.outerHeight() > containerHeight) {
                            elem.text(function(index, text) {
                                return text.replace(getLastWordRegex, '...');
                            });

                        }

                    };

                };
                var notificationIconHandler = function(event) {
                    $(".notificationflyout ul.dropdown-menu").scrollTop(0);
                    applyMultiLineEllipsis(event);
                }
                $timeout(function() { applyMultiLineEllipsis(); });
                var notificationIcon = $("#notification-open");
                var notificationLoadMore = $("#loadMore");
                var notificationDismissAll = $(".dismiss-all a");
                var notificationDelete = $(".deleteNotification");
                $timeout(function() {
                    notificationIcon.on("click", notificationIconHandler);
                    notificationDismissAll.on("click", applyMultiLineEllipsis);
                    notificationLoadMore.on("click", applyMultiLineEllipsis);
                    notificationDelete.on("click", applyMultiLineEllipsis);
                });
                $rootScope.$on(FxpBroadcastedEvents.OnLayoutChanged, applyMultiLineEllipsis);
                scope.$on('$destroy', cleanUp);
                function cleanUp() {
                    notificationIcon.off("click", notificationIconHandler);
                    notificationDismissAll.off("click", applyMultiLineEllipsis);
                    notificationLoadMore.off("click", applyMultiLineEllipsis);
                    notificationDelete.off("click", applyMultiLineEllipsis);
                }

            }
        };
    }
}
MultilineEllipsisDirective.multilineEllipsis.$inject = ['$timeout', '$rootScope'];