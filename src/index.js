#!/usr/bin/env node
const path = require('path');

const { parseArgsList } = require('./lib/parse-args');
const { glob } = require('./lib/glob');
const { runESLint } = require('./lib/worker-functions');
const { runPrettier } = require('./lib/shell-functions/prettier.cmd');

const THREAD_COUNT = +process.env.UV_THREADPOOL_SIZE || 4;
const argv = parseArgsList(process.argv.slice(2));

const homePath = path.resolve('C:\\develop\\code\\honeyfy\\WebFrontEnd');
const jsCodeBasePath = path.join(homePath, './src/main/resources/r/js/');

(async function main() {
	process.title = 'Quality week task - lint js files';

	const globs = await glob(`${jsCodeBasePath}**/*.js`, { ignore: argv.ignorePattern });
	const chunkSize = globs.length / THREAD_COUNT;
	const filePathBatches = globs.reduce((acc, _, i) => (i % chunkSize ? acc : [...acc, globs.slice(i, i + chunkSize)]), []);

	const taskOptions = {
		homePath,
		logDirPath: path.join(__dirname, '../logs/'),
		ignorePattern: argv.ignorePattern,
		dryRun: argv.dryRun || argv.d,
	};

	const shouldTime = !argv.noTime;
	if (!argv.noPrettier) {
		if (shouldTime) console.time('Prettier task');
		await runPrettier(jsCodeBasePath, taskOptions);
		if (shouldTime) console.timeEnd('Prettier task');
	}
	if (!argv.noEslint) {
		if (shouldTime) console.time('Lint task');
		await Promise.all(filePathBatches.map(filePathBatch => runESLint({ filePathBatch, ...taskOptions })));
		if (shouldTime) console.timeEnd('Lint task');
	}
})();
