const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
  await p.goto('file://' + __dirname + '/store-assets.html');
  await p.frameLocator('#shot3 iframe').locator('#text').fill('Holiday gift for you');
  await p.waitForTimeout(500);
  const out = __dirname + '/../store/';
  await p.locator('#shot1').screenshot({ path: out + 'screenshot-1.png' });
  await p.locator('#shot2').screenshot({ path: out + 'screenshot-2.png' });
  await p.locator('#shot3').screenshot({ path: out + 'screenshot-3.png' });
  await p.locator('#tile').screenshot({ path: out + 'promo-small-440x280.png' });
  await b.close();
})();
