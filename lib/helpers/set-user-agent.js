'use strict';

module.exports = async (page, vp) => {
  if (vp.label === 'phone') {
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4'
    );
  }
};
