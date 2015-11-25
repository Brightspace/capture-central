window.AngularCore || (window.AngularCore = {});

window.AngularCore.filters = angular.module('d2l.filters', []);

window.AngularCore.filters.filter("format", function () {
    return function (text, replacements) {
        var i, j, len, replacement;
        i = 0;
        for (j = 0, len = replacements.length; j < len; j++) {
            replacement = replacements[j];
            text = text.replace("{" + i + "}", replacement);
            i++;
        }
        return text;
    };
});

window.AngularCore.filters.filter('truncate', function () {
    return function (text, length, end) {
        if (isNaN(length)) {
            length = 10;
        }
        if (!end) {
            end = "...";
        }
        if (text.length <= length || text.length - end.length <= length) {
            return text;
        } else {
            return (String(text).substring(0, length - end.length)) + end;
        }
    };
});

window.AngularCore.directives = angular.module('d2l.directives', []);
