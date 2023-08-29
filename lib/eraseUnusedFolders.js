'use strict';

const path = require('path');
const { getDirectories, deleteFolderRecursive } = require('./helpers/utils');

function obterDataDePasta(stringDir) {
    const [dia, mes, ano] = stringDir.split('/').splice(-1)[0].split('_');
    return new Date(ano, mes - 1, dia);  // Meses no objeto Date começam de 0.
}

function filtrarPastasPorData(pastas) {
    const regexFormatoData = /(\d{2}_\d{2}_\d{4})/;
    return pastas.filter(pasta => regexFormatoData.test(pasta.split('/').splice(-1)[0]));
}

function ordenarPastasPorDataDecrescente(pastas) {
    return pastas.sort((a, b) => obterDataDePasta(b) - obterDataDePasta(a));
}

async function eraseUnusedFolders() {
    const pastaLib = path.resolve(__dirname, '..');
    let pastasDeTeste;

    try {
        pastasDeTeste = await getDirectories(pastaLib);
        pastasDeTeste = filtrarPastasPorData(pastasDeTeste);
        pastasDeTeste = ordenarPastasPorDataDecrescente(pastasDeTeste);

        if (pastasDeTeste.length >= 3) {
            pastasDeTeste = pastasDeTeste.slice(0, -3);
        } else {
            pastasDeTeste = [];
        }
    } catch (erro) {
        console.error('Erro ao apagar pastas não utilizadas:', erro);
        return;
    }

    if (!pastasDeTeste.length) {
        console.log('🚀 ~ Sem pastas para deletar');
        return;
    }

    console.log(`🚀 ~ Você vai deletar ${pastasDeTeste.length} pastas`);
    pastasDeTeste.forEach(pasta => {
        const alvo = path.resolve(__dirname, '..', pasta);
        console.log('🚀 ~ Apagando pasta de teste antiga: ', alvo);
        deleteFolderRecursive(alvo);
    });
}

async function runEraseUnusedFolders() {
    console.log('🚀 ~ Iniciando deleção de pastas de testes antigas');
    await eraseUnusedFolders();
    console.log('🚀 ~ Finalizando deleção de pastas de testes antigas');
}

module.exports = {
    eraseUnusedFolders,
    runEraseUnusedFolders,
};
