
# Projeto de Testes de Regressão Visual

Este projeto utiliza Puppeteer para automação de navegadores, permitindo a captura de screenshots de diferentes páginas web em vários breakpoints (viewports) para fins de testes de regressão visual.

## Demo
![Demonstração](demo.gif)

## Demo em Vídeo

https://youtu.be/qoJjMfsdpwg


## Configuração

O projeto é configurado através de arquivos JSON, onde você pode definir os cenários de teste (`scenariosConfig`) e os viewports (`viewport.json`). Cada cenário define uma página para teste, junto com elementos específicos para aguardar antes da captura da screenshot, e qualquer ação necessária como login através de scripts adicionais.

### scenariosConfig

O arquivo `scenariosConfig` permite definir as URLs e os elementos-chave para os testes. Para adicionar um novo cenário, como capturar a tela inicial do Google, você pode adicionar:

```json
{
  "label": "Google Home",
  "pageInitial": "https://www.google.com",
  "targetElementToWait": "form[action='/search']",
  "fullPage": true
}
```

E para uma busca no Google:

```json
{
  "label": "Google Search",
  "pageInitial": "https://www.google.com",
  "targetElementToWait": "form[action='/search']",
  "fullPage": true,
  "pageScript": "../scripts/searchGoogle.js"
}
```

O `pageScript` é opcional e pode ser usado para interações mais complexas como preenchimento de formulários ou navegação.

### Viewport

No arquivo `viewport.json`, você pode definir os diferentes tamanhos de tela para os testes, como desktop, tablet e mobile.

## Build

Para preparar o projeto para execução, é necessário fazer o build dos arquivos através do Parcel. Utilize o seguinte comando:

```bash
yarn build
```

Ou, se preferir, utilize o NPM:

```bash
npm run build
```

Isso vai gerar os arquivos necessários na pasta `dist`.

## Execução dos Testes

Para executar os testes, use:

```bash
yarn test
```

Para rodar os testes visualizando o navegador (modo não-headless):

```bash
yarn test --headless=false
```

O comando `yarn test` está configurado para usar a URL `http://localhost:3001`, mas você pode alterar isso no arquivo `package.json` ou diretamente nos cenários de teste (`scenariosConfig`).

## Utilizando Puppeteer

Este projeto faz uso extensivo do Puppeteer para interagir com o navegador, capturar screenshots e comparar as imagens de teste com as imagens de referência, facilitando a detecção de alterações visuais entre diferentes versões das páginas web testadas.

---

Ao seguir estas instruções, você será capaz de configurar e executar testes de regressão visual para suas páginas web, garantindo que alterações no código não afetem a aparência e o funcionamento esperados.
