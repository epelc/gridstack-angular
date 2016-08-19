(function() {
'use strict';

var app = angular.module('gridstack-angular');

app.directive('gridstack', ['$timeout', function($timeout) {

  return {
    restrict: 'A',
    controller: 'GridstackController',
    controllerAs: '$gridstack',
    bindToController: {
      onChange: '&',
      onDragStart: '&',
      onDragStop: '&',
      onResizeStart: '&',
      onResizeStop: '&',
      gridstackHandler: '=?',
      options: '='
    },
    link: function(scope, element, attrs, controller, ngModel) {
      controller.init(element, controller.options);

      element.on('change', function(e, items) {
        $timeout(function() {
          scope.$apply();
          controller.onChange({event: e, items: items});
        });
      });

      element.on('dragstart', function(e, ui) {
        controller.onDragStart({event: e, ui: ui});
      });

      element.on('dragstop', function(e, ui) {
        $timeout(function() {
          scope.$apply();
          controller.onDragStop({event: e, ui: ui});
        });
      });

      element.on('resizestart', function(e, ui) {
        controller.onResizeStart({event: e, ui: ui});
      });

      element.on('resizestop', function(e, ui) {
        $timeout(function() {
          scope.$apply();
          controller.onResizeStop({event: e, ui: ui});
        });
      });

    }
  };

}]);
})();
