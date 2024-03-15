'use strict';
const PuppeteerHelpers = require('../lib/helpers/puppeteerHelpers.js');
const { userName, password, name } = require('../lib/config/credentials.json');
const selectors = {
  homeBtnUser: '#user',
  homeBtnPass: '#pass',
  homeBtnLoginEntrar: '#signin',
  homeLoggedUser: '.MuiAvatar-root',
};

module.exports = async (page, scenario, browser, viewPort) => {
  const { homeBtnUser, homeBtnPass, homeBtnLoginEntrar, homeLoggedUser } =
    selectors;
  const { redirectToUrl, targetElementToWaitAfterRedirect } = scenario;

  try {
    // Navega para a página inicial e aguarda pelo seletor do usuário logado.
    await PuppeteerHelpers.navigateToPageAndWaitForSelector(
      page,
      scenario.pageInitial,
      homeBtnLoginEntrar
    );

    // Verifica se o usuário já está logado.
    const isLoggedUser = await PuppeteerHelpers.checkIfSelectorExists(
      page,
      homeLoggedUser
    );
    if (isLoggedUser) {
      console.log('Usuário já está logado');
      return;
    }

    console.log('Usuário não está logado, iniciando o login ...');

    // Processo de Login: preenche os campos de usuário e senha e clica no botão de entrar.
    await PuppeteerHelpers.waitForSelectorAndType(page, homeBtnUser, userName);
    await PuppeteerHelpers.waitForSelectorAndType(page, homeBtnPass, password);
    await PuppeteerHelpers.waitForSelectorAndClick(page, homeBtnLoginEntrar);

    // Aguarda até que o usuário esteja logado verificando a presença do seletor do usuário logado.
    await page.waitForSelector(homeLoggedUser, {
      visible: true,
      timeout: 7000,
    });

    console.log('Login realizado com sucesso!');

    // Redireciona para a URL especificada após o login, se necessário.
    if (redirectToUrl) {
      console.log(`Redirecionando para ${redirectToUrl} após o login...`);
      await PuppeteerHelpers.navigateToPageAndWaitForSelector(
        page,
        redirectToUrl,
        targetElementToWaitAfterRedirect
      );
      console.log(`Página ${redirectToUrl} carregada com sucesso.`);
    }

    return;
  } catch (error) {
    console.error(
      `Erro durante o processo de login na página ${scenario.pageInitial}:`,
      error
    );
    await PuppeteerHelpers.closePageAndBrowser(page, browser);
    return;
  }
};
