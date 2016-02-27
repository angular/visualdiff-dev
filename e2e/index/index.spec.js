var https = require('https');
var fs = require('fs');
var path = require('path');
var child_process  = require('child_process');
var mapnik = require('mapnik');

var SHA = process.env.TRAVIS_COMMIT;

function screenshot(id) {
  var screenshotPath = path.resolve(__dirname, '..', '..', 'screenshots', id + '.screenshot.png');
  var screenshotUrl = `https://media.githubusercontent.com/media/angular/visualdiff-dev/${ SHA }/screenshots/${ encodeURIComponent(id) }.screenshot.png`;
  var newScreenshot;

  browser.takeScreenshot().then(handleNewScreenshot);

  function handleNewScreenshot(png) {
    status(`Generated new screenshot for "${ id }"`);
    newScreenshot = mapnik.Image.fromBytes(new Buffer(png, 'base64'));
    if (SHA) downloadGoldFromGithub();
    else compareImages();
  }

  function downloadGoldFromGithub() {
    status('Downloading gold screenshot from Github');
    child_process.execSync(`curl ${screenshotUrl} > "${screenshotPath}"`);
    compareImages();
  }

  function overwriteExistingScreenshot() {
    newScreenshot.save(screenshotPath);
  }

  function compareImages() {
    status('Comparing new screenshot to gold');
    try {
      var goldScreenshot = mapnik.Image.open(screenshotPath);
      var changed = goldScreenshot.compare(newScreenshot);
      overwriteExistingScreenshot();
      if (changed) {
        throw new Error('screenshot "' + id + '" has changed.');
      } else {
        status('Screenshot matches gold');
      }
    } catch (e) {
      status('Gold screenshot not found');
      overwriteExistingScreenshot();
      throw new Error('screenshot "' + id + '" was not found.');
    }
  }
}

function status(msg) {
  console.info('STATUS', msg);
}

describe('hello, protractor', function () {
  describe('index', function () {
    it('should have a title', function () {
      browser.get('/#');
      expect(browser.getTitle()).toBe('Protractor Test');
      screenshot('simple header');
      screenshot('another screenshot');
    });
  });
});
