"use strict";

function logInitTest(scenario, vp, type) {
	logLineFirst();
	console.log(
		'#############################################################################################################'
	);
	console.log(
		`##### Teste ${type} em: '${scenario.label}' no viewport: '${vp.label}' #####`
	);
	console.log(
		'#############################################################################################################'
	);
	logLineLast();
}

function logLineFirst() {
	console.log(
		'\n#############################################################################################################'
	);
}

function logLineLast() {
	console.log(
		'#############################################################################################################\n'
	);
}

function logLine() {
	console.log(
		'\n###########################################################################################################\n'
	);
}

function logFinal(scenario, vp) {
	logLineFirst();
	console.log(
		`##### Teste Finalizado em: '${scenario.label}' no viewport: '${vp.label}' #####`
	);
	logLineLast();
}

module.exports = {
	logInitTest,
	logLineFirst,
	logLineLast,
	logLine,
	logFinal,
};
