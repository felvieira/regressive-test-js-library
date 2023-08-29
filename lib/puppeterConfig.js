'use strict';

const path = require('path');
const puppeteer = require('puppeteer');
const mathImage = require('./mathImages');
const { formatScenario } = require('./puppeterConfigFormat');
const yargs = require('yargs/yargs');
const { argv } = yargs(process.argv.slice(2));

class PuppeteerHandler {
    static BROWSER_CONFIG = {
        headless: argv.headless || true,
        userDataDir: argv.userDataDir || './user_data',
        args: [
            '--proxy-server="direct://"',
            '--proxy-bypass-list=*',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--ignore-certificate-errors',
            '--enable-features=NetworkService',
            '--disable-dev-shm-usage',
        ]
    };

    constructor(scenario, viewPort) {
        this.scenario = scenario;
        this.viewPort = viewPort;
    }

    async initializePage(browser) {
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        );

        await page.setViewport({
            width: this.viewPort.width,
            height: this.viewPort.height,
            deviceScaleFactor: 1,
        });

        return page;
    }

    async navigateToPage(page) {
        const url = this.scenario.pageInitial || this.scenario.url;

        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitFor(this.scenario.targetElementToWait);
    }

    async takeScreenshot(page) {
        if (this.scenario.fullPage) {
            await page.screenshot({
                path: path.resolve(__dirname, '..', this.scenario.today),
                type: 'png',
                fullPage: true,
            });
        } else {
            const element = this.scenario.target ? await page.$(this.scenario.target) : page;
            const enableFullPage = this.scenario.breakPointFullpage?.includes(this.viewPort);
            
            await element.screenshot({
                path: path.resolve(__dirname, '..', this.scenario.today),
                type: 'png',
                fullPage: enableFullPage,
            });
        }
    }

    async run() {
        this.scenario = await formatScenario(this.scenario, this.viewPort);
        const browser = await puppeteer.launch(PuppeteerHandler.BROWSER_CONFIG);
        const page = await this.initializePage(browser);

        try {
            await this.navigateToPage(page);
            await this.takeScreenshot(page, this.viewPort);

            if (this.scenario.type !== 'reference') {
                await mathImage(this.scenario);
            }
        } catch (error) {
            console.error(`Error on page ${this.scenario.pageInitial || this.scenario.url}:\n${error}`);
        } finally {
            await page.close();
            await browser.close();
        }

        return this.scenario;
    }
}

module.exports = async (scenario, viewPort) => {
    const handler = new PuppeteerHandler(scenario, viewPort);
    return await handler.run();
};
