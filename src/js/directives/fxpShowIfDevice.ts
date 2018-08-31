import { FxpBroadcastedEvents } from "../services/FxpBroadcastedEvents";

/*
 * The `fxpShowIfDevice` directive shows or hides the given HTML element based on the expression provided to
 * the `fxp-show-if-device` attribute.
 * 
 * Possible Values of `fxpShowIfDevice` are 
 *  Desktop - Would only Visible in Desktop Resolution
 *  Blank - Would be visible in all resolutions.
 * 
 * The element is shown or hidden by removing or adding the `.ng-hide` CSS class onto the element.
 * 
 * Usage
 * <div fxp-show-if-device="Desktop"></div> <!-- Would only Visible in Desktop Resolution -->
 */
export class FxpShowIfDeviceDirective implements angular.IDirective {
    static fxpShowIfDevice($parse, $rootScope, DeviceFactory): angular.IDirective {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {
                var DeviceType = $parse($attr.fxpShowIfDevice)($scope);
                if (DeviceType) {
                    updateVisibilityBasedOnDevice();
                    $rootScope.$on(FxpBroadcastedEvents.OnLayoutChanged, updateVisibilityBasedOnDevice);
                }

                function updateVisibilityBasedOnDevice() {
                    switch (DeviceType) {
                        case 'Desktop':
                            if (DeviceFactory.isDesktop()) {
                                $element.removeClass('ng-hide');
                            }
                            else {
                                $element.addClass('ng-hide');
                            }
                            break;
                    }
                }
            }
        }
    }
}