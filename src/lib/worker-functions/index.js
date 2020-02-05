const { Worker } = require('worker_threads');
const path = require('path');

function run(workerPath, workerData) {
	return new Promise((resolve, reject) => {
		const messageList = [];
		const errorList = [];
		const worker = new Worker(workerPath, { workerData });
		worker.on('message', msg => messageList.push(msg));
		worker.on('error', error => errorList.push(error));
		worker.on('exit', code => {
			if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
			else resolve({ messageList, errorList });
		});
	}).catch(console.error);
}

module.exports = {
	runESLint(workerData) {
		return run(path.join(__dirname, './eslint.worker.js'), workerData);
	},
};
