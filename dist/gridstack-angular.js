/**
 * gridstack-angular - Angular Gridstack.js directive
 * @version v0.6.0-dev
 * @author Kevin Dietrich
 * @link https://github.com/kdietrich/gridstack-angular#readme
 * @license MIT
 */
(function() {
'use strict';

angular.module('gridstack-angular', []);

var app = angular.module('gridstack-angular');

app.controller('GridstackController', ['$scope', function($scope) {
  var self = this;

  this.init = function(element, options) {
    self.gridstackHandler = element.gridstack(options).data('gridstack');
    return self.gridstackHandler;
  };

  this.removeItem = function(element) {
    if(self.gridstackHandler) {
      return self.gridstackHandler.removeWidget(element, false);
    }
    return null;
  };

  this.addItem = function(element) {
    if(self.gridstackHandler) {
      self.gridstackHandler.makeWidget(element);
      return element;
    }
    return null;
  };

}]);
})();

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
                gsItemAutopos: '=',
                gsItemResizable: '=',
                gsItemMovable: '=',
                // gsItemLocked sets whether moving/resizing other items move this item.
                gsItemLocked: '='
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
                if (!scope.gsItemResizable) {
                    element.attr('data-gs-no-resize', true);
                }
                if (!scope.gsItemMovable) {
                    element.attr('data-gs-no-move', true);
                }
                if (scope.gsItemLocked) {
                    element.attr('data-gs-locked', scope.gsItemLocked);
                }

                var widget = gridstackController.addItem(element);
                var item = element.data('_gridstack_node');
                $timeout(function() {
                    scope.onItemAdded({
                        item: item
                    });
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

                scope.$watch('gsItemResizable', function() {
                    gridstackController.gridstackHandler.resizable(element, scope.gsItemResizable);
                })
                scope.$watch('gsItemMovable', function() {
                    gridstackController.gridstackHandler.movable(element, scope.gsItemMovable);
                })
                scope.$watch('gsItemLocked', function() {
                    gridstackController.gridstackHandler.locked(element, scope.gsItemLocked);
                })

                // Update scope after gridstack attributes change
                scope.$watch(function() {
                    return element.attr('data-gs-id');
                }, function(val) {
                    scope.gsItemId = val;
                });

                scope.$watch(function() {
                    return element.attr('data-gs-x');
                }, function(val) {
                    scope.gsItemX = Number(val);
                });

                scope.$watch(function() {
                    return element.attr('data-gs-y');
                }, function(val) {
                    scope.gsItemY = Number(val);
                });

                scope.$watch(function() {
                    return element.attr('data-gs-width');
                }, function(val) {
                    scope.gsItemWidth = Number(val);
                });

                scope.$watch(function() {
                    return element.attr('data-gs-height');
                }, function(val) {
                    scope.gsItemHeight = Number(val);
                });

                // scope.$watch(function() {
                //     return element.attr('data-gs-no-resize');
                // }, function(val) {
                //     scope.gsItemResizable = !!val;
                // });
                //
                // scope.$watch(function() {
                //     return element.attr('data-no-move');
                // }, function(val) {
                //     scope.gsItemMovable = !!val;
                // });
                //
                // scope.$watch(function() {
                //     return element.attr('data-gs-locked');
                // }, function(val) {
                //     scope.gsItemLocked = !!val;
                // });

                element.bind('$destroy', function() {
                    var item = element.data('_gridstack_node');
                    scope.onItemRemoved({
                        item: item
                    });
                    gridstackController.removeItem(element);
                });

            }

        };

    }]);
})();
