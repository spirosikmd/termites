require('./templates');

/**
* usabilla.components Module
*
* The main usabilla components module
*/
angular.module('usabilla.modules', ['templates'])
  .controller('ubButtonController', require('./js/controllers/ubButton.controller'))
  .directive('ubButton', require('./js/directives/ubButton.directive'));
