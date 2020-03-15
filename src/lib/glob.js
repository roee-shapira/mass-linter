const globCallback = require('glob');

module.exports = {
	glob(url, options) {
		return new Promise((resolve, reject) =>
			globCallback(url, options, (err, res) => (err ? reject(err) : resolve(res)))
		).catch(console.error);
	},
};
