'use strict';

describe('Articles E2E Tests:', function () {

  //var ptor = protractor.getInstance();

  var article = {
    title: 'Article Title',
    content: 'Article Content <b>(html test)</b>.'
  };

  var signin = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3000/');
    expect(element.all(by.css('.fa-sign-out')).count()).toEqual(1);
  };

  beforeAll(function () {
    signin();
  });

  describe('Test articles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/home/articles');
      expect(element.all(by.repeater('article in vm.articles')).count()).toEqual(0);
    });
  });

  describe('Test article Publish', function () {

    it('Click link for Publish', function () {
      element(by.css('a[href*=\'create\']')).click();
      expect(element.all(by.css('h3.title')).get(0).getText()).toBe('New Article');
    });

    it('Publish an article', function () {
      element(by.model('vm.article.title')).sendKeys(article.title);
      element(by.model('vm.article.content')).sendKeys(article.content);
      element(by.css('button[type=submit]')).click();

      expect(element.all(by.css('h3.title')).get(0).getText()).toBe(article.title);
    });

    it('Tcheck articles list', function () {
      browser.get('http://localhost:3000/home/articles');
      expect(element.all(by.repeater('article in vm.articles')).count()).toEqual(1);
    });

  });

  describe('Test article Edit and Delete', function () {

    it('Click link for Publish', function () {
      element(by.css('a[href*=\'create\']')).click();
      expect(element.all(by.css('h3.title')).get(0).getText()).toBe('New Article');
    });

    it('Publish an article', function () {
      element(by.model('vm.article.title')).sendKeys(article.title);
      element(by.model('vm.article.content')).sendKeys(article.content);
      element(by.css('button[type=submit]')).click();

      expect(element.all(by.css('h3.title')).get(0).getText()).toBe(article.title);
    });

    it('Click on button to Edit', function () {
      element(by.css('a[href*=\'edit\']')).click();
      expect(element.all(by.css('h3.title')).get(0).getText()).toBe('Edit Article');
    });

    it('Edit an article', function () {
      element(by.model('vm.article.title')).sendKeys(' edited');
      element(by.model('vm.article.content')).sendKeys(' I\'m a quick and funny edition :o.');
      element(by.css('button[type=submit]')).click();

      expect(element.all(by.css('h3.title')).get(0).getText()).toBe(article.title + ' edited');
    });

    it('Click on button to Delete', function () {
      element(by.css('.delete')).click();
      browser.switchTo().alert().accept();
      expect(element.all(by.repeater('article in vm.articles')).count()).toEqual(1);
    });

  });
});
