const { parentPort, workerData, threadId } = require('worker_threads');
const path = require('path');
const { format } = require('prettier');
const { ensureFile, readFile, writeFile, createWriteStream } = require('fs-extra');

const { filePathBatch, logDirPath, dryRun } = workerData;

(async function main() {
	const logPath = path.join(logDirPath, `./prettier/${Date.now()}.log`);
	await ensureFile(logPath);
	const logStream = createWriteStream(logPath);

	try {
		console.log(
			`[Thread #${threadId}] Started prettier-ing ${filePathBatch.length} file(s)...`,
			dryRun ? '(no files will be changed)' : ''
		);

		for (const filepath of filePathBatch) {
			logStream.write(filepath + '\n');
			const content = await readFile(filepath).then(buffer => buffer.toString());

			try {
				const prettyContent = format(content, {
					filepath,
					printWidth: 150,
					tabWidth: 4,
					singleQuote: true,
					quoteProps: 'as-needed',
					trailingComma: 'es5',
					arrowParens: 'always',
					endOfLine: 'crlf',
					htmlWhitespaceSensitivity: 'strict',
				});
				if (!dryRun) await writeFile(filepath, prettyContent, { flag: 'w' });
			} catch (fileError) {
				console.error(filepath, fileError);
				logStream.write(filepath, fileError);
			}
		}

		console.log(`[Thread #${threadId}] Finished prettier-ing.`);
	} catch (error) {
		console.error(error);
		logStream.write(error);
	} finally {
		logStream.close();
		parentPort.close();
	}
})();
