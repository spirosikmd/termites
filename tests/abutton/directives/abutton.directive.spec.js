require('../../../src/abutton/js/abutton');

describe('abutton', function () {
  var scope;
  var isolateScope;

  beforeEach(function () {
    angular.mock.module('karma.templates');
    angular.mock.module('abutton');
    angular.mock.inject(function ($rootScope, $compile) {
      scope = $rootScope.$new();
      var element = angular.element('<abutton text="click"></abutton>');
      $compile(element)(scope);
      scope.$digest();
      isolateScope = element.isolateScope();
    });
  });

  it('text should be set to "click"', function () {
    expect(isolateScope.text).toBe('click');
  });
});
