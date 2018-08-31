import { FxpConstants } from "../common/ApplicationConstants";

/* fxpLeftNavKeydown directive is used to navigate key events when LeftNav is open*/

'use strict';

fxpLeftNavKeydown.$inject = ['$rootScope', '$timeout', '$state', 'FxpConfigurationService'];
export function fxpLeftNavKeydown($rootScope, $timeout, $state, fxpConfigurationService) {
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
            parentItem: '=',
            childItem: '='
        }
    };
    return directive;

    function link(scope, element, attrs) {
        var ensureElementInViewAfterFocus = function(containerElem) {
            $timeout(function() {
                ensureElementInView(containerElem);
            }, 100);
        }

        var elementKeydownHandler = function($event) {
            var self = this;
            var keyCodes = FxpConstants.keyCodes;
            var targetMenu = $($event.target).closest(".fxpLeftNavOpen"),
                visibleMenuItems = targetMenu.find("li a").filter(':visible'),
                currentMenuItemIndex = visibleMenuItems.index($event.target);
            var containerElem = $($event.target).closest("ul.fxp-left-nav-l1-menu");

            switch ($event.keyCode) {
                case keyCodes.escapeKey:
                    removeToolTip();
                    $rootScope.isLeftNavOpen = false;
                    $timeout(function() {
                        angular.element('#Fxpdashboard_LeftNavItem_' + scope.parentItem.id).focus();
                    }, 0, false);
                    break;

                case keyCodes.arrowRightKey:
                    if (!scope.childItem) {
                        if (scope.parentItem.hasChildren) {
                            if (!scope.parentItem.isOpen) {
                                $timeout(function() {
                                    scope.parentItem.isOpen = true;
                                }, 0)
                            } else {
                                angular.element('#Fxpdashboard_LeftNavItem_' + scope.parentItem.children[0].id).focus();
                            }
                        }

                    }
                    break;

                case keyCodes.arrowLeftKey:
                    if (!scope.childItem) {
                        if (scope.parentItem.hasChildren) {
                            if (scope.parentItem.isOpen) {
                                $timeout(function() {
                                    scope.parentItem.isOpen = false;
                                });
                            }
                        }
                    }
                    else {
                        angular.element('#Fxpdashboard_LeftNavItem_' + scope.parentItem.id).focus();
                        ensureElementInViewAfterFocus(containerElem);
                    }
                    break;

                case keyCodes.arrowDownKey:
                    if (currentMenuItemIndex < (visibleMenuItems.length - 1)) {
                        visibleMenuItems[currentMenuItemIndex + 1].focus();
                        ensureElementInViewAfterFocus(containerElem);
                        removeToolTip();
                        showTooltipForElipse(visibleMenuItems[currentMenuItemIndex + 1]);
                    }
                    break;

                case keyCodes.arrowUpKey:
                    if (currentMenuItemIndex > 0) {
                        visibleMenuItems[currentMenuItemIndex - 1].focus();
                        ensureElementInViewAfterFocus(containerElem);
                        removeToolTip();
                        showTooltipForElipse(visibleMenuItems[currentMenuItemIndex - 1]);
                    }
                    break;

                case keyCodes.enterKey:
                    if (!$rootScope.isLeftNavPinned)
                        $rootScope.targetItem = $event.target;

                    if (!$rootScope.isLeftNavPinned && (scope.childItem || !scope.parentItem.hasChildren)) {
                        $rootScope.isLeftNavOpen = false;
                    }
                    break;

                case keyCodes.tabKey:
                    removeToolTip();
                    if (!$event.shiftKey) {
                        if (!$rootScope.isLeftNavPinned) {
                            $rootScope.isLeftNavOpen = false;

                            $timeout(function() {
                                var parentTargetMenu = angular.element('#fxp-sidebar'),
                                    parentAllMenuItems = parentTargetMenu.find("li a").filter(':visible'),
                                    parentCurrentMenuItemIndex = parentAllMenuItems.index($event.target);
                                var nextEl = scope.findNextTabStop(parentAllMenuItems[parentAllMenuItems.length - 1]);
                                nextEl.focus();
                            }, 50)

                        }
                    } else {
                        $event.stopPropagation();
                        $timeout(function() {
                            angular.element('#pin').focus();
                        }, 0)
                    }
                    break;
            }
        }

        $rootScope.$on('$viewContentLoaded', function(event) {
            if (fxpConfigurationService.FxpBaseConfiguration.FxpRouteCollection.indexOf($state.current.name) === -1) {
                $timeout(function() {
                    if ($rootScope.targetItem != null && $rootScope.targetItem != undefined) {
                        var parentTargetMenu = angular.element('#fxp-sidebar'),
                            parentAllMenuItems = parentTargetMenu.find("li a").filter(':visible'),
                            parentCurrentMenuItemIndex = parentAllMenuItems.index($rootScope.targetItem);
                        var activeElement = scope.findNextTabStop(parentAllMenuItems[parentAllMenuItems.length - 1]);
                        activeElement.focus();
                        $rootScope.targetItem = null;
                    };
                });

            };
        });

        var leftNavKeyDown = function($event) {
            $timeout(function() {
                elementKeydownHandler($event);
            });
        }

        element.bind('keydown keypress', leftNavKeyDown);
        scope.$on('$destroy', function() {
            element.unbind('keydown keypress', leftNavKeyDown);
        });



        /* findNextTabStop() function helps to find next tabbable element*/
        scope.findNextTabStop = function(ele) {
            var focusableElements = document.querySelectorAll('input, button, select, textarea, a[href], details');
            var list = Array.prototype.filter.call(focusableElements, function(item) {
                return item.tabIndex == 0
            });
            var index = list.indexOf(ele);

            return list[index + 1] || list[0];
        }
    }

    function showTooltipForElipse(targetElem) {


        var $tempElem = $($(targetElem).find(".leftnavElement")).clone()
            .css({ display: 'inline', width: 'auto', visibility: 'hidden' })
            .appendTo('body');
        var tempElemWidth = $tempElem.width();
        $tempElem.remove();
        var leftnavElemWith = $($(targetElem).find(".leftnavElement")).width()
        if (tempElemWidth > leftnavElemWith)
            $(targetElem).find(".expandedtooltip").css({ top: $(targetElem).offset().top }).show();

    }
    function removeToolTip() {
        $(".expandedtooltip").hide();
    }

    function ensureElementInView(container) {
        var activeMenuItem = $(document.activeElement).parent();
        var activeMenuItemTop = activeMenuItem.offset().top;
        var activeMenuItemBottom = activeMenuItemTop + activeMenuItem.height();
        var leftNavTopOffset = $(container).offset().top;
        var leftNavBottomOffset = $(container).height() + leftNavTopOffset;
        var elementToFocus: any = activeMenuItem;
        const top_delta = 16;
        const bottom_delta = 48;

        const isElementInViewport = !(isElementAboveViewport() || isElementBelowViewport());
        if (isElementInViewport) {
            return;
        }

        if (isElementAboveViewport()) {
            if (isPreviousSiblilingAvailable()) {
                elementToFocus = activeMenuItem.prev('li');
            } else {
                const activeElementTopWithDelta = activeMenuItem.position().top - 30;
                elementToFocus = activeElementTopWithDelta;
            }
        }

        $(container).mCustomScrollbar("scrollTo", elementToFocus);


        function isPreviousSiblilingAvailable() {
            return activeMenuItem.prev('li').length > 0;
        }

        function isElementAboveViewport() {
            return leftNavTopOffset + top_delta > activeMenuItemTop;
        }

        function isElementBelowViewport() {
            return leftNavBottomOffset - bottom_delta < activeMenuItemBottom;
        }
    }
}
