import { FxpConstants } from "../common/ApplicationConstants";

export class FxpNotificationSetFocusDirective implements angular.IDirective {
    static fxpNotificationSetFocus($window, $timeout): angular.IDirective {
        return {
            restrict: 'A',
            scope: {
                notificationAction: '&'
            },
            link: function(scope, elem, attr) {
                var fxpKeyCodes = FxpConstants.keyCodes;
                var keyBoardEventHandler = function(event) {
                    var allMenuItems = $(elem).closest("ul").find("a, textarea:not([disabled]), button:not([disabled]), div[tabindex=0]").filter(':visible'),
                        currentMenuItemIndex = allMenuItems.index(event.target);
                    switch (event.keyCode) {
                        case fxpKeyCodes.tabKey:
                            if (!event.shiftKey) {
                                if (currentMenuItemIndex === allMenuItems.length - 1) {
                                    stopDefaultBehavior(event);
                                    allMenuItems[0].focus();
                                }
                            } else {
                                if (currentMenuItemIndex === 0) {
                                    stopDefaultBehavior(event);
                                    allMenuItems[allMenuItems.length - 1].focus();
                                }
                            }
                            break;
                        case fxpKeyCodes.arrowDownKey:
                        case fxpKeyCodes.arrowUpKey:
                        case fxpKeyCodes.spaceBar:
                            stopDefaultBehavior(event);
                            break;
                    }
                };

                var notificationSubjectHandler = function(event) {
                    if (event.keyCode == fxpKeyCodes.enterKey)
                        scope.$apply(function() { scope.notificationAction(); })
                    else if (event.keyCode == fxpKeyCodes.arrowDownKey || event.keyCode == fxpKeyCodes.arrowUpKey || event.keyCode == fxpKeyCodes.spaceBar) {
                        stopDefaultBehavior(event);
                    }
                };


                $(elem).find("button.deleteNotification").on("keydown", keyBoardEventHandler);
                $(elem).find("div.notifi-subject").on("click keydown", notificationSubjectHandler);
                scope.$on('$destroy', cleanUp);
                function cleanUp() {
                    $(elem).find("button.deleteNotification").off("keydown", keyBoardEventHandler);
                    $(elem).find("div.notifi-subject").off("click keydown", notificationSubjectHandler);
                }
                function stopDefaultBehavior(event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                function resetFocus() {
                    $("#notification-open").focus();
                }
                function closeNotificaitonFlyout() {
                    scope.$apply(function() { scope.notifications.isNotificationFlyoutOpen = false; });
                    resetFocus();
                }
                function setFocusToCloseBtn() {
                    $(".notificationClose").focus();
                }

            }

        };
    }
}
FxpNotificationSetFocusDirective.fxpNotificationSetFocus.$inject = ["$window", "$timeout"];