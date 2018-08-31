export class AdminLandingDirective implements angular.IDirective {

	static adminLanding($timeout): angular.IDirective {
		return {
			restrict: 'A',
			link: function (scope, elem, attr) {
				$timeout(function () {
					if(elem.find(".uib-tab a")[0])
						elem.find(".uib-tab a")[0].focus();
				}, 100);
			}
		};
	}
}




