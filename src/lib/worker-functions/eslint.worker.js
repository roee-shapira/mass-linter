const { parentPort, workerData, threadId } = require('worker_threads');
const path = require('path');
const { CLIEngine } = require('eslint');
const { ensureFile, writeJSON } = require('fs-extra');

const { filePathBatch, homePath, logDirPath, dryRun } = workerData;

(async function main() {
	try {
		console.log(`[Thread #${threadId}] Started linting - ${filePathBatch.length} file(s)...`, dryRun ? '(no files will be changed)' : '');
		const cli = new CLIEngine({
			fix: true,
			cwd: homePath,
			extensions: ['.js', '.jsx', '.json'],
			configFile: path.join(homePath, './.eslintrc'),
		});
		const report = cli.executeOnFiles(filePathBatch);

		const logPath = path.join(logDirPath, `./eslint/${Date.now()}.json`);
		await ensureFile(logPath);
		await writeJSON(logPath, report);

		if (!dryRun) CLIEngine.outputFixes(report);

		console.log(`[Thread #${threadId}] Finished linting.`);
	} catch (error) {
		console.error(error);
	} finally {
		parentPort.close();
	}
})();
