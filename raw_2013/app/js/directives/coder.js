angular.module('rawApp')
  .directive('coder', function () {
    return {
      restrict: 'E',
      scope : {
        source : '@',
        moviePath : '@'
      },
      template :  '<textarea id="source-to-copy" readonly class="span12 source-area" rows="4" ng-model="val"></textarea>',
                  //'<button class="btn btn-block" id="copy" value="source-to-copy">Copy</button>',

      link: function postLink(scope, element, attrs) {

        scope.val = "";

        function asHTML(){
          if (!$(scope.source).length) return "";
          return d3.select(scope.source)
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .node().parentNode.innerHTML;
        }

        scope.$watch(asHTML, function(){
          scope.val = asHTML();
        })
      }
    };
  });