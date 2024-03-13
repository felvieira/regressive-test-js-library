# Documentação do ReportGenerator

## Visão Geral

O `ReportGenerator` é uma classe projetada para gerar relatórios HTML para comparação visual de imagens em cenários de teste. Utiliza a biblioteca `create-html` para criar um arquivo HTML que exibe cartões para cada cenário de teste. Cada cartão inclui imagens de referência, teste e diferença, juntamente com metadados de teste como rótulo do cenário, viewport e URL.

## Métodos da Classe

### constructor()

Inicializa a instância do `ReportGenerator` com caminhos padrão para a base de imagens, imagens de referência e saída do relatório.

### getImagePath(type, imageFilePng, today, compatibility)

Determina e retorna o caminho para uma imagem com base em seu tipo (referência, teste, resultado).

- `type`: O tipo de imagem (referência, teste, resultado).
- `imageFilePng`: O nome do arquivo da imagem.
- `today`: A data atual, usada no caminho para imagens de teste.
- `compatibility`: A porcentagem de compatibilidade, usada para determinar se uma imagem de resultado existe.

### createCard(scenario)

Gera o HTML para um cartão que representa um único cenário de teste.

- `scenario`: Um objeto contendo detalhes sobre o cenário de teste.

### createHeaderButtons(items)

Gera HTML para botões de cabeçalho com base em viewports únicos no array de itens.

- `items`: Um array de objetos de cenários de teste.

### createHeader(items)

Gera HTML para o cabeçalho do relatório, incluindo funcionalidade de busca e botões para filtrar cenários por viewport e resultado do teste.

- `items`: Um array de objetos de cenários de teste.

### generate(items)

Gera o relatório HTML completo e o grava no sistema de arquivos.

- `items`: Um array de objetos de cenários de teste.

## Exemplo de Uso

```javascript
const ReportGenerator = require('./ReportGenerator');
const reportGenerator = new ReportGenerator();

// Supondo que 'items' seja um array de objetos de cenários de teste
reportGenerator
  .generate(items)
  .then(() => {
    console.log('Relatório gerado com sucesso.');
  })
  .catch((error) => {
    console.error('Falha ao gerar relatório:', error);
  });
```

## Nota

A classe `ReportGenerator` é projetada para ser flexível e pode ser estendida ou modificada para atender a diferentes requisitos de relatórios. Ela oferece uma maneira estruturada e visualmente atraente de revisar os resultados de processos de teste visual.
