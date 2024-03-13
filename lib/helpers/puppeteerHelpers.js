class PuppeteerHelpers {
  static async waitForSelectorAndClick(
    page,
    selector,
    options = { visible: true }
  ) {
    await page.waitForSelector(selector, options);
    await page.click(selector);
  }

  static async waitForSelectorAndType(
    page,
    selector,
    text,
    options = { visible: true }
  ) {
    await page.waitForSelector(selector, options);
    await page.type(selector, text);
  }

  static async navigateToPageAndWaitForSelector(
    page,
    url,
    selector,
    options = { waitUntil: 'networkidle0' }
  ) {
    await page.goto(url, options);
    await page.waitForSelector(selector, { visible: true });
  }

  static async checkIfSelectorExists(page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async navigateToPage(
    page,
    url,
    options = { waitUntil: 'networkidle0' }
  ) {
    await page.goto(url, options);
  }

  static async closePageAndBrowser(page, browser) {
    await page.close();
    await browser.close();
  }
}

module.exports = PuppeteerHelpers;
