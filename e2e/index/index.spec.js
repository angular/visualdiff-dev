var fs = require('fs');
var resemble = require('node-resemble-js');
var path = require('path');

describe('hello, protractor', function () {
  describe('index', function () {
    it('should have a title', function () {
      browser.get('/#');
      expect(browser.getTitle()).toBe('Protractor Test');
      screenshot('simple header');
    });
  });
});

function screenshot(id) {
  var screenshotPath = path.resolve(__dirname, '../../screenshots', id + '.screenshot.png');
  browser.takeScreenshot().then(handleScreenshot);

  function handleScreenshot(png) {
    compareToMaster(new Buffer(png, 'base64'));
  }

  function compareToMaster(screenshot) {
    fs.readFile(screenshotPath, function (err, gold) {
      if (err) {
        writeImage(screenshot, screenshotPath);
      } else {
        compareImages(screenshot, gold);
      }
    });
  }

  function writeImage(image, path) {
    fs.writeFile(path, image);
  }

  function compareImages(screenshot, gold) {
    resemble(screenshot).compareTo(gold).onComplete(function (data) {
      if (data.misMatchPercentage > 0) {
        throw new Error('Screenshot "' + id + '" does not match.');
      }
    });
  }
}