import { FxpConstants } from "../common/ApplicationConstants";

fxpSystemMessageRow.$inject = ["$rootScope", "$timeout"];
export function fxpSystemMessageRow($rootScope, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            $timeout(function() {
                var showhideChevron = function() {
                    var columns = elem.find("td");
                    if (columns[1].offsetWidth == columns[1].scrollWidth) {
                        $(columns[0]).find("button").hide();
                    } else {
                        $(columns[0]).find("button").show();
                    }
                };
                scope.$watch(function() { return scope.systemMessage.message; }, showhideChevron);
            });
        }
    }
}
export  function fxpSystemMessagePopupDirective() {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            var activeElement: any = $(":focus"),
                fxpKeyCodes = FxpConstants.keyCodes,
                dialog = elem.closest("[role='dialog']");
            dialog.focus();
            var keyBoardEventHandler = function($event) {
                var allMenuItems = $(elem).find("button:not([disabled]), select, input, textarea, a"),
                    currentMenuItemIndex = allMenuItems.index($event.target);
                if ($event.keyCode === fxpKeyCodes.tabKey) {
                    if (currentMenuItemIndex <= 0 && $event.shiftKey) {
                        allMenuItems[allMenuItems.length - 1].focus();
                        stopDefaultBehavior($event);
                    } else if ((currentMenuItemIndex == (allMenuItems.length - 1) || currentMenuItemIndex < 0) && !$event.shiftKey) {
                        allMenuItems[0].focus();
                        stopDefaultBehavior($event);
                    }
                }
            };
            var closePopup = function($event) {
                activeElement.focus();
                activeElement = null;
            };
            dialog.on("keydown keypress", keyBoardEventHandler);
            scope.$on('$destroy', function($event) {
                dialog.off("keydown keypress", keyBoardEventHandler);
                closePopup($event);
            });
            function stopDefaultBehavior(event) {
                event.preventDefault();
                event.stopPropagation();
            }
        }

    };
}