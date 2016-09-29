(function () {
    'use strict';

    angular
      .module('la.core')
      .filter('replaceUnderscore', replaceUnderscore);

    replaceUnderscore.$inject = ['string'];
    function replaceUnderscore(string) {
        return replaceUnderscoreFilter;

        function replaceUnderscoreFilter(input) {
            input = string(input).humanize().s;
            input = string(input).capitalize().s;
            return input;   
        }
    }
})();
