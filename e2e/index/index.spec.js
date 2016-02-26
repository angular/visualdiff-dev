var https = require('https');
var fs = require('fs');
var path = require('path');
var child_process  = require('child_process');
var mapnik = require('mapnik');

var SHA = process.env.TRAVIS_COMMIT;

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
  var screenshotPath = path.resolve(__dirname, '..', '..', 'screenshots', id + '.screenshot.png');
  var screenshotUrl = 'https://raw.githubusercontent.com/angular/visualdiff-dev/' + SHA + '/screenshots/' + id + '.screenshot.png';
  //-- temporary: for now, just look at master
  screenshotUrl = 'https://media.githubusercontent.com/media/angular/visualdiff-dev/master/screenshots/' + encodeURIComponent(id) + '.screenshot.png'

  console.log(JSON.stringify(screenshotUrl));
  var goldScreenshot, newScreenshot;

  browser.takeScreenshot().then(handleNewScreenshot);

  function handleNewScreenshot(png) {
    newScreenshot = new Buffer(png, 'base64');
    getExistingScreenshot();
  }

  function getExistingScreenshot() {
    child_process.execSync('curl "' + screenshotUrl + '" > "' + screenshotPath + '"');
    compareImages();
  }

  function overwriteExistingScreenshot() {
    mapnik.Image.fromBytes(newScreenshot).save(screenshotPath);
  }

  function compareImages() {
    var gold = mapnik.Image.open(screenshotPath);
    var temp = mapnik.Image.fromBytes(newScreenshot);
    var changed = gold.compare(temp);
    overwriteExistingScreenshot();
    if (changed) {
      throw new Error('screenshot "' + id + '" has changed.');
    }
  }
}
