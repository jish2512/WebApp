export class AppDirectives implements angular.IDirective{
        constructor() {

        }
        static fxpClickDirective() {
            return function (scope, elem, attr) {
                elem.bind("keydown keypress", function (evt) {
                    if (evt.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attr.fxpClick);
                        });
                        evt.preventDefault();
                    }
                }).bind("click", function (evt) {
                    scope.$apply(function () {
                        scope.$eval(attr.fxpClick);
                    });
                });
            };
        }
}



