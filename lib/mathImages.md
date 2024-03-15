# ImageComparator

## Visão Geral

`ImageComparator` é uma classe em JavaScript utilizada para a comparação de imagens, facilitando a identificação de diferenças visuais entre duas imagens. Ela utiliza as bibliotecas `sharp` para redimensionamento de imagens, `pngjs` para manipulação de arquivos PNG e `pixelmatch` para a comparação pixel a pixel.

## Funcionalidades

- **Comparação de Imagens**: Identifica e destaca as diferenças visuais entre duas imagens.
- **Redimensionamento de Imagens**: Garante que ambas as imagens tenham as mesmas dimensões para uma comparação justa.
- **Geração de Relatórios**: Cria relatórios detalhados em formato JSON sobre as diferenças encontradas.

## Construtor

```javascript
const comparator = new ImageComparator(scenario);
```

- `scenario`: Objeto contendo as informações necessárias para a comparação das imagens (`imageFilePng`, `today`).

## Métodos Principais

### \_resolvePath(...)

Resolve e retorna o caminho absoluto para os arquivos especificados.

```javascript
_resolvePath('reference', scenario.imageFilePng);
```

### \_resizeImage(imagePath, newHeight)

Redimensiona a imagem para a altura especificada, mantendo as proporções.

```javascript
await _resizeImage(imagePath, newHeight);
```

### \_generateReport(difference, compatibility)

Gera um relatório JSON com os detalhes da comparação, incluindo a quantidade de pixels diferentes e a taxa de compatibilidade.

```javascript
await _generateReport(difference, compatibility);
```

### \_saveTestImage(diff)

Salva a imagem que destaca as diferenças encontradas durante a comparação.

```javascript
await _saveTestImage(diff);
```

### \_compareImages(referenceImage, testImage)

Realiza a comparação pixel a pixel entre a imagem de referência e a imagem de teste.

```javascript
await _compareImages(referenceImage, testImage);
```

### compareAndSaveImagesAndGenerateReports()

Método principal que executa o fluxo completo de comparação, salvamento das imagens de diferença e geração de relatórios.

```javascript
await comparator.compareAndSaveImagesAndGenerateReports();
```

## Exemplo de Uso

```javascript
const ImageComparator = require('./ImageComparator');

const scenario = {
  imageFilePng: 'nomeDaImagem.png',
  today: 'caminho/para/imagemDeTeste.png',
};

const comparator = new ImageComparator(scenario);
comparator
  .compareAndSaveImagesAndGenerateReports()
  .then(() => console.log('Comparação concluída.'))
  .catch((error) => console.error('Erro durante a comparação:', error));
```

## Instalação das Dependências

Para utilizar a classe `ImageComparator`, é necessário instalar as bibliotecas `sharp`, `pngjs` e `pixelmatch`.

```bash
npm install sharp pngjs pixelmatch
```

## Nota

A classe `ImageComparator` é altamente personalizável, podendo ser adaptada para diferentes necessidades de projetos que envolvem comparação de imagens.
