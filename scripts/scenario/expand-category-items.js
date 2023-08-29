'use strict';

const OpenUrl = require('./try-open-url');

module.exports = async (page, scenario, browser) => {
	const {
		header,
		search,
		cat01,
		cat02,
		cat03,
		cat04,
		cat05,
		businesshowMore,
	} = scenario.customSelectors;

	await OpenUrl(page, scenario, browser);

	if (scenario.viewPort === 'phone') {
		await page.evaluate(
			(header, search) => {
				document.querySelector(header).remove();
				document.querySelector(search).remove();
			},
			header,
			search
		);
	}
	await page.click(cat01);
	await page.click(cat02);
	await page.click(cat03);
	await page.click(cat04);
	await page.click(cat05);
	await page.click(businesshowMore);
};
