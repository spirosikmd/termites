/* @ngInject */
function abutton () {
  return {
    scope: {},
    restrict: 'E',
    controller: 'abuttonController',
    controllerAs: 'abutton',
    bindToController: true,
    templateUrl: 'abutton.html',
    replace: true,
    transclude: true,
    link: function ($scope, iElm, iAttrs) {
      $scope.text = iAttrs.text;
    }
  };
}

module.exports = abutton;
