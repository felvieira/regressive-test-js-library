const path = require('path');
const { getDirectories, deleteFolderRecursive } = require('./helpers/utils');

class FolderCleaner {
  constructor() {
    this.basePath = path.resolve(__dirname, '..');
  }

  _getDateFromFolderName(folderName) {
    const parts = folderName.split('/').pop().split('_');
    const [day, month, year] = parts.map(Number); // Converts to numbers
    return new Date(year, month - 1, day);
  }

  _filterFoldersByDate(folders) {
    const dateFormatRegex = /\d{1,2}_\d{1,2}_\d{4}/;
    return folders.filter((folder) =>
      dateFormatRegex.test(folder.split('/').pop())
    );
  }

  _sortFoldersByDescendingDate(folders) {
    return folders.sort(
      (a, b) => this._getDateFromFolderName(b) - this._getDateFromFolderName(a)
    );
  }

  async _eraseFolders(foldersToDelete) {
    console.log(`🚀 ~ Você vai deletar ${foldersToDelete.length} pastas`);
    foldersToDelete.forEach((folder) => {
      const targetPath = path.resolve(this.basePath, folder);
      console.log('🚀 ~ Apagando pasta de teste antiga: ', targetPath);
      deleteFolderRecursive(targetPath);
    });
  }

  async eraseUnusedFolders() {
    let testFolders;
    try {
      testFolders = await getDirectories(this.basePath);
      testFolders = this._filterFoldersByDate(testFolders);
      testFolders = this._sortFoldersByDescendingDate(testFolders);

      if (testFolders.length > 3) {
        testFolders = testFolders.slice(3); // Keeps only the 3 most recent folders
      } else {
        testFolders = [];
      }

      if (!testFolders.length) {
        console.log('🚀 ~ Sem pastas para deletar');
        return;
      }

      await this._eraseFolders(testFolders);
    } catch (error) {
      console.error('Erro ao apagar pastas não utilizadas:', error);
    }
  }

  async run() {
    console.log('🚀 ~ Iniciando deleção de pastas de testes antigas');
    await this.eraseUnusedFolders();
    console.log('🚀 ~ Finalizando deleção de pastas de testes antigas');
  }
}

const folderCleaner = new FolderCleaner();

module.exports = {
  eraseUnusedFolders: folderCleaner.eraseUnusedFolders.bind(folderCleaner),
  runEraseUnusedFolders: folderCleaner.run.bind(folderCleaner),
  folderCleaner,
};
