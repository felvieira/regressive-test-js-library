'use strict';

const {
  userName,
  password,
  name,
} = require('../../lib/config/credentials.json');
const selectors = {
  homeBtnUser: 'input#user',
  homeBtnContinue: 'button#continue',
  homeBtnPass: 'input#password',
  homeBtnEnter: 'button#enter',
  homeBtnLoginEntrar: 'a#entrar',
  homeLoggedUser: 'strong.header__pswn-name',
};

module.exports = async (page, scenario, browser, viewPort) => {
  if (scenario.login && viewPort === 'desktop') {
    console.log('Breakpoint: ', viewPort);
    try {
      await page.goto(scenario.pageInitial, {
        waitUntil: 'networkidle0',
      });

      let pageType = {
        isLoggedUser: false,
        isHomeFaqEntrar: false,
        isHomeLoginEmail: false,
      };

      try {
        const isLogged = await page.waitForSelector(selectors.homeLoggedUser);
        const isLoggedUser = await isLogged.evaluate((el) =>
          el.innerText.includes(name)
        );
        pageType.isLoggedUser = !isLoggedUser;
      } catch (error) {
        console.log(
          '🚀 ~ isLogged Error- Não existe o seletor:',
          selectors.homeLoggedUser
        );
      }

      try {
        const homeFaqEntrar = await page.waitForSelector(
          selectors.homeBtnLoginEntrar
        );
        const isHomeFaqEntrar = await homeFaqEntrar.evaluate((el) =>
          Boolean(el)
        );
        pageType.isHomeFaqEntrar = isHomeFaqEntrar;
      } catch (error) {
        console.log(
          '🚀 ~ isHomeFaqEntrar Error- Não existe o seletor:',
          selectors.homeBtnLoginEntrar
        );
      }

      try {
        const homeLoginEmail = await page.waitForSelector(
          selectors.homeBtnUser
        );

        const isHomeLoginEmail = await homeLoginEmail.evaluate((el) =>
          Boolean(el)
        );
        pageType.isHomeLoginEmail = isHomeLoginEmail;
      } catch (error) {
        console.log(
          '🚀 ~ isHomeLoginEmail Error- Não existe o seletor:',
          selectors.homeBtnUser
        );
      }

      if (
        pageType.isLoggedUser ||
        pageType.isHomeFaqEntrar ||
        pageType.isHomeLoginEmail
      ) {
        console.log('Usuário não está logado, iniciando o login ...');
        if (pageType.isHomeFaqEntrar) {
          await page.click(selectors.homeBtnLoginEntrar);
          await page.waitFor(5000);
        }
        await page.waitFor(selectors.homeBtnUser);
        await page.type(selectors.homeBtnUser, userName);
        await page.click(selectors.homeBtnContinue);
        await page.waitFor(5000);
        await page.waitFor(selectors.homeBtnPass);
        await page.type(selectors.homeBtnPass, password);
        await page.click(selectors.homeBtnEnter);
        await page.waitFor(10000);
        console.log('Login feito com sucesso!');
      } else {
        console.log('Usuário já está logado');
      }
    } catch (error) {
      await page.close();
      await browser.close();
      console.log(
        `\n\nErro pageInitial na:${scenario.pageInitial} \n\n-> ${error}\n\n`
      );
      return;
    }
  }
};
