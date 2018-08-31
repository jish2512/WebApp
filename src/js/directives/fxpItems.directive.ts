
export class FxpComponentDirectives implements angular.IDirective {
    static fxpleftnavigation(): angular.IDirective {
        var directive: any = {};

        directive.restrict = 'AE';

		directive.templateUrl = "./../../templates/leftnavigation.html";

        return directive;
    }

    static fxpheader(): angular.IDirective {
        var headerdirective: any = {};
        headerdirective.restrict = 'AE';

		headerdirective.templateUrl = "./../../templates/fxpheader.html";

        return headerdirective;
    }

    static fxpfooter(deviceFactory): angular.IDirective {
        var directive: any = {};

        directive.restrict = 'AE';

		directive.templateUrl = "./../../templates/footer.html";

        directive.link = function(scope, element, attr) {
            // Setting min-height of partner app
            element.ready(function() {
                if (deviceFactory.isMobile()) {
                    var headerHeight = angular.element("#header").height(),
                        footerHeight = angular.element("#fxpfooter").height(),
                        windowHeight = self.window.innerHeight,
                        partnerApp = angular.element(".partner-app");

                    partnerApp.css('min-height', windowHeight - headerHeight - footerHeight);
                }
            });
        }

        return directive;
    }

    static fxpOboHeader(): angular.IDirective {
        return {
            restrict: 'E',
			templateUrl: "./../../templates/actobo-header.html",
        }
    }

    static pageLoader($window, $rootScope): angular.IDirective {
        var directive = {
            restrict: 'AE',
            replace: true,
            scope: true,
			templateUrl: "./../../templates/pageLoader.template.html"
        };
        return directive;
    }

    static fxpbreadcrumb(): angular.IDirective {
        var directive = {
            restrict: 'E',
			templateUrl: "./../../templates/fxpbreadcrumb.html"
        };
        return directive;
    }

    static fxphelpmenu(): angular.IDirective {
        var directive = {
            restrict: 'E',
			templateUrl: "./../../templates/fxphelpmenu.html"
        };
        return directive;
    }

    static fxpnotification(): angular.IDirective {
        var directive = {
            restrict: 'E',
			templateUrl: "./../../templates/fxpnotification.html"
        };
        return directive;
    }

    static fxpsystemupdatemsg(): angular.IDirective {
        var directive = {
            restrict: 'E',
			templateUrl: "./../../templates/system-update-msg-banner.html",

        };
        return directive;
    }

    static fxptoastnotification(): angular.IDirective {
        var directive = {
            restrict: 'E',
            controller: 'ToastNotificationController',
            controllerAs: 'toastNotificationController',
            bindToController: true,
			templateUrl: "./../../templates/fxptoastnotification.html"
        };
        return directive;
    }
}
FxpComponentDirectives.pageLoader.$inject = ['$window', '$rootScope'];
FxpComponentDirectives.fxpfooter.$inject = ['DeviceFactory'];