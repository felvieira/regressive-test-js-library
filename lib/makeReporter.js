"use strict";

const fs = require("fs").promises;
const path = require("path");
const createHTML = require("create-html");

const templateCard = (item, i) => {
  const commonCardTemplate = `
        <div class="card"
        data-scenario="${item.viewPort}"
        data-label="${item.scenarioLabel}"
        data-difference="${item.difference || ""}"
        data-compatibility="${item.compatibility || ""}">
            <div class="card-label">
                <span class="page">Página: ${item.scenarioLabel}</span> |
                <span class="compatibility">${
                  item.compatibility
                    ? `Taxa de Compatibilidade:${item.compatibility}%`
                    : "Imagem com tamanhos diferentes"
                }</span> |
                <span class="pixels">${
                  item.difference ? `${item.difference} pixels diferentes` : ""
                }</span> |
                <span>URL: <a href="${item.url}"target="_blank">${
    item.url
  }</a></span>
            </div>
            <div class="card-content">
                <div class="card-content-column reference">
                    <div class="card-content-column-label">Reference</div>
                    <div class="card-content-column-img">
                        <img src="../reference/${item.imageFilePng}" alt="">
                    </div>
                </div>
                <div class="card-content-column test">
                    <div class="card-content-column-label">Test</div>
                    <div class="card-content-column-img">
                        <img src="../${item.today}" alt="">
                    </div>
                </div>
                <div class="card-content-column result">
                    <div class="card-content-column-label">${
                      item.compatibility ? "RESULT" : "SEM IMAGEM DE TESTE"
                    }</div>
                    <div class="card-content-column-img">
                        ${
                          item.compatibility
                            ? `<img src="../${item.test}" alt="">`
                            : ""
                        }
                    </div>
                </div>
            </div>
            <div class="card-filename">filename: ${item.imageFilePng}</div>
            <div id="modal-${i}" class="hide">
                <div class="close"></div>
                <div class="container">
                    <div class="modal content">
                        <img src="../${item.today}" alt="">
                        <img src="../reference/${item.imageFilePng}" alt="">
                    </div>
                </div>
            </div>
        </div>`.trim();

  return commonCardTemplate;
};

const templateMain = (items) => {
  return `
<div id="root">
    <div class="container">
        <div class="header">
            <div class="header-title">Interface report</div>
            <div class="header-container-search">
                <div class="header-container-search-buttons">
                    <button class="phone">Mobile</button>
                    <button class="tablet">Tablet</button>
                    <button class="desktop">Desktop</button>
                    <button class="passed">Aprovados</button>
                    <button class="reproved">Reprovados</button>
                    <button class="sizes">Falhas</button>
                    <button class="all">Todos</button>
                </div>
                <div class="header-container-search-input">
                    <input type="text" placeholder="Insira sua busca aqui ..."/>
                </div>
            </div>
        </div>
        ${items.map(templateCard).join("")}
    </div>
</div>`;
};

async function makeReporter(items) {
  const caminhoArquivoHTML = path.resolve(
    __dirname,
    "..",
    "reporter/index.html"
  );

  const html = createHTML({
    title: "Relatório de Interface",
    script: "script.js",
    css: "style.css",
    lang: "pt-br",
    head: `
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="description" content="">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://unpkg.com/image-compare-viewer/dist/image-compare-viewer.min.js"></script>
      `,
    body: templateMain(items),
    favicon: "favicon.png",
  });

  try {
    await fs.writeFile(caminhoArquivoHTML, html);
    console.log("\nPágina de relatório criada com sucesso!");
  } catch (erro) {
    console.log("\nErro ao criar relatório de teste:", erro);
  }
}

module.exports = makeReporter;
