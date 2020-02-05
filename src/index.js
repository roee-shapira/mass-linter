#!/usr/bin/env node
const path = require('path');

const glob = require('./lib/glob');
const { runESLint } = require('./lib/worker-functions');
const { runPrettier } = require('./lib/shell-functions/prettier.cmd');

const THREAD_COUNT = +process.env.UV_THREADPOOL_SIZE || 4;
const argv = process.argv.slice(2).reduce((accu, curr) => {
	const parts = curr.split('=');
	return Object.assign(accu, { [parts[0]]: parts[1] || true });
}, {});

const homePath = path.resolve('C:\\develop\\code\\honeyfy\\WebFrontEnd');
const jsCodeBasePath = path.join(homePath, './src/main/resources/r/js/');

(async function main() {
	process.title = 'Quality week task - lint js files';

	const globs = await glob(`${jsCodeBasePath}**/*.js`, { ignore: argv['--ignore-pattern'] });
	const chunkSize = globs.length / THREAD_COUNT;
	const filePathBatches = globs.reduce((acc, _, i) => (i % chunkSize ? acc : [...acc, globs.slice(i, i + chunkSize)]), []);

	const taskOptions = {
		homePath,
		logDirPath: path.join(__dirname, '../logs/'),
		ignorePattern: argv['--ignore-pattern'],
		dryRun: argv['--dry-run'] || argv['-d'],
	};

	if (!argv['--no-prettier']) {
		console.time('Prettier task');
		await runPrettier(jsCodeBasePath, taskOptions);
		console.timeEnd('Prettier task');
	}

	if (!argv['--no-eslint']) {
		console.time('Lint task');
		await Promise.all(filePathBatches.map(filePathBatch => runESLint({ filePathBatch, ...taskOptions })));
		console.timeEnd('Lint task');
	}
})();
