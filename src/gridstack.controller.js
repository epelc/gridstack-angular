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
