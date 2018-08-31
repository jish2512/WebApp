import { FxpConstants } from "../common/ApplicationConstants";
import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

export class FxpNotification implements angular.IDirective {
    static fxpNotificationDirective($window, $timeout, $rootScope, deviceFactory): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                var fxpKeyCodes = FxpConstants.keyCodes;
                var keyBoardEventHandlerForFlyOut = function(event) {
                    var allMenuItems = $(elem).find("ul").find("li.notification .deleteNotification ,.notification-dnd ,.notificationClose").filter(':visible');
                    if (fxpKeyCodes.tabKey === event.keyCode && $(event.target)[0].id != "notification-open") {
                        if (allMenuItems.length) {
                            if (allMenuItems.length == 1) {
                                stopDefaultBehavior(event);
                                allMenuItems[0].focus();
                            } else if ($(event.target)[0].id == "loadMore" && !event.shiftKey) {
                                stopDefaultBehavior(event);
                                $("#closeNotification").focus();
                            } else if ($(event.target)[0].id == "dndnotificaion" && $(".notification").find(".notification-body").length === 0) {
                                stopDefaultBehavior(event);
                                $("#closeNotification").focus();
                            } else if ($(event.target)[0].id == "closeNotification" && event.shiftKey) {
                                stopDefaultBehavior(event);
                                if (!$("#loadMore").filter(":visible").length) {
                                    allMenuItems[allMenuItems.length - 1].focus();
                                }
                                else
                                    $("#loadMore").focus();
                            }
                        }
                    } else if (event.keyCode === fxpKeyCodes.arrowDownKey || event.keyCode === fxpKeyCodes.arrowUpKey) {
                        stopDefaultBehavior(event);
                    }
                };

                var globalKeyEventHandler = function(event) {
                    if (scope.notifications.isNotificationFlyoutOpen) {
                        switch (event.keyCode) {
                            case fxpKeyCodes.escapeKey:
                                stopDefaultBehavior(event);
                                closeNotificaitonFlyout();
                        }
                    }
                };
                var viewLinkHandler = function(event) {
                    if (event.keyCode === fxpKeyCodes.arrowDownKey || event.keyCode === fxpKeyCodes.arrowUpKey) {
                        stopDefaultBehavior(event);
                    }
                };
                var keyEventHandlerForNotificatonIcon = function(event) {
                    if (event.keyCode === fxpKeyCodes.enterKey || event.type == "click") {
                        $(".notificationflyout ul.dropdown-menu").animate({ scrollTop: 0 }, "fast");
                    }
                };

                /* Fucntion to be called when Notification button is clicked.
                ** Closes GLN if it is open. */
                var notificationButtonClick = function(event) {
                    if ($rootScope.isLeftNavOpen && deviceFactory.isMobile()) {
                        $rootScope.$broadcast(FxpBroadcastedEvents.OnLeftNavToggleExpandedState);
                    }
                };
                angular.element($window).on('keyup', globalKeyEventHandler);
                var notificationCloseIcon, notificationLoadMore, notificationViewLink, notificationIcon, notificationButton;
                $timeout(function() {
                    notificationCloseIcon = $(elem).find("ul").find("#closeNotification");
                    notificationLoadMore = $(elem).find("ul").find("#loadMore");
                    notificationViewLink = $(elem).find("ul li a");
                    notificationIcon = $(elem).find("#notification-open");
                    notificationButton = $(elem).find("#notification-open");
                    $(elem).on("keydown", keyBoardEventHandlerForFlyOut);
                    notificationIcon.on("keydown click", keyEventHandlerForNotificatonIcon);
                    notificationViewLink.on("keydown", viewLinkHandler);
                    notificationButton.on("click", notificationButtonClick);

                });
                scope.$on('$destroy', cleanUp);
                function cleanUp() {
                    $(elem).off("keydown");
                    angular.element($window).off('keyup', globalKeyEventHandler);
                    //notificationLoadMore.off("keydown", keyBoardEventHandlerForLoadMore);
                    notificationIcon.off("keydown click", keyEventHandlerForNotificatonIcon);
                    notificationViewLink.off("keydown", viewLinkHandler);
                    notificationButton.off("click", notificationButtonClick);
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
            }

        };
    }
}
FxpNotification.fxpNotificationDirective.$inject = ["$window", "$timeout", "$rootScope", "DeviceFactory"];