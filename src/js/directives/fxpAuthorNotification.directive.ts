export class AuthorNotificationContentDirective implements angular.IDirective {
	static authorNotificationContent(): angular.IDirective {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				var cleanUp = function (event) {
					// Pull focus to audience type combo box.
					scope.anCtrl.$timeout(function () {
						scope.anCtrl.$rootScope.activeElement = $('#audience-type');
						scope.anCtrl.$rootScope.activeElement.focus();
					});
				};
				scope.$on('$destroy', cleanUp);
			}
		};
	}
}