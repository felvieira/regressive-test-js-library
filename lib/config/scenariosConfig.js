const scenariosConfig = (urlBase) => {
  console.log('> A url pros prints é:', urlBase);
  return [
    {
      label: 'Google Home',
      pageInitial: urlBase,
      targetElementToWait: 'form[action="/search"]',
      fullPage: true,
    },
    {
      label: 'Google Search Results for Tesla',
      pageInitial: urlBase,
      targetElementToWait: 'form[action="/search"]',
      fullPage: true,
      pageScript: '../scripts/scenario/googleSearch.js', 
      searchQuery: 'Tesla', 
      targetElementToWaitAfterRedirect: '#search',
    },
  ];
};

module.exports = {
  scenariosConfig,
};
