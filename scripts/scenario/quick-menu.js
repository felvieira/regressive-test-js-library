'use strict';

const OpenUrl = require('./try-open-url');

module.exports = async (page, scenario, browser) => {
	const { header, search, quickAcess } = scenario.customSelectors;

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

	scenario.customSelectors.scented
		? await page.type(quickAcess, 'Auxílio')
		: await page.type(quickAcess, 'auxilio');

	await page.waitFor(2000);
};
