export class FxpAuthorNotificationListDirective implements angular.IDirective {
	static fxpAuthorNotificationRow($timeout): angular.IDirective {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                $timeout(function () {
                    var showhideChevron = function () {
                        var columns = elem.find("td[ellipses-element]");
                        var isShowToggle = false;
                        if (columns.length > 0) {
                            isShowToggle = columns.toArray().every(function (value, index) { return value.offsetWidth === value.scrollWidth; })
                        }
                        if (isShowToggle) {
                            elem.find("td.chevron").find("button").hide();
                        } else {
                            elem.find("td.chevron").find("button").show();
                        }
                    };
                    showhideChevron();
                });
            }
        }
    }
}
FxpAuthorNotificationListDirective.fxpAuthorNotificationRow.$inject = ["$timeout"];
