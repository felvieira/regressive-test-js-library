'use strict';
const PuppeteerHelpers = require('../../lib/helpers/puppeteerHelpers.js');

module.exports = async (page, scenario, browser, viewPort) => {
  try {
    // Navega para a página inicial do Google e aguarda pelo campo de busca.
    await PuppeteerHelpers.navigateToPageAndWaitForSelector(
      page,
      scenario.pageInitial,
      scenario.targetElementToWait
    );

    console.log('Página inicial do Google carregada.');

    // Digita o termo de busca no campo de busca e pressiona Enter.
    await PuppeteerHelpers.waitForSelectorAndType(
      page,
      scenario.targetElementToWait,
      scenario.searchQuery
    );
    await page.keyboard.press('Enter');

    // Aguarda até que os resultados da busca sejam carregados.
    await page.waitForSelector(scenario.targetElementToWaitAfterRedirect, {
      visible: true,
    });

    console.log(
      `Resultados da busca por "${scenario.searchQuery}" carregados com sucesso.`
    );

    return;
  } catch (error) {
    console.error(
      `Erro durante a busca por "${scenario.searchQuery}" na página ${scenario.pageInitial}:`,
      error
    );
    await PuppeteerHelpers.closePageAndBrowser(page, browser);
    return;
  }
};
