    
 export var fxpChoiceItem = function () {
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            // Event Handler for directive destroy.
            var destroyEventHandler = function(event) {
                var choiceContainer = $('.choice-summary'),
                    // All close buttons of choices.
                    choiceCloseButtons = choiceContainer.find('.choice-close'),
                    // Index of current close button.
                    currentItemIndex = event.currentScope.$index;
                // Check if more Choice are there.
                if (choiceCloseButtons.length > 1) {
                    // Check which item is to be focused.
                    if (currentItemIndex == (choiceCloseButtons.length - 1)) {
                        // Focus previous Choice.
                        choiceCloseButtons[currentItemIndex - 1].focus();
                    } else {
                        // Focus next Choice.
                        choiceCloseButtons[currentItemIndex + 1].focus();
                    }
                } else {
                    // Focus typeahead when last choice is closed.
                    $('#search-user').focus();
                }
            };
            //closeButton.on('click', closeButtonClickHandler);
            scope.$on('$destroy', destroyEventHandler);
        }
    };
}

