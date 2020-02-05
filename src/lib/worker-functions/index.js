const { Worker } = require('worker_threads');
const path = require('path');

function run(workerPath, workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker(workerPath, { workerData });
		worker.on('message', resolve);
		worker.on('error', reject);
		worker.on('exit', code => {
			if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
			else resolve();
		});
	}).catch(console.error);
}

module.exports = {
	runESLint(workerData) {
		return run(path.join(__dirname, './eslint.worker.js'), workerData);
	},
};
