'use strict';

const Login = require('./login');

module.exports = async (page, scenario, browser) => {
  const {
    dropdown,
    dropdownItem,
    stillHaveDoubtsButton,
    sendMailContainer,
    textarea,
    sendMailButton,
    sendMailFeedback,
    sendMailAlert,
    attachmentInput,
    attachmentItem,
    targetElementToWait,
  } = scenario.customSelectors;
  const { flow, attachmentType } = scenario.customVariables
    ? scenario.customVariables
    : '';

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

  if (flow) {
    switch (flow) {
      case 'success':
        await page.type(textarea, 'Tenho uma mensagem para ser enviada');
        await page.click(sendMailButton);
        await page.waitFor(sendMailFeedback);
        return;
      case 'validation-error':
        await page.type(textarea, 'Tenho uma mensagem de Erro');
        await page.type(textarea, '<html></html>');
        await page.waitFor(sendMailAlert);
        return;
      case 'validation-warning':
        await page.type(textarea, 'a');
        await page.waitFor(sendMailAlert);
        return;
      case 'attachment':
        const inputElem = await page.$(attachmentInput);
        let files;
        switch (attachmentType) {
          case 'image':
            files = [
              '/test_files/image1.png',
              '/test_files/image2.jpg',
              '/test_files/image3.jpg',
            ];
            break;
          case 'document':
            files = [
              '/test_files/texto1.txt',
              '/test_files/texto2.pdf',
              '/test_files/texto3.doc',
              '/test_files/texto4.docx',
            ];
            break;
          case 'unknown':
            files = ['/test-files/invalid1.csv', '/test-files/invalid2.psd'];
            break;
          default:
            console.error('Invalid attachmentType');
            return;
        }
        files = files.map((file) => `${__dirname}/..${file}`);
        await inputElem.uploadFile(...files);
        for (let i = 0; i < files.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          await page.waitFor(
            `${attachmentItem}.attachment-item--${
              attachmentType === 'unknown' ? 'error' : 'complete'
            }[data-file-index="${i}"]`
          );
        }
        break;
      default:
    }
  }
};
