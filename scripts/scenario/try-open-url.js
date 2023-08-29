'use strict';

module.exports = async (page, scenario, browser) => {
	try {
		await page.goto(scenario.url, {
			waitUntil: 'networkidle0',
		});
		await page.waitFor(scenario.targetElementToWait);
	} catch (error) {
		await page.close();
		await browser.close();
		console.log(`\n\nErro na:${scenario.pageInitial} \n\n-> ${error}\n\n`);
		return;
	}
};
