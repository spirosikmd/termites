/* @ngInject */
function ubButtonController ($scope) {
  this.click = function click () {
    $scope.text = 'clicked';
  };
}

module.exports = ubButtonController;
