'use strict';

const OpenUrl = require('./try-open-url');

module.exports = async (page, scenario, browser) => {
  const { footerItem } = scenario.customSelectors;

  await OpenUrl(page, scenario, browser);
  if (scenario.viewPort === 'phone') {
    await page.evaluate(() => {
      let header = document.querySelector('header');
      let sections = document.querySelectorAll('section');
      let elements = [header, ...sections];
      elements.forEach((el) => {
        el.parentNode.removeChild(el);
      });
    });
    await page.click(footerItem);
  }
};
