require('../../../src/button/js/module');

describe('ubButtonController', function () {
  beforeEach(angular.mock.module('ub.button'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('click', function () {
    it('should change text to "clicked"', function () {
      var $scope = {};
      var controller = $controller('ubButtonController', { $scope: $scope });
      controller.click();
      expect($scope.text).toEqual('clicked');
    });
  });
});