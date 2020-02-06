#!/usr/bin/env node
const path = require('path');

const { parseArgv } = require('./lib/parse-args');
const { glob } = require('./lib/glob');
const { runESLint, runPrettier } = require('./lib/worker-functions');
const { runSortPackageJson } = require('./lib/shell-functions/sort-package-json.cmd');

const THREAD_COUNT = +process.env.UV_THREADPOOL_SIZE || 4;
const argv = parseArgv(process.argv);

const homePath = path.resolve('C:/develop/code/honeyfy/WebFrontEnd/');

(async function main() {
	process.title = 'Quality week task - lint js files';

	const globs = await glob(`${homePath}/**/*.@(js|jsx|json)`, {
		ignore: ['**/target/**', '**/node_modules/**', '**/*.min.js', '**/test/resources/**'].concat(argv.ignorePattern || ''),
	});
	const chunkSize = Math.ceil(globs.length / THREAD_COUNT);
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
		await Promise.all(filePathBatches.map(filePathBatch => runPrettier({ filePathBatch, ...taskOptions })));
		if (shouldTime) console.timeEnd('Prettier task');
	}
	if (!argv.noEslint) {
		if (shouldTime) console.time('Lint task');
		await Promise.all(filePathBatches.map(filePathBatch => runESLint({ filePathBatch, ...taskOptions })));
		if (shouldTime) console.timeEnd('Lint task');
	}
	if (!argv.noSortPackageJson) {
		if (shouldTime) console.time('Package.json sort task');
		await runSortPackageJson(homePath, taskOptions);
		if (shouldTime) console.timeEnd('Package.json sort task');
	}
})();
