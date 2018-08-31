import { FxpConstants } from "../common/ApplicationConstants";
export class BreadcrumbDirectives implements angular.IDirective {
    static renderFxpBreadcrumb($window, $timeout, $rootScope): angular.IDirective {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                fxpRenderBreadcrumb();
                var renderBreadcrumb = function() {
                    var bcContainer = $("#fxp_Breadcrumb");
                    var breadcrumbHeight = bcContainer.outerHeight();
                    var bcList = $("#fxp_Breadcrumb ol li");
                    if (breadcrumbHeight != null && isMultiLiner(bcList)) {
                        bcList.addClass('responsiveList');
                        bcContainer.addClass('responsiveContainer');
                    } else {
                        bcList.removeClass('responsiveList');
                        bcContainer.removeClass('responsiveContainer');
                    }
                };
                angular.element($window).on('resize', renderBreadcrumb);
                scope.$on('$destroy', cleanUp);
                function cleanUp() {
                    angular.element($window).off('resize', renderBreadcrumb);
                    elem.off("keydown keypress click", fxpRenderBreadcrumb);
                }
                elem.on("keydown keypress click", function() {
                    fxpRenderBreadcrumb();
                });
                $rootScope.$watch(
                    'fxpBreadcrumb',
                    function() {
                        fxpRenderBreadcrumb();
                    }, true
                );
                function fxpRenderBreadcrumb() {
                    $timeout(function() {
                        renderBreadcrumb();
                    });
                }
            }
        };

        function isMultiLiner(bcList) {
            var lastElement: any = false; var count = 1;
            bcList.removeClass("lastBreadcrumb");
            bcList.each(function() {
                if (lastElement && lastElement.offset().top != $(this).offset().top) {
                    lastElement.addClass("lastBreadcrumb");
                    count += 1;
                }
                lastElement = $(this);
            }).last().addClass("lastBreadcrumb");
            return count > 1 ? true : false;
        }
    }
    static breadcrumbFocusContentAria($rootScope, $state, $timeout, fxpConfigurationService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                var focusPartenerAria = function(event) {
                    var fxpKeyCodes = FxpConstants.keyCodes;
                    $rootScope.$event = event.target;
                    if ((event.keyCode == fxpKeyCodes.enterKey || event.type == "click") && attr.breadcrumbFocusContentAria)
                        scope.$apply(function() { elem.attr("href", attr.breadcrumbFocusContentAria) })
                }

                $rootScope.$on('$viewContentLoaded', function(event) {
                    if (fxpConfigurationService.FxpBaseConfiguration.FxpRouteCollection.indexOf($state.current.name) === -1) {
                        if ($rootScope.$event != null && $rootScope.$event != undefined) {
                            $timeout(function() {
                                var parentTargetMenu = angular.element('#fxp_Breadcrumb'),
                                    parentAllMenuItems = parentTargetMenu.find("li a").filter(':visible'),
                                    parentCurrentMenuItemIndex = parentAllMenuItems.index($rootScope.$event);
                                var activeElement = scope.findNextTabStop(parentAllMenuItems[parentAllMenuItems.length - 1]);
                                activeElement.focus();
                                $rootScope.$event = null;
                            });
                        };
                    };
                });

                var focusEventHandler = function() {
                    $(".partner-app").scrollTop(0);
                };

                scope.findNextTabStop = function(ele) {
                    var focusableElements = document.querySelectorAll('input, button, select, textarea, a[href], details');
                    var list = Array.prototype.filter.call(focusableElements, function(item) {
                        return item.tabIndex == 0
                    });
                    var index = list.indexOf(ele);
                    return list[index + 1] || list[0];
                }
                elem.on('keydown keypress click', focusPartenerAria);
                elem.on("focus", focusEventHandler);
                scope.$on('$destroy', function() {
                    elem.unbind('keydown keypress click', focusPartenerAria);
                    elem.unbind("focus", focusEventHandler);
                });
            }
        };
    }
}
BreadcrumbDirectives.breadcrumbFocusContentAria.$inject = ['$rootScope', '$state', '$timeout', 'FxpConfigurationService'];
BreadcrumbDirectives.renderFxpBreadcrumb.$inject = ['$window', '$timeout', '$rootScope'];