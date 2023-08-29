'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const moment = require('moment');
const { listAllFilesInDir, forEachSync } = require('./helpers/utils');
const readlineSync = require('readline-sync');

const copyFileAsync = util.promisify(fs.copyFile);
const deleteFileAsync = util.promisify(fs.unlink);

const logCopiedFiles = (name, item, target, skip = false) => {
	if (skip) {
		console.log(
			`\n\nSKIP >>> Arquivo: ${name} é redimensionado e será ignorado na copia\n\n`
		);
	} else {
		console.log(
			`\n\n##################################>>>${name}<<<#############################################`
		);
		console.log(
			`\n### Copiado file de ### \n"${item}"\n\n### Para o caminho ### \n"${target}"\n`
		);
		console.log(
			`########################################################################################################################################\n\n`
		);
	}
};

const delResizedReference = async referenceFolder => {
	await listAllFilesInDir(referenceFolder).then(async files => {
		await forEachSync(files, async file => {
			const fileName = `${file.split('/')[file.split('/').length - 1]}`;

			if (fileName.includes('resized'))
				try {
					await deleteFileAsync(file);
					console.log('Deletando =>', fileName);
				} catch (error) {
					console.log('Error deleteFileAsync =>', error);
				}
		});
	});
};

async function approveTest() {
	if (readlineSync.keyInYN('Você aprova os testes da Área Logada?')) {
		// 'Y'
		const folderTestName = `${moment()
			.locale('pt-br')
			.format('DD_MM_YYYY')}`;
		const folderTestNameFullPatch = path.resolve(
			__dirname,
			'..',
			folderTestName
		);
		const referenceFolder = path.resolve(__dirname, '..', `reference`);

		await listAllFilesInDir(folderTestNameFullPatch).then(async files => {
			await forEachSync(files, async file => {
				const fileName = `${file.split('/')[file.split('/').length - 1]}`;
				const toReferenceFolder = path.resolve(
					__dirname,
					'..',
					`reference/${fileName}`
				);

				if (fileName.includes('resized')) {
					logCopiedFiles(fileName, file, toReferenceFolder, true);
					return;
				}

				// Del files in reference folder
				try {
					await deleteFileAsync(toReferenceFolder);
				} catch (error) {
					console.log('Error deleteFileAsync =>', error);
				}

				// Copy files to reference folder
				try {
					await copyFileAsync(file, toReferenceFolder);
					await delResizedReference(referenceFolder);
					logCopiedFiles(fileName, file, toReferenceFolder);
				} catch (error) {
					console.log('Error copyFileAsync =>', error);
				}
			});
		});

		console.log(
			`Como o teste foi aprovado as imagens da pasta './${folderTestName}' foram copiadas para pasta './reference'`
		);
	} else {
		// Outra
		console.log('Ok! Corrija e rode de novo os testes');
	}
}

async function runApproveTest() {
	await approveTest();
}

module.exports = {
	approveTest,
	runApproveTest,
};
