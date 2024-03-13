# PuppeteerHandler

A classe `PuppeteerHandler` é uma utilidade para automatizar a navegação web usando o Puppeteer, uma biblioteca que fornece uma API de alto nível para controlar o Chrome ou o Chromium sobre o protocolo DevTools. É ideal para automação web, realização de testes e2e e captura de screenshots ou PDFs de páginas web.

## Funcionalidades

- Inicialização personalizada do navegador e da página.
- Execução de scripts específicos da página.
- Navegação automática para uma URL específica.
- Captura de screenshots com opções personalizáveis.
- Suporte a múltiplos viewports para testes responsivos.

## Uso

### Configuração Inicial

Importe a classe `PuppeteerHandler` e crie uma instância passando um cenário e um viewport.

```javascript
const PuppeteerHandler = require('./PuppeteerHandler');
const scenario = {
  /* definição do seu cenário */
};
const viewPort = { width: 1280, height: 720 };
const handler = new PuppeteerHandler(scenario, viewPort);
```

### Executando Testes

Utilize o método `run` para executar o teste. Este método cuida da inicialização do navegador, execução de scripts de página (se houver), navegação, captura de tela e finalização.

```javascript
(async () => {
  await handler.run();
})();
```

### Métodos Principais

- **initializePage(browser):** Inicializa uma nova página no navegador com configurações personalizadas.
- **executePageScript(page):** Executa um script específico da página, se definido no cenário.
- **navigateToPage(page):** Navega para a URL especificada no cenário.
- **takeScreenshot(page):** Captura um screenshot da página atual. Suporta captura da página inteira ou de um elemento específico.
- **run():** Executa todo o processo de teste, desde a inicialização do navegador até a captura de tela e fechamento do navegador.

### Exemplo de Cenário

Um cenário típico pode incluir informações como a URL da página inicial, o elemento para esperar antes de tirar um screenshot, se a captura de tela deve ser da página inteira, entre outras.

```javascript
const scenario = {
  pageInitial: 'https://exemplo.com',
  targetElementToWait: '#elementoImportante',
  fullPage: true,
  url: 'https://exemplo.com/pagina',
  today: 'caminho/para/salvar/screenshot',
  pageScript: './caminho/para/script',
  target: '#elementoParaCapturar',
};
```

### Customização

Você pode personalizar o `PuppeteerHandler` para atender a necessidades específicas, como definir diferentes cabeçalhos de User-Agent, adicionar cookies ou armazenamento local, e muito mais, utilizando as APIs disponíveis do Puppeteer.
