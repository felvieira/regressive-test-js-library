'use strict';

const fs = require('fs');
const path = require('path');

class ScenarioFormatter {
	constructor(scenario, viewPort) {
		this.scenario = scenario;
		this.viewPort = viewPort;
	}

	static formatName(viewPort, label) {
		return `${viewPort.label.toUpperCase()}-${label.replace(/[^A-Z0-9]/gi, '_')}`;
	}

	existsInPath(referencePathFolder, referenceImage) {
		return fs.existsSync(
			path.resolve(__dirname, '..', referencePathFolder.split('/')[1], referenceImage)
		);
	}

	async getFolderPath(referencePathFolder, referenceImage) {
		const date = new Date();
		const folderName = this.existsInPath(referencePathFolder, referenceImage)
			? `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
			: 'reference';

		if (!fs.existsSync(path.resolve(__dirname, '..', folderName))) {
			fs.mkdirSync(path.resolve(__dirname, '..', folderName));
		}

		return {
			folderName: folderName,
			type: folderName === 'reference' ? 'reference' : 'test',
		};
	}

	async formatComplete() {
		const formattedName = ScenarioFormatter.formatName(this.viewPort, this.scenario.label);
		const imagePath = `./reference/${formattedName}.png`;

		const { folderName, type } = await this.getFolderPath('./reference', `${formattedName}.png`);

		return {
			...this.scenario,
			viewPort: this.viewPort.label,
			scenarioLabel: `${this.scenario.label} - ${this.viewPort.label}`,
			imageFileName: formattedName,
			imageFilePng: `${formattedName}.png`,
			today: path.join(folderName, `${formattedName}.png`),
			test: path.join('test', `${formattedName}.png`),
			type: type,
		};
	}
}

module.exports = {
	formatScenario: async (scenario, viewPort) => {
		const formatter = new ScenarioFormatter(scenario, viewPort);
		return await formatter.formatComplete();
	},
};
