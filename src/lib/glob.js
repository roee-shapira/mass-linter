const globCallback = require('glob');

module.exports = {
	glob(url, options) {
		new Promise((resolve, reject) =>
			globCallback(url, options, (err, res) => {
				if (err) return reject(err);
				return resolve(res);
			})
		);
	},
};
