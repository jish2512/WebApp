import { CommonUtils } from "../utils/CommonUtils";

export class RenderPopUpForKeydownDirective implements angular.IDirective {
    static renderPopUpForKeydown(): angular.IDirective {
        return {

            restrict: 'A',
            scope: {
                fxpPopupNavigation: '@',
                actionOnEscKeydown: '&'
            },
            link: function(scope, elem, attr) {
                var fxpKeyCodes = {
                    escKey: 27,
                    tabKey: 9
                }
                var keyBoardEventHandler = function($event) {
                    var targetMenu: any = $($event.target).closest(scope.fxpPopupNavigation),
                        allMenuItems = targetMenu.find("button[type=button]"),
                        currentMenuItemIndex = allMenuItems.index($event.target);
                    var eleType = $event.target.tagName;
                    if ($event.keyCode === fxpKeyCodes.escKey) {
                        scope.$apply(function() {
                            scope.actionOnEscKeydown();
                        });
                        setTimeout(function() { CommonUtils.pullFocusToElement('secndryBtn'); }, 100);
                    } else if ($event.keyCode === fxpKeyCodes.tabKey) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        if (currentMenuItemIndex < (allMenuItems.length - 1)) {
                            allMenuItems[currentMenuItemIndex + 1].focus();
                        } else {
                            allMenuItems[0].focus();
                        }
                        if ($event.shiftKey) {
                            if (currentMenuItemIndex > 0) {
                                allMenuItems[currentMenuItemIndex - 1].focus();
                            } else {
                                allMenuItems[allMenuItems.length - 1].focus();
                            }
                        }
                    } else if ($event.shiftKey && eleType != "BUTTON") {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }
                };
                elem.bind("keydown keypress", keyBoardEventHandler);
                scope.$on('$destroy', function() {
                    elem.unbind("keydown keypress", keyBoardEventHandler);
                });
            }
        };
    }
}