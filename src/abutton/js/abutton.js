require('./templates');

angular.module('abutton', ['templates'])
  .controller('abuttonController', require('./controllers/abutton.controller'))
  .directive('abutton', require('./directives/abutton.directive'));
