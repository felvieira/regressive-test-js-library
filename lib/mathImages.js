'use strict';

const fs = require('fs');
const util = require('util');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const path = require('path');
const sharp = require('sharp');

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

class ImageComparator {
  constructor(scenario) {
    this.referenceFilePath = this._resolvePath(
      'reference',
      scenario.imageFilePng,
    );
    this.testFilePath = this._resolvePath(scenario.today);
    this.diffFilePath = this._resolvePath(
      scenario.today.split('/')[0],
      `${scenario.imageFilePng.split('.')[0]}-diff.png`,
    );
    this.reporterLocation = this._resolvePath(
      scenario.today.split('/')[0],
      `${scenario.imageFilePng.split('.')[0]}.json`,
    );
    this.scenario = scenario;
  }

  _resolvePath(...paths) {
    return path.resolve(__dirname, '..', ...paths);
  }

  async _resizeImage(imagePath, referenceHeight, testHeight) {
    const output = `${imagePath}-resized.png`;
    try {
      const image = await sharp(imagePath);
      const metadata = await image.metadata();

      const newHeight = Math.max(referenceHeight, testHeight);
      const difference = Math.max(0, newHeight - metadata.height);

      if (difference > 0) {
        await image
          .extend({
            top: 0,
            bottom: difference,
            left: 0,
            right: 0,
            background: { r: 0, g: 0, b: 0, alpha: 1 },
          })
          .toFile(output);
        console.log('Imagem redimensionada salva em:', output);
      } else {
        console.log('As imagens já têm o mesmo tamanho.');
        return imagePath; // Retorna o caminho original, já que as imagens já têm o mesmo tamanho
      }

      return output; // Retorna o caminho do arquivo redimensionado
    } catch (error) {
      console.error('Erro ao redimensionar imagem:', error);
      throw error;
    }
  }

  async _generateReport(difference, compatibility) {
    const reportData = {
      ...this.scenario,
      difference,
      compatibility: compatibility.toFixed(2),
    };
    try {
      await writeFileAsync(this.reporterLocation, JSON.stringify(reportData));
    } catch (error) {
      console.error('Erro ao gerar relatório JSON:', error);
      throw error;
    }
  }

  async _saveTestImage(diff) {
    try {
      await writeFileAsync(this.diffFilePath, PNG.sync.write(diff));
    } catch (error) {
      console.error('Erro ao salvar imagem de diferença:', error);
      throw error;
    }
  }

  async _compareImages(referenceImage, testImage) {
    const { width, height } = referenceImage;
    const diff = new PNG({ width, height });
    const differentPixels = pixelmatch(
      referenceImage.data,
      testImage.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 },
    );
    const compatibility = 100 - (differentPixels * 100) / (width * height);
    await this._generateReport(differentPixels, compatibility);
    await this._saveTestImage(diff);
  }

  async compareAndSaveImagesAndGenerateReports() {
    let referenceImage = PNG.sync.read(
      await readFileAsync(this.referenceFilePath),
    );
    let testImage = PNG.sync.read(await readFileAsync(this.testFilePath));

    const referenceHeight = referenceImage.height;
    const testHeight = testImage.height;

    // Redimensiona a imagem de teste, se necessário
    if (testHeight < referenceHeight) {
      console.log(`Imagem de teste é menor, redimensionando...`);
      this.testFilePath = await this._resizeImage(
        this.testFilePath,
        referenceHeight,
        testHeight,
      );
      testImage = PNG.sync.read(await readFileAsync(this.testFilePath));
    }

    // Redimensiona a imagem de referência, se necessário
    if (referenceHeight < testHeight) {
      console.log(`Imagem de referência é menor, redimensionando...`);
      this.referenceFilePath = await this._resizeImage(
        this.referenceFilePath,
        referenceHeight,
        testHeight,
      );
      referenceImage = PNG.sync.read(
        await readFileAsync(this.referenceFilePath),
      );
    }

    await this._compareImages(referenceImage, testImage);
  }
}

module.exports = async (scenario) => {
  const comparator = new ImageComparator(scenario);
  await comparator.compareAndSaveImagesAndGenerateReports();
};
