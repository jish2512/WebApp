import { FxpConstants } from "../common/ApplicationConstants";

export class RenderNavElementsForKeydownDirective implements angular.IDirective {
    static renderNavElementsForKeydown($timeout): angular.IDirective {
        return {
            restrict: 'A',
            scope: {
                fxpNavElement: '@',
                isHideButtonVisible: "=",
                enableAddOrRemove: "&",
                globalNavItem: "=",
                childrenNavItem: "=",
                userNavItem: "=",
                childrenUserNavItem: "="
            },
            link: function(scope, elem, attr) {
                var keyBoardEventsHandler = function($event) {
                    var fxpKeyCodes = FxpConstants.keyCodes;
                    var targetMenu: any = $($event.target).closest(scope.fxpNavElement),
                        allMenuItems = targetMenu.find(".fxpTabbableElem").filter(':visible'),
                        currentMenuItemIndex = allMenuItems.index($event.target);
                    switch ($event.keyCode) {
                        case fxpKeyCodes.arrowDownKey:
                            stopDefaultBehavior($event);
                            if (currentMenuItemIndex < (allMenuItems.length - 1)) {
                                allMenuItems[currentMenuItemIndex + 1].focus();
                            }
                            else {
                                allMenuItems[0].focus();
                            }
                            chagneTabIndex(allMenuItems, currentMenuItemIndex + 1);
                            break;
                        case fxpKeyCodes.arrowUpKey:
                            stopDefaultBehavior($event);
                            if (currentMenuItemIndex > 0) {
                                var element = allMenuItems[currentMenuItemIndex - 1];
                                allMenuItems[currentMenuItemIndex - 1].focus();
                            }
                            else {
                                allMenuItems[allMenuItems.length - 1].focus();
                            }
                            chagneTabIndex(allMenuItems, currentMenuItemIndex - 1);
                            break;
                        case fxpKeyCodes.tabKey:

                            if (currentMenuItemIndex < 0)
                                currentMenuItemIndex = allMenuItems.index($($event.target).parents(".fxpTabbableElem"));

                            chagneTabIndex(allMenuItems, currentMenuItemIndex);
                            break;
                        case fxpKeyCodes.arrowRightKey:
                            stopDefaultBehavior($event);
                            if (!scope.isHideButtonVisible) {
                                scope.$apply(function() {
                                    scope.isHideButtonVisible = !scope.isHideButtonVisible;
                                    $(elem).attr("aria-label", $(elem).attr("aria-text") + "Expanded");
                                });
                            }
                            break;
                        case fxpKeyCodes.arrowLeftKey:
                            stopDefaultBehavior($event);
                            var l1Container = $($event.target).parents("ul"), parentElement;
                            if (l1Container && l1Container.length > 0) {
                                parentElement = l1Container.siblings(".fxpTabbableElem");
                                parentElement = ((parentElement) && (parentElement.length > 0)) ? parentElement : l1Container.parent().find("button");
                                parentElement.focus();
                            } else {
                                if (scope.isHideButtonVisible) {
                                    scope.$apply(function() {
                                        scope.isHideButtonVisible = false;
                                        $(elem).attr("aria-label", $(elem).attr("aria-text") + "Collapsed");
                                    });
                                }
                            }
                            break;
                        case fxpKeyCodes.spaceBar:
                            var targetElem = $($event.target);
                            var checkBoxElem;
                            stopDefaultBehavior($event)
                            if (targetElem.is("input:enabled")) {
                                checkBoxElem = targetElem;
                            } else {
                                checkBoxElem = targetElem.find("input:enabled");
                            }
                            if (checkBoxElem.length > 0) {
                                var isElemChecked = checkBoxElem.prop("checked");
                                scope.$apply(function() {
                                    if (scope.globalNavItem)
                                        scope.globalNavItem.isParentSelected = !scope.globalNavItem.isParentSelected;
                                    if (scope.childrenNavItem)
                                        scope.childrenNavItem.isChildSelected = !scope.childrenNavItem.isChildSelected;
                                    if (scope.userNavItem)
                                        scope.userNavItem.isSelected = !scope.userNavItem.isSelected;
                                    if (scope.childrenUserNavItem)
                                        scope.childrenUserNavItem.isSelected = !scope.childrenUserNavItem.isSelected;
                                    //this helps in select/unselect checkbox when space bar is pressed and also called controller function binded to the directive
                                    if (scope.userNavItem)
                                        scope.userNavItem.isRecepientsParentSelected = !scope.userNavItem.isRecepientsParentSelected;
                                    if (scope.childrenUserNavItem)
                                        scope.childrenUserNavItem.isRecepientsChildSelected = !scope.childrenUserNavItem.isRecepientsChildSelected;

                                    scope.enableAddOrRemove();
                                });
                            }
                            break;
                        case fxpKeyCodes.enterKey:
                            stopDefaultBehavior($event)
                            var accordionState;
                            scope.$apply(function() {
                                accordionState = scope.isHideButtonVisible ? " Collapsed " : " Expanded ";
                                scope.isHideButtonVisible = !scope.isHideButtonVisible;
                                $(elem).attr("aria-label", $(elem).attr("aria-text") + accordionState);
                            });
                            break;
                    }
                };
                var clickEventsHandler = function(event) {
                    var target = $(event.target);
                    var accordionState;
                    if (target.hasClass("accordion-element")) {
                        scope.$apply(function() {
                            accordionState = scope.isHideButtonVisible ? " Expanded " : " Collapsed ";
                            //scope.isHideButtonVisible = !scope.isHideButtonVisible;

                            $(elem).attr("aria-label", accordionState + ". " + $(elem).attr("aria-text"));
                        });
                    }
                };
                var accordionState;
                if ($(elem).get(0).tagName === "DIV") {
                    $timeout(function() {
                        accordionState = scope.isHideButtonVisible ? " Expanded " : " Collapsed ";
                        $(elem).attr('aria-text', $(elem).attr('aria-label'));
                        $(elem).attr('aria-label', $(elem).attr('aria-label') + accordionState);
                    });
                }
                elem.bind("keydown keypress", keyBoardEventsHandler);
                elem.bind("click", clickEventsHandler);
                scope.$on('$destroy', function() {
                    elem.unbind("keydown keypress", keyBoardEventsHandler);
                    elem.unbind("click", clickEventsHandler);
                });
            }
        };
        function stopDefaultBehavior($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        function chagneTabIndex(elemList, focuableElemIndex) {
            elemList.each(function(index) {
                if (index != focuableElemIndex) {
                    $(elemList[index]).attr('tabindex', -1);
                } else {
                    $(elemList[index]).attr('tabindex', 0);
                }
            });
        }
    }
}
RenderNavElementsForKeydownDirective.renderNavElementsForKeydown.$inject = ['$timeout'];