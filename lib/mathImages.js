"use strict";

const fs = require("fs");
const util = require("util");
const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");
const path = require("path");
const sharp = require("sharp");

const writeFileAsync = util.promisify(fs.writeFile);

class ImageComparator {
  constructor(scenario) {
    this.referenceFilePath = this._resolvePath("reference", scenario.imageFilePng);
    this.testFilePath = this._resolvePath(scenario.today);
    this.reporterLocation = this._resolvePath(
      scenario.today.split("/")[0],
      `${scenario.imageFilePng.split(".")[0]}.json`
    );
    this.scenario = scenario;
  }

  _resolvePath(...paths) {
    return path.resolve(__dirname, "..", ...paths);
  }

  async _resizeImage(imagePath, targetPath, difference) {
    try {
      await sharp(imagePath)
        .extend({
          top: 0,
          bottom: difference,
          left: 0,
          right: 0,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        })
        .toFile(`${targetPath}-resized.png`);
    } catch (error) {
      console.error("Erro ao redimensionar imagem:", error);
    }
  }

  async _generateReport(data) {
    console.log("Gerando JSON...");
    try {
      await writeFileAsync(this.reporterLocation, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao gerar relatório JSON:", error);
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
      { threshold: 0.1 }
    );
    const compatibility = 100 - (differentPixels * 100) / (width * height);
    await this._generateReport({
      ...this.scenario,
      difference: differentPixels,
      compatibility: compatibility.toFixed(2),
    });
  }

  async compare() {
    const imageReference = PNG.sync.read(fs.readFileSync(this.referenceFilePath));
    const imageTest = PNG.sync.read(fs.readFileSync(this.testFilePath));

    const difference = Math.abs(imageReference.height - imageTest.height);
    let referenceToCompare = imageReference;
    let testToCompare = imageTest;

    if (difference > 0) {
      const imageToResize =
        imageTest.height > imageReference.height
          ? this.referenceFilePath
          : this.testFilePath;
      const resultingPath = `${imageToResize}-resized.png`;

      await this._resizeImage(imageToResize, imageToResize, difference);

      if (imageToResize === this.referenceFilePath) {
        referenceToCompare = PNG.sync.read(resultingPath);
      } else {
        testToCompare = PNG.sync.read(resultingPath);
      }
    }

    await this._compareImages(referenceToCompare, testToCompare);
  }
}

module.exports = async (scenario) => {
  const comparator = new ImageComparator(scenario);
  await comparator.compare();
};
