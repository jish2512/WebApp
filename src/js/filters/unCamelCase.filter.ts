/*
unCamelCase converts camelCase string to spaced sring
eg. thisIsASentence  ->  This Is A Sentence

usage
<x ng-bind="$ctrl.camelCaseText | unCamelCase"> </x>
<x ng-bind="$ctrl.camelCaseText | unCamelCase | lowercase"> </x>
*/

export class UnCamelCase {
	public static getSpacedString() {
		return function (str = "") {
			let upperOrLowerCaseRegex = /([a-z])([A-Z])/g;
			let nextWord = /\b([A-Z]+)([A-Z])([a-z])/;
			/*
				1) insert a space between lower & upper
				2) insert space before last upper in a sequence followed by lower
					(this is to catch cases when we have multiple upper case in a sequence like FXPUi to FXP Ui)
				3) uppercase the first character
			*/
			return str.replace(upperOrLowerCaseRegex, '$1 $2').replace(nextWord, '$1 $2$3').replace(/^./, function (str) { return str.toUpperCase(); })
		}
	}
}


