(function () {
  'use strict';

  describe('Etls Route Tests', function () {
    // Initialize global variables
    var $scope,
      EtlsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EtlsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EtlsService = _EtlsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('etls');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/etls');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EtlsController,
          mockEtl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('etls.view');
          $templateCache.put('modules/etls/client/views/view-etl.client.view.html', '');

          // create mock Etl
          mockEtl = new EtlsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Etl Name'
          });

          //Initialize Controller
          EtlsController = $controller('EtlsController as vm', {
            $scope: $scope,
            etlResolve: mockEtl
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:etlId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.etlResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            etlId: 1
          })).toEqual('/etls/1');
        }));

        it('should attach an Etl to the controller scope', function () {
          expect($scope.vm.etl._id).toBe(mockEtl._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/etls/client/views/view-etl.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EtlsController,
          mockEtl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('etls.create');
          $templateCache.put('modules/etls/client/views/form-etl.client.view.html', '');

          // create mock Etl
          mockEtl = new EtlsService();

          //Initialize Controller
          EtlsController = $controller('EtlsController as vm', {
            $scope: $scope,
            etlResolve: mockEtl
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.etlResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/etls/create');
        }));

        it('should attach an Etl to the controller scope', function () {
          expect($scope.vm.etl._id).toBe(mockEtl._id);
          expect($scope.vm.etl._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/etls/client/views/form-etl.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EtlsController,
          mockEtl;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('etls.edit');
          $templateCache.put('modules/etls/client/views/form-etl.client.view.html', '');

          // create mock Etl
          mockEtl = new EtlsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Etl Name'
          });

          //Initialize Controller
          EtlsController = $controller('EtlsController as vm', {
            $scope: $scope,
            etlResolve: mockEtl
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:etlId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.etlResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            etlId: 1
          })).toEqual('/etls/1/edit');
        }));

        it('should attach an Etl to the controller scope', function () {
          expect($scope.vm.etl._id).toBe(mockEtl._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/etls/client/views/form-etl.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
