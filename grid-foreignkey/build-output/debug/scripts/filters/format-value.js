(function(angular) {

    angular
        .module('grid-foreignkey')
        .filter('formatValue', function() { 
            return function(input, format) {
                if (input !== null && input !== undefined) {
                    return kendo.format(format, input);
                } else {
                    return '';
                }
            }
        })
})(angular);