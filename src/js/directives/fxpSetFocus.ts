export class FxpSetFocusToElement implements angular.IDirective {
    constructor() {
    }
    static fxpSetFocus() {
        return function(scope, elem, attr) {
            attr.$observe('fxpSetFocus', function() {
                if ((attr.fxpSetFocus) && attr.fxpSetFocus == 'true') {
                    elem[0].focus();
                }
            });
        };
    }
}

