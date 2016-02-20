require('./scripts/sauce/sauce_config.js');

exports.config = {
  specs: [ './e2e/**/*.spec.js' ],
  baseUrl: 'http://localhost:3333',
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  capabilities: {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_JOB_NUMBER,
    'name': 'Material 2 Protractor Tests'
  }
};
