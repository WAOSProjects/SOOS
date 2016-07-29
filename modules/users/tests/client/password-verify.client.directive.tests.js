'use strict';

(function() {
  // Password Verify Directive Spec
  describe('PasswordVerifyDirective', function() {
    // Initialize global variables
    var scope,
      $httpBackend,
      element,
      $compile,
      form,
      Authentication;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_, _Authentication_) {
      // Set a new global scope
      scope = _$rootScope_.$new();
      $compile = _$compile_,
      $httpBackend = _$httpBackend_,
      Authentication = _Authentication_;

      Authentication.user = {
        username: 'Fred',
        roles: ['user']
      };
      Authentication.token = '65d6sdq56sd21ds8qs7d53qs4d234ds8q7sd53q4sd24';

      $httpBackend.expectGET(/api\/users|me/).respond({ user :Authentication.user, token: Authentication.token });

      scope.passwordMock = {
        newPassword: 'P@ssw0rd!!',
        verifyPassword: 'P@ssw0rd!!'
      };
    }));

    afterEach(inject(function (Authentication) {
      Authentication.signout();
    }));

    function compileDirective(template) {
      // function to compile a fresh directive with the given template, or a default one
      // input form with directive
      if (!template) template = '<input type="password" id="newPassword" name="newPassword" class="form-control" ng-model="passwordMock.newPassword" placeholder="New Password" autocomplete="new-password" uib-popover="{{getPopoverMsg}}" uib-popover-trigger="focus" uib-popover-placement="top" password-validator required>' +
        '<input type="password" id="verifyPassword" name="verifyPassword" class="form-control" ng-model="passwordMock.verifyPassword" placeholder="Verify Password" password-verify="passwordMock.newPassword" required>';
      template = '<form name="form"><div>' + template + '<input type="submit">submit form</input></div></form>';

      // inject allows you to use AngularJS dependency injection
      // to retrieve and use other services
      inject(function($compile) {
        var form = $compile(template)(scope);
        element = form.find('div');

        // $digest is necessary to finalize the directive generation
        scope.$digest();
      });
    }

    describe('Initialize', function() {
      beforeEach(function () {
        compileDirective();
      });

      it('should produce the password input', function () {
        expect(element.find('input').length).toEqual(3);
      });

      it('should check form validity upon initializing', function () {
        expect(scope.form.$valid).toBeTruthy();
      });

    });

    it('should not show error when passwords match', function () {
      compileDirective();
      scope.passwordMock.newPassword = 'P@ssw0rd!!';
      scope.passwordMock.verifyPassword = 'P@ssw0rd!!';
      scope.$digest();

      expect(scope.form.newPassword.$valid).toBeTruthy();
      expect(scope.form.newPassword.$error).toEqual({});
      expect(scope.form.verifyPassword.$valid).toBeTruthy();
      expect(scope.form.verifyPassword.$error).toEqual({});
      expect(scope.form.$valid).toBeTruthy();
    });

    it('should show error when passwords do not match', function () {
      compileDirective();
      scope.passwordMock.newPassword = 'P@ssw0rd!!';
      scope.passwordMock.verifyPassword = 'P@ssw0rd!';
      scope.$digest();

      expect(scope.form.newPassword.$valid).toBeTruthy();
      expect(scope.form.newPassword.$error).toEqual({});
      expect(scope.form.verifyPassword.$valid).toBeFalsy();
      expect(scope.form.verifyPassword.$error.passwordVerify).toBeTruthy();
      expect(scope.form.$valid).toBeFalsy();
    });

  });
}());
