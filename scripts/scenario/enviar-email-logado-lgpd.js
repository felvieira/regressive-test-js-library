'use strict';

const Login = require('../login');

module.exports = async (page, scenario, browser) => {
	const {
		dropdown,
		dropdownItem,
		stillHaveDoubtsButton,
		sendMailContainer,
		sendMailButton,
		sendMailFeedbackSuccess,
		sendMailFeedbackWait,
		targetElementToWait,
		textarea,
	} = scenario.customSelectors;

	const { flow } = scenario.customVariables ? scenario.customVariables : '';

	await Login(page, scenario, browser, scenario.viewPort);

	try {
		await page.goto(scenario.targetLoggedUrl, {
			waitUntil: 'networkidle0',
		});
	} catch (error) {
		await page.close();
		await browser.close();
		console.log(
			`\n\nErro apos login na:${scenario.pageInitial} \n\n-> ${error}\n\n`
		);
		return;
	}

	async function lgpdFlow(dropdownItem, sendMailFeedback, textarea) {
		await page.waitFor(targetElementToWait);

		await page.click(dropdown);
		await page.click(dropdownItem);

		await page.waitFor(stillHaveDoubtsButton, {
			visible: true,
		});
		await page.click(stillHaveDoubtsButton);
		await page.waitFor(sendMailContainer, {
			visible: true,
		});

		if (textarea) {
			await page.type(textarea, 'Tenho uma mensagem para ser enviada');
		}

		await page.click(sendMailButton);
		await page.waitFor(sendMailFeedback);
	}

	if (flow) {
		switch (flow) {
			case 'lgpd-anonymization':
				await lgpdFlow(dropdownItem, sendMailFeedbackWait);
				return;
			case 'lgpd-sharing':
				await lgpdFlow(dropdownItem, sendMailFeedbackWait);
				return;
			case 'lgpd-deletion':
				await lgpdFlow(dropdownItem, sendMailFeedbackWait);
				return;
			case 'lgpd-forgot':
				await lgpdFlow(dropdownItem, sendMailFeedbackSuccess);
				return;
			case 'lgpd-gathering':
				await lgpdFlow(dropdownItem, sendMailFeedbackSuccess);
				return;
			case 'lgpd-others':
				await lgpdFlow(dropdownItem, sendMailFeedbackSuccess, textarea);
				return;
			case 'lgpd-portability':
				await lgpdFlow(dropdownItem, sendMailFeedbackWait);
				return;
			default:
		}
	}
};
