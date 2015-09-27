require('../../../src/abutton/js/abutton');

describe('abuttonController', function () {
  beforeEach(angular.mock.module('abutton'));

  var $controller;

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('click', function () {
    it('should change text to "clicked"', function () {
      var $scope = {};
      var controller = $controller('abuttonController', { $scope: $scope });
      controller.click();
      expect($scope.text).toEqual('clicked');
    });
  });
});
