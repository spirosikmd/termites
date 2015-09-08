require('../../src/module');

describe('ubButton', function () {
  var scope;
  var isolateScope;

  beforeEach(function () {
    angular.mock.module('karma.templates');
    angular.mock.module('usabilla.components');
    angular.mock.inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      var element = angular.element('<ub-button text="click"></ub-button>');
      $compile(element)(scope);
      scope.$digest();
      isolateScope = element.isolateScope();
    });
  });

  it('text should be set to "click"', function () {
    expect(isolateScope.text).toBe('click');
  });
});
