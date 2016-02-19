var sauceConnectLauncher = require('sauce-connect-launcher');

sauceConnectLauncher({
  username: process.env.SAUCE_USER,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
}, function (err, sauceConnectProcess) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Sauce Connect ready");
});
