const scenariosConfig = (urlBase) => {
  console.log('> A url pros prints é:', urlBase);
  return [
    {
      label: 'Login',
      pageInitial: urlBase,
      targetElementToWait: '.logo-text-container',
      fullPage: true,
    },
    {
      label: 'Home',
      pageInitial: `${urlBase}/sign-in`,
      targetElementToWait: '.MuiAvatar-root',
      fullPage: true,
      pageScript: '../scripts/login.js',
      redirectToUrl: `${urlBase}/home`,
      targetElementToWaitAfterRedirect: `.breadcrumbs`,
    },
    {
      label: 'Home Aplicações',
      pageInitial: `${urlBase}/sign-in`,
      targetElementToWait: '.MuiAvatar-root',
      fullPage: true,
      pageScript: '../scripts/login.js',
      redirectToUrl: `${urlBase}/applications`,
      targetElementToWaitAfterRedirect: `.breadcrumbs`,
    },
    {
      label: 'Home Library',
      pageInitial: `${urlBase}/sign-in`,
      targetElementToWait: '.MuiAvatar-root',
      fullPage: true,
      pageScript: '../scripts/login.js',
      redirectToUrl: `${urlBase}/library`,
      targetElementToWaitAfterRedirect: `.breadcrumbs`,
    },
    {
      label: 'Home Mobile',
      pageInitial: `${urlBase}/sign-in`,
      targetElementToWait: '.MuiAvatar-root',
      fullPage: true,
      pageScript: '../scripts/login.js',
      redirectToUrl: `${urlBase}/mobile`,
      targetElementToWaitAfterRedirect: `.breadcrumbs`,
    },
  ];
};

module.exports = {
  scenariosConfig,
};
