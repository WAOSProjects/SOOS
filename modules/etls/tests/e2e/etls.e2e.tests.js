'use strict';

describe('Etls E2E Tests:', function () {
  describe('Test Etls page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/etls');
      expect(element.all(by.repeater('etl in etls')).count()).toEqual(0);
    });
  });
});
