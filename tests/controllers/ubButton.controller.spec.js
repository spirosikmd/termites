require('../../src/module');

describe('ubButtonController', function () {
  beforeEach(angular.mock.module('usabilla.modules'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('click', function () {
    it('logs "clicked"', function () {
      var $scope = {};
      var controller = $controller('ubButtonController', { $scope: $scope });
      controller.click();
      expect($scope.clicked).toEqual(true);
    });
  });
});
