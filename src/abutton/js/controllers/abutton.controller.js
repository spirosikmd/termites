/* @ngInject */
function abuttonController ($scope) {
  this.click = function click () {
    $scope.text = 'clicked';
  };
}

module.exports = abuttonController;
