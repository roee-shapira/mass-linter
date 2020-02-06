const { spawn } = require('child_process');
const path = require('path');
const { ensureFileSync, createWriteStream } = require('fs-extra');

module.exports = {
	runPrettier(dirPath, { dryRun, logDirPath, ignorePattern } = {}) {
		return new Promise((resolve, reject) => {
			console.log(`Started prettier-ing ${dirPath}...`, dryRun ? '(no files will be changed)' : '');
			const ignoreGlob = ignorePattern ? `|${ignorePattern}` : '';

			const child = spawn(
				'npx prettier',
				[
					'--print-width 150',
					'--tab-width 4',
					'--single-quote',
					'--quote-props as-needed',
					'--trailing-comma es5',
					'--arrow-parens always',
					dryRun ? '-l ' : '--write',
					`"./**/*.{js,jsx,json} !(**/target/**${ignoreGlob})"`,
				],
				{ cwd: dirPath, shell: process.platform === 'win32', windowsHide: true }
			);
			child.on('error', reject);

			const logPath = path.join(logDirPath, `./prettier.cmd/${dirPath.split(path.sep).pop()}/${Date.now()}.log`);
			ensureFileSync(logPath);
			const destStream = createWriteStream(logPath);
			child.stdout.pipe(destStream);
			child.stderr.pipe(destStream);

			child.on('close', code => {
				if (code !== 0) {
					return reject(Error(`[Process #${child.pid}] Child process exited with code ${code}`));
				}
				return resolve();
			});
		})
			.catch(console.error)
			.then(() => console.log(`Finished prettier-ing ${dirPath}.`));
	},
};
