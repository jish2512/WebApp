import * as _ from 'underscore';
import { FxpBroadcastedEvents } from '../services/FxpBroadcastedEvents';

var deviceFactoryProvider: any; 

(function () {
    'use strict';

    
	deviceFactoryProvider = function DeviceFactoryProvider () {

        this.$get = ['$window', '$rootScope', '$timeout', function DeviceFactory($window, $rootScope, $timeout) {

            function DeviceManager() {
                this.resolution = {
                    devicePixelRatio: $window.devicePixelRatio,
                    types: {
                        mobile: 'xs',
                        tablet: 'sm',
                        desktop: 'lg'
                    }
                };

                this.resolution.size = this.getWindowSize();
                this.resolution.type = this.updateType();

                var self = this;
                var lazyUpdate = _.throttle(function (event) {
                    $timeout(function () {
                        self.resolution.size = self.getWindowSize();
                        self.resolution.type = self.updateType();
                        $rootScope.$broadcast(FxpBroadcastedEvents.OnLayoutChanged, self.resolution.type);
                    });
                }, 250);

                angular
                    .element($window)
                    .bind('resize', lazyUpdate);
            }

            DeviceManager.prototype.getWindowSize = function () {
                return {
                    width: $window.innerWidth,
                    height: $window.innerHeight
                };
            };

            DeviceManager.prototype.updateType = function () {
                if (this.resolution.size.width <= 736) {
                    return this.resolution.types.mobile;
                }
                else if (this.resolution.size.width <= 1024) {
                    return this.resolution.types.tablet;
                }
                else if (this.resolution.size.width > 1024) {
                    return this.resolution.types.desktop;
                }
            };

            DeviceManager.prototype.isSmallScreen = function () {
                return this.resolution.type === this.resolution.types.mobile
                || this.resolution.type === this.resolution.types.tablet;
            };

            DeviceManager.prototype.isMobile = function () {
                return this.resolution.type === this.resolution.types.mobile;
            };

            DeviceManager.prototype.isTablet = function () {
                return this.resolution.type === this.resolution.types.tablet;
            };

            DeviceManager.prototype.isDesktop = function () {
                return this.resolution.type === this.resolution.types.desktop;
            };
            return new DeviceManager();
        }];
    }
})();

export var DeviceFactoryProvider = deviceFactoryProvider;