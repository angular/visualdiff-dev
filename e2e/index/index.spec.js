var fs = require('fs');
var path = require('path');
var child_process  = require('child_process');
var mapnik = require('mapnik');
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
        throw new Error('screenshot "' + id + '" does not exist.');
      }
    });
  }

  function overwriteExistingScreenshot() {
    child_process.execSync('mv "' + tempPath + '" "' + screenshotPath + '"');
  }

  function compareImages() {
    //var gold = mapnik.Image.open(screenshotPath);
    //var temp = mapnik.Image.open(tempPath);
    //var changed = gold.compare(temp);
    //overwriteExistingScreenshot();
    //if (gold.compare(temp)) {
    //  throw new Error('screenshot "' + id + '" has changed.');
    //}
    var gold = fs.readFileSync(screenshotPath);
    var temp = fs.readFileSync(tempPath);
    resemble(gold)
        .compareTo(temp)
        .onComplete(function (data) {
          var changed = Number(data.misMathPercentage) > 0;
          overwriteExistingScreenshot();
          if (changed) {
            throw new Error('screenshot "' + id + '" has changed.');
          }
        });
  }
}