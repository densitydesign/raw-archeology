'use strict';

angular.module('rawApp')
  .directive('color', function () {
    return {
      replace:false,
      scope: {
        colors: '='
      },
      template: //'<input colorpicker ng-repeat="(key,value) in colors" type="text" value="{{value}}" class="span12"></input>',
        '<input colorpicker ng-repeat="(key,value) in colors()" key="{{key}}" type="text" class="span12" value="{{value}}" on-change-color="prova">' +
        '--{{colors.values()}}--',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.prova = function(ev){
          console.log(scope.colors.values());

          scope.colors.value($(ev.target).attr("key"), ev.color.toHex());
          scope.$apply();
        }

        scope.$watch("colors",function(a,b){

        },true)

      }
    };
  });
