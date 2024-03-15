'use strict';

const Login = require('../login');

module.exports = async (page, scenario, browser) => {
  const { targetElementToWait, targetLoggedUrl } = scenario;
  try {
    await Login(page, scenario, browser, scenario.viewPort);

    console.log('Login bem-sucedido, navegando para a página alvo.');

    await page.goto(targetLoggedUrl, { waitUntil: 'networkidle0' });

    await page
      .waitForSelector(targetElementToWait, { visible: true, timeout: 12000 })
      .catch((e) => {
        throw new Error(
          'Timeout esperando pelo elemento na página alvo após o login.'
        );
      });
    console.log('Página alvo carregada com sucesso.');
  } catch (error) {
    console.error(
      `Erro após login na página ${scenario.targetLoggedUrl}: ${error}`
    );
    await page.close();
    await browser.close();
  }
};
