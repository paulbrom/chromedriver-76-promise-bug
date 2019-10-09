"use strict";

const { remote } = require('webdriverio');

const navigateAndReload = browser =>
  browser.url('http://griffinford.com/searchused.aspx').then(() =>
    browser.$('div.srpVehicle p a').then(element =>
      element.waitForExist(5000).then(() => browser.execute(function(selectorStr, scrollAmt) {
        // EMCA5 inside execute()
        var elem = document.querySelector(selectorStr);
        if (elem && scrollAmt) {
          elem.scrollIntoView(false);
          window.scrollBy(0, scrollAmt);
        }
        // EMCA5 restriction ended
      }, 'div.srpVehicle p a', 0).then(() => browser.getTitle().then((title) => {
        console.log('no error yet - page title is', title);
        return Promise.resolve();
      }))
    )));

const keepNavigatingAndReloading = (browser, navigationsRemain) =>
  navigateAndReload(browser).then(() => {
    if (navigationsRemain) {
      return keepNavigatingAndReloading(browser, --navigationsRemain);
    }
    return Promise.resolve();
  });

(async () => {
  const browser = await remote({
    logLevel: 'trace',
    path: '/', // remove `path` if you decided using something different from driver binaries.
    capabilities: {
      browserName: 'chrome'
    },
    port: 9515,
  });

  await keepNavigatingAndReloading(browser, 50);

  await browser.deleteSession();
})().catch((e) => console.error(e));
