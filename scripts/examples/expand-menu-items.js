'use strict';

const OpenUrl = require('./try-open-url');

module.exports = async (page, scenario, browser) => {
  const { mobileMenuToggle, firstLevelItem, secondLevelItem } =
    scenario.customSelectors;

  await OpenUrl(page, scenario, browser);

  if (scenario.viewPort === 'phone') {
    try {
      await page.click(mobileMenuToggle);
      await page.waitForTimeout(300);
      await page.click(firstLevelItem);
      await page.waitForTimeout(300);
      await page.click(secondLevelItem);
    } catch (error) {
      console.log('🚀 ~ Phone expand menu items ~ error', error);
    }
  } else {
    try {
      await page.hover(firstLevelItem);
      await page.waitForTimeout(300);
      await page.hover(secondLevelItem);
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log(
        `🚀 ~ ${scenario.viewPort} expand menu items ~ error ${error}`
      );
    }
  }
};
