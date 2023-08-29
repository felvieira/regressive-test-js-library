'use strict';

const path = require('path');
const makeReporter = require('./lib/makeReporter');
const puppeterInit = require('./lib/puppeterConfig');
const { scenariosConfig } = require('./lib/config/scenariosConfig');
const viewPort = require('./lib/config/viewport.json');
const { logFinal, logInitTest } = require('./lib/helpers/logger');
const {
	emptyDir,
	forEachSync,
	deleteFolderRecursive,
	readAllJsonFiles,
} = require('./lib/helpers/utils');
const { formatScenario } = require('./lib/puppeterConfigFormat');
const { runEraseUnusedFolders } = require('./lib/eraseUnusedFolders');

class TestRunner {
    constructor() {
        this.urlCMD = process.env.URL || 'https://faq.pagbank.uol.com.br:3002';
        this.scenarios = scenariosConfig(this.urlCMD);
        this.scenarioConfigFinal = [];
    }

    async initialize() {
        const userData = path.resolve(__dirname, '..', 'user_data/');
        await emptyDir(path.resolve(__dirname, '..', 'test/'), 'Teste');
        await deleteFolderRecursive(userData);
        console.log(
            `>>> Temos ao total ${this.scenarios.length * 3} scenarios de teste ao total, sendo ${this.scenarios.length} de cada breakpoint. `
        );
    }

    async executeTests(viewPorts, scenarios) {
        await forEachSync(viewPorts, async vp => {
            await forEachSync(scenarios, async scenario => {
                const item = await formatScenario(scenario, vp);
                this.scenarioConfigFinal.push(item);
                await logInitTest(scenario, vp, 'Rodando');
                await puppeterInit(scenario, vp).catch(error => {
                    console.log(error);
                });
                await logFinal(scenario, vp);
            });
        });
    }

    async reportResults() {
        const dirImageTest = path.resolve(
            __dirname,
            '..',
            `${this.scenarioConfigFinal[0].today.split('/')[0]}`
        );
        await makeReporter(readAllJsonFiles(dirImageTest));
    }

    async cleanup() {
        await runEraseUnusedFolders();
    }

    async run() {
        await this.initialize();
        await this.executeTests(viewPort, this.scenarios);
        await this.reportResults();
        await this.cleanup();
    }
}

const testRunner = new TestRunner();
testRunner.run().catch(err => console.log('Erro ao executar testes', err));
