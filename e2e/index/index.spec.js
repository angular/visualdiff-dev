var fs = require('fs');
var path = require('path');
var child_process  = require('child_process');
var resemble = require('node-resemble-js');

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
  var tempPath = path.resolve(__dirname, '../../screenshots', id + '.temp.png');

  browser.takeScreenshot().then(handleNewScreenshot);

  function handleNewScreenshot(png) {
    var newScreenshot = new Buffer(png, 'base64');
    fs.writeFile(tempPath, newScreenshot, checkForExistingScreenshot);
  }

  function checkForExistingScreenshot() {
    fs.access(screenshotPath, fs.F_OK, function (err) {
      if (!err) {
        compareImages();
      } else {
        overwriteExistingScreenshot();
      }
    });
  }

  function overwriteExistingScreenshot() {
    child_process.execSync('mv "' + tempPath + '" "' + screenshotPath + '"');
  }

  function compareImages() {
    var gold = fs.readFileSync(screenshotPath);
    var temp = fs.readFileSync(tempPath);
    resemble(temp)
        .compareTo(gold)
        .onComplete(function (data) {
          overwriteExistingScreenshot();
          if (data.misMatchPercentage > 0) {
            throw new Error('screenshot "' + id + '" does not match.');
          }
        });
  }
}