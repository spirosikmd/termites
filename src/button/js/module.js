require('./templates');

angular.module('ub.button', ['templates'])
  .controller('ubButtonController', require('./controllers/ubButton.controller'))
  .directive('ubButton', require('./directives/ubButton.directive'));
