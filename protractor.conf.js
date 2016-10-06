'use strict';

// Protractor configuration
var config = {
  specs: ['modules/*/tests/e2e/*.js'],
  onPrepare: function() {
    setTimeout(function() {
      browser.driver.executeScript(function() {
        return {
          width: window.screen.availWidth,
          height: window.screen.availHeight
        };
      }).then(function(result) {
        browser.driver.manage().window().setSize(result.width, result.height);
      });
    });
  }
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
