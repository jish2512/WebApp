/* fxpHelpEvents directive is used to reset the focus to help button */

import { FxpConstants } from "../common/ApplicationConstants";

export class FxpHelpDirectives implements angular.IDirective {
    static fxpHelpEvents($timeout, fxpConfigurationService): angular.IDirective {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            if (!attrs.fxpHelpEvents)
                return;
            var item = JSON.parse(attrs.fxpHelpEvents);
            var url = item.Href;
            var target = item.OpenInline == 'true' ? '_self' : '_blank';
            if (!item.EventName) {
                element.attr('href', url);
                element.attr('target', target);
            }

            element.on("click", onHelpItemClicked);
            element.on("keyup", scrollToHelpItem);

            scope.$on("$destroy", function() {
                element.off("click", onHelpItemClicked);
                element.off("keyup", scrollToHelpItem);
            });

            function onHelpItemClicked() {
                if (item.EventName) {
                    scope.$emit(item.EventName, url, target);
                }
            }
            function scrollToHelpItem(event) {
                var keyCodes = FxpConstants.keyCodes;
                if (event.keyCode == keyCodes.tabKey) {
                    var activeElem = document.activeElement;
                    if (activeElem != null && activeElem != undefined) {
                        var helpContent = $(activeElem).closest('.help-content'),
                            helpContentItems = helpContent.find("a").filter(':visible'),
                            currentMenuItemIndex = helpContentItems.index(activeElem);

                        if (currentMenuItemIndex == 0) {
                            $(".help-content").parent().scrollTop(0);
                        }
                        else if (currentMenuItemIndex == helpContentItems.length - 1) {
                            $(".help-content").parent().scrollTop(10000);
                        }
                        else {
                            var elem = $(document.activeElement).next("div"),
                                scrollElement = $(".help-content").parent(),
                                pageTop = $(scrollElement).scrollTop(),
                                pageBottom = pageTop + $(scrollElement).height(),
                                elementTop = elem.offset() ? elem.offset().top : 0,
                                elementBottom = elementTop + elem.height(),
                                isScrolledIntoView = ((pageTop < elementTop) && (pageBottom > elementBottom));
                            if (!isScrolledIntoView) {
                                document.activeElement.scrollIntoView(true);
                                scrollElement.scrollTop($(".help-content").parent().scrollTop() - 1);
                            }
                        }
                    }
                }
            }
        }
    }
    static fxpHelp($timeout, $document, $rootScope): angular.IDirective {
        let directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            let helpButton,
                fxpKeyCodes = FxpConstants.keyCodes,
                pullFocusToHelpButton = function() {
                    helpButton.focus();
                },
                keyDown = function(event) {
                    if ((event.keyCode === fxpKeyCodes.escapeKey) && ($rootScope.isHelpOpen) && (!$rootScope.isHelpFlyoutPinned)) {
                        $("#help-open").click();
                        pullFocusToHelpButton();
                    }
                },
                toggleGoToTop = function() {
                    let helpContainer = $(".help-content");
                    $timeout(function() {
                        if (helpContainer.length) {
                            scope.hasScrollbar = helpContainer.get(0).scrollHeight > helpContainer.get(0).clientHeight;
                        } else {
                            scope.hasScrollbar = false;
                        }
                    }, 1000);
                },
                cleanUp = function() {
                    pullFocusToHelpButton();
                };
            $timeout(function() {
                helpButton = $('#help-open');
                element.on('keydown', keyDown);
                scope.$watch(function() {
                    let helpContainer = $(".help-content");
                    if (helpContainer.length) {
                        return helpContainer.get(0).scrollHeight;
                    }
                }, toggleGoToTop);
            });
            scope.$on('$destroy', cleanUp);
        }
    }
    static fxpHelpArticle($timeout): angular.IDirective {
        let directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        function link(scope, element, attr) {
            let image,
                onImageClick = function(event) {
                    scope.expandArticleImage(event.target.attributes["src"].value);
                },
                cleanUp = function() {
                    image.off('click');
                };
            attr.$observe('fxpHelpArticle', function() {
                $timeout(function() {
                    image = element.find("img");
                    image.wrap('<div class="image-container"></div>')
                    image.attr('tabindex', 0);
                    image.on('click', onImageClick);
                    $('<i class="icon icon-magnify"></i>').insertAfter(image);
                });
            });
            scope.$on('$destroy', cleanUp);
        }
    }
    static fxpHelpOutsideClick($rootScope, $document, $parse): angular.IDirective {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                if ($parse(attr.fxpHelpOutsideClick)($scope)) {
                    var outSideClickHandler = function($event) {
                        var el = $($event.target).closest(".contextual-help");
                        if (el.length === 0) {
                            if (!$rootScope.isHelpFlyoutPinned && $rootScope.isHelpOpen) {
                                $rootScope.$apply(function() {
                                    $rootScope.isHelpOpen = false;
                                });
                            }
                        }
                    };
                    $document.on('click', outSideClickHandler);
                    $scope.$on('$destroy', function() {
                        $document.off('click', outSideClickHandler);
                    });
                }
            }
        };
    }
}

FxpHelpDirectives.fxpHelpEvents.$inject = ['$timeout', 'FxpConfigurationService'];
FxpHelpDirectives.fxpHelp.$inject = ['$timeout', '$document', '$rootScope'];
FxpHelpDirectives.fxpHelpArticle.$inject = ['$timeout'];
FxpHelpDirectives.fxpHelpOutsideClick.$inject = ['$rootScope', '$document', '$parse'];