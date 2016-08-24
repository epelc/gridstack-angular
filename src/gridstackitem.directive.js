(function() {
'use strict';

var app = angular.module('gridstack-angular');

app.directive('gridstackItem', ['$timeout', function($timeout) {

  return {
    restrict: 'A',
    require: '^gridstack',
    scope: {
      gridstackItem: '=',
      onItemAdded: '&',
      onItemRemoved: '&',
      gsItemId: '=?',
      gsItemX: '=',
      gsItemY: '=',
      gsItemWidth: '=',
      gsItemHeight: '=',
      gsItemAutopos: '='
    },
    link: function(scope, element, attrs, gridstackController) {
      if (scope.gsItemId) {
        element.attr('data-gs-id', scope.gsItemId);
      }
      element.attr('data-gs-x', scope.gsItemX);
      element.attr('data-gs-y', scope.gsItemY);
      element.attr('data-gs-width', scope.gsItemWidth);
      element.attr('data-gs-height', scope.gsItemHeight);
      element.attr('data-gs-auto-position', scope.gsItemAutopos);
      var widget = gridstackController.addItem(element);
      var item = element.data('_gridstack_node');
      $timeout(function() {
        scope.onItemAdded({item: item});
      });

      // Update gridstack element after scope changes
      // NOTE we must only make a gridstack update call for these watchers if something changed.
      // Otherwise it will cause issues with the 'change' event not firing because you ran an
      // update op partway through it.
      scope.$watchGroup(['gsItemX', 'gsItemY', 'gsItemWidth', 'gsItemHeight'], function() {
        if (Number(element.attr('data-gs-x')) !== scope.gsItemX ||
          Number(element.attr('data-gs-y')) !== scope.gsItemY ||
          Number(element.attr('data-gs-width')) !== scope.gsItemWidth ||
          Number(element.attr('data-gs-height')) !== scope.gsItemHeight) {
          gridstackController.gridstackHandler.update(element, scope.gsItemX, scope.gsItemY,
            scope.gsItemWidth, scope.gsItemHeight);
        }
      });

      // Update scope after gridstack attributes change
      scope.$watch(function() { return element.attr('data-gs-id'); }, function(val) {
        scope.gsItemId = val;
      });

      scope.$watch(function() { return element.attr('data-gs-x'); }, function(val) {
        scope.gsItemX = Number(val);
      });

      scope.$watch(function() { return element.attr('data-gs-y'); }, function(val) {
        scope.gsItemY = Number(val);
      });

      scope.$watch(function() { return element.attr('data-gs-width'); }, function(val) {
        scope.gsItemWidth = Number(val);
      });

      scope.$watch(function() { return element.attr('data-gs-height'); }, function(val) {
        scope.gsItemHeight = Number(val);
      });

      element.bind('$destroy', function() {
        var item = element.data('_gridstack_node');
        scope.onItemRemoved({item: item});
        gridstackController.removeItem(element);
      });

    }

  };

}]);
})();
