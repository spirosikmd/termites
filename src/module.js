require('./templates');

/**
* usabilla.components Module
*
* The main usabilla components module
*/
angular.module('usabilla.modules', ['templates'])
  .controller('ubButtonController', require('./controllers/ubButton.controller'))
  .directive('ubButton', require('./directives/ubButton.directive'));
