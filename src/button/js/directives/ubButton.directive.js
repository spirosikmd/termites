/* @ngInject */
function ubButton () {
  return {
    scope: {},
    restrict: 'E',
    controller: 'ubButtonController',
    controllerAs: 'ubButton',
    bindToController: true,
    templateUrl: 'ubButton.html',
    replace: true,
    transclude: true,
    link: function ($scope, iElm, iAttrs) {
      $scope.text = iAttrs.text;
    }
  };
}

module.exports = ubButton;
