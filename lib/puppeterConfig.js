'use strict';

const path = require('path');
const puppeteer = require('puppeteer');
const mathImage = require('./mathImages');
const { formatScenario } = require('./puppeterConfigFormat');
const yargs = require('yargs/yargs');
const { argv } = yargs(process.argv.slice(2));

class PuppeteerHandler {
  constructor(scenario, viewPort) {
    this.scenario = scenario;
    this.viewPort = viewPort;
    this.isHeadless = argv.headless !== 'false';
  }

  async initializePage(browser) {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
    );
    await page.setViewport({
      width: this.viewPort.width,
      height: this.viewPort.height,
      deviceScaleFactor: 1,
    });
    return page;
  }

  async executePageScript(page) {
    if (this.scenario.pageScript) {
      const pageScriptInit = require(this.scenario.pageScript);
      await pageScriptInit(page, this.scenario, this.browser, this.viewPort);
    } else {
      await this.navigateToPage(page);
    }
  }

  async navigateToPage(page) {
    const url = this.scenario.pageInitial || this.scenario.url;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector(this.scenario.targetElementToWait);
  }

  async takeScreenshot(page) {
    if (this.scenario.fullPage) {
      await page.screenshot({
        path: path.resolve(__dirname, '..', this.scenario.today),
        type: 'png',
        fullPage: true,
      });
    } else {
      const element = this.scenario.target
        ? await page.$(this.scenario.target)
        : page;
      const enableFullPage =
        this.scenario.breakPointFullpage &&
        this.scenario.breakPointFullpage.includes(this.viewPort);
      await element.screenshot({
        path: path.resolve(__dirname, '..', this.scenario.today),
        type: 'png',
        fullPage: enableFullPage,
      });
    }
  }

  async run() {
    this.scenario = await formatScenario(this.scenario, this.viewPort);
    this.browser = await puppeteer.launch({
      headless: this.isHeadless,
      userDataDir: argv.userDataDir || './user_data',
      args: [
        '--proxy-server="direct://"',
        '--proxy-bypass-list=*',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--ignore-certificate-errors',
        '--enable-features=NetworkService',
        '--disable-dev-shm-usage',
      ],
    });
    const page = await this.initializePage(this.browser);
    try {
      await this.executePageScript(page);
      await this.takeScreenshot(page);
      if (this.scenario.type !== 'reference') {
        await mathImage(this.scenario);
      }
    } catch (error) {
      console.error(
        `Error on page ${this.scenario.pageInitial || this.scenario.url}:\n${error}`
      );
    } finally {
      await page.close();
      await this.browser.close();
    }
    return this.scenario;
  }
}

module.exports = async (scenario, viewPort) => {
  const handler = new PuppeteerHandler(scenario, viewPort);
  return await handler.run();
};
