/* @ngInject */
function ubButtonController ($scope) {
  $scope.clicked = false;
  this.click = function click () {
    $scope.clicked = true;
  };
}

module.exports = ubButtonController;
