import { FxpConstants } from "../common/ApplicationConstants";
export class FxpToastNotificationDirectives implements angular.IDirective {
    static fxpToastNotification(): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                // Link of current notification.
                var notificationLink = elem.find('.toast-content'),
                    // Close button of current notification.
                    closeButton = elem.find('.close-button'),
                    // Time limit to auto close notification.
                    notificationToastTimeoutLimit = parseInt(scope.toastNotificationController.fxpConfigurationService.FxpBaseConfiguration.NotificationConfiguration.ToastNotificationTimeout || 5000),
                    // Current notification.
                    notification = scope.notification,
                    autoClosePromise = null,
                    // Event Handler for close button.
                    closeButtonClickHandler = function(event) {
                        var toastContainer = $('.toast_container'),
                            // All close buttons of Toast notifications.
                            notificationCloseButtons = toastContainer.find('.close-button'),
                            // All links of toast notifications.
                            notificationLinks = $('.toast-content'),
                            // Index of current close button.
                            currentItemIndex = notificationCloseButtons.index(event.target);
                        // Check if more notifications are there.
                        if (notificationCloseButtons.length > 1) {
                            // Check which item is to be focused.
                            if (currentItemIndex == (notificationCloseButtons.length - 1)) {
                                // Focus previous notification.
                                notificationLinks[currentItemIndex - 1].focus();
                            } else {
                                // Focus next notification.
                                notificationLinks[currentItemIndex + 1].focus();
                            }
                        }
                    },
                    // Method to perform cleanup.
                    cleanUp = function() {
                        closeButton.off('click', closeButtonClickHandler);
                        elem.off('mouseover', onMouseOver);
                        elem.off('mouseout', onMouseOut);
                    },
                    // Event handler for mouseover.
                    onMouseOver = function(event) {
                        // Fix the position.
                        var toastNotifications = $(".toast-notificaion");
                        for (var index = toastNotifications.length - 1; index >= 0; index--) {
                            $(toastNotifications[index]).css('top', (toastNotifications[index].offsetTop + 48));
                            $(toastNotifications[index]).css('position', 'fixed');
                        }
                        // Stop auto close timer.
                        if (autoClosePromise) {
                            scope.toastNotificationController.$timeout.cancel(autoClosePromise);
                            autoClosePromise = null;
                        }
                    },
                    // Event handler for mouseout.
                    onMouseOut = function(event) {
                        // Revert position to default.
                        var toastNotifications = $(".toast-notificaion");
                        for (var index = 0; index < toastNotifications.length; index++) {
                            $(toastNotifications[index]).css('top', 'auto');
                            $(toastNotifications[index]).css('position', 'relative');
                        }
                        // Start auto close timer.
                        autoCloseStart();
                    },
                    // Method to start autoclose timer.
                    autoCloseStart = function() {
                        // Auto close notification.
                        autoClosePromise = scope.toastNotificationController.$timeout(function() {
                            scope.toastNotificationController.closeToastNotification(notification);
                        }, notificationToastTimeoutLimit);
                    };
                // Start autoclose timer.
                autoCloseStart();
                // Pull focus to current notification.
                notificationLink.focus();
                closeButton.on('click', closeButtonClickHandler);
                elem.on('mouseover', onMouseOver);
                elem.on('mouseout', onMouseOut);
                scope.$on('$destroy', cleanUp);
            }
        };
    }

    static fxpToastNotificationContainer(): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                // Find current focused element.
                var activeElement = $(':focus'),
                    // Key codes.
                    fxpKeyCodes = FxpConstants.keyCodes,
                    // Key Down Event handler.
                    keydownEventHandler = function(event) {
                        // Find all focusable elements.
                        var focusableElements = elem.find('a, button'),
                            // Find current index.
                            currentItemIndex = focusableElements.index(event.target);
                        // Check if tab key is pressed.
                        if (event.keyCode === fxpKeyCodes.tabKey) {
                            // Check if shift tab is pressed on first item.
                            if (event.shiftKey && currentItemIndex == 0) {
                                // Focus last element.
                                focusableElements[focusableElements.length - 1].focus();
                                // Stop default behavior.
                                stopDefaultBehavior(event);
                            }
                            // Check if tab is pressed on last item.
                            else if (!event.shiftKey && currentItemIndex == (focusableElements.length - 1)) {
                                // Focus first element.
                                focusableElements[0].focus();
                                // Stop default behavior.
                                stopDefaultBehavior(event);
                            }
                        }
                    },
                    // Method to stop default behavior.
                    stopDefaultBehavior = function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                    },
                    // Method to perform cleanup.
                    cleanUp = function() {
                        elem.off('keydown', keydownEventHandler);
                        // Put focus back to the element which had focus befre notification appeared.
                        activeElement.focus();
                    };
                elem.on('keydown', keydownEventHandler);
                scope.$on('$destroy', cleanUp);
            }
        };
    }
}