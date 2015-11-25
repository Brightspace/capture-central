var angular = require('angular');
var contextButtonTemplateUrl = require('./html/context_button_template.html');
var sorterTemplateUrl = require('./html/sorter_template.html');
var presentationTemplateUrl = require('./html/presentation_template.html');

window.CaptureCentral || (window.CaptureCentral = {});

window.CaptureCentral.directives = angular.module('d2l.capturecentral.directives', []);

window.CaptureCentral.directives.directive('d2lContextButton', function () {
    return {
        templateUrl: contextButtonTemplateUrl,
        restrict: 'EA',
        scope: {
            presentation: '=d2lPresentation',
            addToContext: '&d2lAddToContext',
            removeFromContext: '&d2lRemoveFromContext',
            contextId: '=d2lContextId',
            buttonClass: '=d2lButtonClass',
            contextLabel: '=d2lContextLabel',
            show: '=d2lShow',
            addToContextString: '=',
            removeFromContextString: '='
        }
    };
});

window.CaptureCentral.directives.directive('d2lSorter', function () {
    return {
        templateUrl: sorterTemplateUrl,
        restrict: 'E',
        scope: {
            sortOptions: '=',
            selectedField: '=',
            selectedOrder: '=',
            sortByString: '@',
            constants: '=',
            dateAscending: '@',
            dateDescending: '@',
            alphabeticalAscending: '@',
            alphabeticalDescending: '@'
        },
        link: function (scope, element, attrs) {
            var getSortDescriptor, key, ref, val;
            getSortDescriptor = function (type, order) {
                console.dir(order);
                if (type === 'date') {
                    if (order === scope.constants.SortOrder.Descending) {
                        return scope.dateDescending;
                    } else {
                        return scope.dateAscending;
                    }
                } else {
                    if (order === scope.constants.SortOrder.Ascending) {
                        return scope.alphabeticalDescending;
                    } else {
                        return scope.alphabeticalAscending;
                    }
                }
            };
            scope.sortTypes = [];
            ref = scope.sortOptions;
            for (key in ref) {
                val = ref[key];
                scope.sortTypes.push({
                    field: key,
                    name: val.displayName + " (" + getSortDescriptor(val.type, scope.constants.SortOrder.Descending) + ")",
                    order: scope.constants.SortOrder.Descending
                });
                scope.sortTypes.push({
                    field: key,
                    name: val.displayName + " (" + getSortDescriptor(val.type, scope.constants.SortOrder.Ascending) + ")",
                    order: scope.constants.SortOrder.Ascending
                });
            }
            scope.selectedSortType = scope.sortTypes[0];
            return scope.setSorting = function (selectedSortType) {
                scope.selectedField = selectedSortType.field;
                return scope.selectedOrder = selectedSortType.order;
            };
        }
    };
});

window.CaptureCentral.directives.directive('d2lPresentation', function () {
    return {
        templateUrl: presentationTemplateUrl,
        restrict: 'E',
        scope: {
            watch: '=d2lWatch',
            presentation: '=d2lPresentation',
            addToContext: '&d2lAddToContext',
            removeFromContext: '&d2lRemoveFromContext',
            contextId: '=d2lContextId',
            contextLabel: '=d2lContextLabel',
            isManager: '=d2lIsManager',
            addToContextString: '=',
            removeFromContextString: '=',
            byPresenterString: '=',
            liveString: '=',
            selectPresentationString: '=',
            constants: '=',
            singleSelection: '='
        }
    };
});
