'use strict';

class Logger {
  constructor() {
    this.fullLine = '#'.repeat(105);
    this.shortLine = '#'.repeat(97);
  }

  logWithFullLine(message) {
    console.log(`${this.fullLine}\n${message}\n${this.fullLine}`);
  }

  logWithShortLine(message) {
    console.log(`${this.shortLine}\n${message}\n${this.shortLine}`);
  }

  logInitTest(scenario, vp, type) {
    const message = `##### Teste ${type} em: '${scenario.label}' no viewport: '${vp.label}' #####`;
    this.logWithFullLine(message);
  }

  logFinal(scenario, vp) {
    const message = `##### Teste Finalizado em: '${scenario.label}' no viewport: '${vp.label}' #####`;
    this.logWithFullLine(message);
  }

  logLine() {
    console.log(`\n${this.shortLine}\n`);
  }

  logLineFirst() {
    console.log(`\n${this.fullLine}`);
  }

  logLineLast() {
    console.log(`${this.fullLine}\n`);
  }
}

const logger = new Logger();

module.exports = {
  logInitTest: (scenario, vp, type) => logger.logInitTest(scenario, vp, type),
  logLineFirst: () => logger.logLineFirst(),
  logLineLast: () => logger.logLineLast(),
  logLine: () => logger.logLine(),
  logFinal: (scenario, vp) => logger.logFinal(scenario, vp),
  logger,
};
