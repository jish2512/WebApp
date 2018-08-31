import { FxpConstants } from "../common/ApplicationConstants";
declare var document: any;
export class LeftNavPersonalizationScrollToActiveDirective implements angular.IDirective {
    static leftNavPersonalizationScrollToActive($timeout): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                var fxpKeyCodes = FxpConstants.keyCodes;
                var fxpKeyCodesArray = [fxpKeyCodes.arrowRightKey, fxpKeyCodes.enterKey, fxpKeyCodes.arrowLeftKey];
                var ensureElementInViewAfterFocus = function(containerElem, $event) {
                    $timeout(function() {
                        ensureElementInView(containerElem, $event, fxpKeyCodesArray);
                    }, 100);
                };
                var viewFocusElement = function($event) {
                    if (attr.leftNavPersonalizationScrollToActive) {
                        ensureElementInViewAfterFocus(attr.leftNavPersonalizationScrollToActive, $event);
                    }
                };
                var keyPressHandler = function($event) {
                    if (fxpKeyCodesArray.indexOf($event.keyCode) > -1) {
                        $timeout(function() { viewFocusElement($event); });
                    }
                };
                elem.bind("focus", viewFocusElement);
                elem.bind("keydown keypress", keyPressHandler);
                scope.$on('$destroy', function() {
                    elem.unbind("focus", viewFocusElement);
                    elem.unbind("keydown keypress", keyPressHandler);
                });
                var ensureElementInView = function(container, $event, fxpKeyCodesArray) {
                    var activeMenuItem = $(document.activeElement).is("input") ? $(document.activeElement).parent() : $(document.activeElement);
                    var activeMenuItemTop = activeMenuItem.offset().top;
                    var activeMenuItemBottom = activeMenuItemTop + activeMenuItem.height();
                    var leftNavTopOffset = $(container).offset().top;
                    var leftNavBottomOffset = $(container).height() + leftNavTopOffset;
                    const top_delta = 16; // delta represents mouse wheel position in JS, to denote mouse wheel postion from top using this variable 
                    const isElementInViewport = !(isElementAboveViewport() || isElementBelowViewport());
                    if (isElementInViewport) {
                        if ($(document.activeElement).is("button")) {
                            var allMenuItems = $(container).find("button"),
                                currentMenuItemIndex = allMenuItems.index($(document.activeElement));
                            if ((allMenuItems.length - 1) === currentMenuItemIndex) {
                                var contentTop = getElementTop($event, fxpKeyCodesArray);
                                $(".personalizationAdminUI").scrollTop(contentTop);
                            }
                        }
                        return;
                    } else {
                        $(container).mCustomScrollbar("scrollTo", activeMenuItem);
                        var contentTop = getElementTop($event, fxpKeyCodesArray);
                        setTimeout(function() { $(".personalizationAdminUI").scrollTop(contentTop) }, 200);
                    }
                    function isElementAboveViewport() {
                        return leftNavTopOffset + top_delta > activeMenuItemTop;
                    }

                    function isElementBelowViewport() {
                        return leftNavBottomOffset < activeMenuItemBottom;
                    }

                    function getElementTop($event, fxpKeyCodesArray) {
                        var fxpKeyCodes = FxpConstants.keyCodes;
                        var elemTop = document.activeElement["offsetTop"];
                        if ($(document.activeElement).is("button")) {
                            var allMenuItems = $(container).find("button"),
                                currentMenuItemIndex = allMenuItems.index($(document.activeElement));
                            if (document.activeElement && document.activeElement.previousElementSibling) {
                                if ((allMenuItems.length - 1) === currentMenuItemIndex) {
                                    elemTop = (fxpKeyCodesArray.indexOf($event.keyCode) > -1) ? $(document.activeElement.previousElementSibling.getElementsByTagName("input")[0]).offset().top :
                                        (document.activeElement).offset().top;
                                } else {
                                    elemTop = document.activeElement.previousElementSibling.getElementsByTagName("input")[0].offsetTop;
                                }
                            }
                        }
                        return elemTop;
                    }
                }
            }
        };
    }
}
LeftNavPersonalizationScrollToActiveDirective.leftNavPersonalizationScrollToActive.$inject = ['$timeout'];


