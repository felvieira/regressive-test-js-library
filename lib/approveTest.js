const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');
const { listAllFilesInDir, forEachSync } = require('./helpers/utils');
const readlineSync = require('readline-sync');

class TestApprover {
  constructor() {
    this.folderFormat = 'DD_M_YYYY';
    this.referenceFolderName = 'reference';
  }

  async deleteResizedReferenceFiles() {
    const referenceFolderPath = this.getFolderPath(this.referenceFolderName);
    const files = await listAllFilesInDir(referenceFolderPath);

    for (const file of files) {
      const fileName = path.basename(file);
      if (fileName.includes('resized')) {
        await fs.unlink(file);
        console.log('Deletando arquivo redimensionado:', fileName);
      }
    }
  }

  async copyTestImagesToReference(testFolderName) {
    const testFolderPath = this.getFolderPath(testFolderName);
    const files = await listAllFilesInDir(testFolderPath);

    for (const file of files) {
      const fileName = path.basename(file);
      if (fileName.includes('resized')) {
        console.log('Pulando arquivo redimensionado:', fileName);
        continue;
      }

      const targetPath = path.join(
        this.getFolderPath(this.referenceFolderName),
        fileName
      );
      await fs.copyFile(file, targetPath);
      console.log(`Copiando ${fileName} para a pasta de referência.`);
    }

    await this.deleteResizedReferenceFiles();
  }

  getFolderPath(folderName) {
    return path.resolve(__dirname, '..', folderName);
  }

  async approveTests() {
    if (readlineSync.keyInYN('Você aprova os testes da Área Logada?')) {
      const testFolderName = moment().format(this.folderFormat);
      await this.copyTestImagesToReference(testFolderName);
      console.log(
        `Imagens copiadas para a pasta './${this.referenceFolderName}'.`
      );
    } else {
      console.log('Ok! Corrija e rode os testes novamente.');
    }
  }
}

async function approveTest() {
  const approver = new TestApprover();
  await approver.approveTests();
}

async function runApproveTest() {
  await approveTest();
}

module.exports = {
  approveTest,
  runApproveTest,
};
