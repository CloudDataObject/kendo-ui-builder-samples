'use strict';

angular.module('components')
    .directive('checkBox', function () {
        return {
            restrict: 'E',
            scope: true,
            bindToController: {
                id: '@',
                model: '=',
                events: '=',
                title: '@',
                defaultValue: '@',
                disabled: '@'
            },
            controller: function() {
            },
            controllerAs: 'vm',
            templateUrl: 'scripts/components/check-box/template.html'
        };
    });
