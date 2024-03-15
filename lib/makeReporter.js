'use strict';

const fs = require('fs').promises;
const path = require('path');
const createHTML = require('create-html');

class ReportGenerator {
  constructor() {
    this.IMAGE_BASE_PATH = '../';
    this.REFERENCE_IMAGE_PATH = `${this.IMAGE_BASE_PATH}reference/`;
    this.REPORTER_PATH = path.resolve(__dirname, '..', 'reporter/');
  }

  getImagePath(type, imageFilePng, today, compatibility) {
    switch (type) {
      case 'reference':
        return `${this.REFERENCE_IMAGE_PATH}${imageFilePng}`;
      case 'test':
        return `${this.IMAGE_BASE_PATH}${today}`;
      case 'result':
        if (compatibility) {
          return `${this.IMAGE_BASE_PATH}${today.split('.')[0]}-diff.png`;
        }
        return '';
      default:
        return '';
    }
  }

  createCard(
    {
      viewPort,
      scenarioLabel,
      difference,
      compatibility,
      imageFilePng,
      today,
      pageInitial,
      redirectToUrl,
    },
    i
  ) {
    const createCardContentColumn = (type) => {
      const imagePath = this.getImagePath(
        type,
        imageFilePng,
        today,
        compatibility
      );
      return `
                <div class="card-content-column ${type}">
                    <div class="card-content-column-label">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                    <div class="card-content-column-img">
                        ${imagePath ? `<img src="${imagePath}" alt="">` : ''}
                    </div>
                </div>`.trim();
    };

    const createModal = () =>
      `
            <div id="modal-${i}" class="hide">
                <div class="close"></div>
                <div class="container">
                    <div class="modal content">
                        <img src="${this.IMAGE_BASE_PATH}${today}" alt="">
                        <img src="${this.REFERENCE_IMAGE_PATH}${imageFilePng}" alt="">
                    </div>
                </div>
            </div>`.trim();

    return `
            <div class="card" data-scenario="${viewPort}" data-label="${scenarioLabel}" data-difference="${difference || ''}" data-compatibility="${compatibility || ''}">
                <div class="card-label">
                    <span class="page">Página: ${scenarioLabel}</span> |
                    <span class="compatibility">${compatibility ? `Taxa de Compatibilidade:${compatibility}%` : 'Imagem com tamanhos diferentes'}</span> |
                    <span class="pixels">${difference ? `${difference} pixels diferentes` : ''}</span> |
                    <span>URL: <a href="${redirectToUrl ? redirectToUrl : pageInitial}" target="_blank">${redirectToUrl ? redirectToUrl : pageInitial}</a></span>
                </div>
                <div class="card-content">
                    ${['reference', 'test', 'result'].map(createCardContentColumn).join('')}
                </div>
                <div class="card-filename">filename: ${imageFilePng}</div>
                ${createModal()}
            </div>`.trim();
  }

  createHeaderButtons(items) {
    const viewPorts = new Set(items.map((item) => item.viewPort));
    return Array.from(viewPorts)
      .map((viewPort) => {
        const label = viewPort.charAt(0).toUpperCase() + viewPort.slice(1);
        return `<button class="${viewPort}">${label}</button>`;
      })
      .join(' ');
  }

  createHeader(items) {
    const viewPorts = new Set(items.map((item) => item.viewPort));
    const buttons = Array.from(viewPorts)
      .map((viewPort) => {
        const label = viewPort.charAt(0).toUpperCase() + viewPort.slice(1);
        return `<button class="${viewPort}">${label}</button>`;
      })
      .join(' ');

    return `
        <div class="header-title">Interface report</div>
        <div class="header-container-search">
          <div class="header-container-search-buttons">
            ${buttons}
            <button class="passed">Aprovados</button>
            <button class="reproved">Reprovados</button>
            <button class="sizes">Falhas</button>
            <button class="all">Todos</button>
          </div>
          <div class="header-container-search-input">
            <input type="text" placeholder="Insira sua busca aqui ..."/>
          </div>
        </div>`.trim();
  }

  async generate(items) {
    const reportFilePath = `${this.REPORTER_PATH}/index.html`;
    const html = createHTML({
      title: 'Relatório de Interface',
      script: 'script.js',
      css: 'style.css',
      lang: 'pt-br',
      head: `<meta charset="utf-8">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge">
                 <meta name="description" content="">
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <script src="https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.js"></script>`,
      body: `<div id="root"><div class="container">${this.createHeader(items)}${items.map(this.createCard.bind(this)).join('')}</div></div>`,
      favicon: 'favicon.png',
    });
    try {
      await fs.writeFile(reportFilePath, html);
      console.log('\nPágina de relatório criada com sucesso!');
    } catch (error) {
      console.error('\nErro ao criar relatório de teste:', error);
    }
  }
}

const makeReporter = new ReportGenerator();
module.exports = makeReporter;
