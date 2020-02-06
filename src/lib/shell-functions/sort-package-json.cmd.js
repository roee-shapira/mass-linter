const { spawn } = require('child_process');
const path = require('path');
const { ensureFileSync, createWriteStream } = require('fs-extra');

module.exports = {
	runSortPackageJson(dirPath, { dryRun, logDirPath } = {}) {
		return new Promise((resolve, reject) => {
			console.log(`Started package.json sorting ${dirPath}...`, dryRun ? '(no files will be changed)' : '');

			const child = spawn('npx sort-package-json', ['"./**/package.json"', dryRun ? '--check' : ''], {
				cwd: dirPath,
				shell: process.platform === 'win32',
				windowsHide: true,
			});
			child.on('error', reject);

			const logPath = path.join(logDirPath, `./sort-package-json.cmd/${dirPath.split(path.sep).pop()}/${Date.now()}.log`);
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
			.then(() => console.log(`Finished package.json sorting ${dirPath}.`));
	},
};
