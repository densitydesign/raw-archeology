'use strict';

angular.module('rawApp')
  .directive('colorpicker', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs) {
          element.colorpicker()
          	.on('changeColor', scope.$eval(attrs.onChangeColor));
      }
    };
  });