const dashToCamelCase = str => {
	if (str.startsWith('--')) {
		return str.slice(2).replace(/-([a-z])/g, (_, m1) => m1.toUpperCase());
	} else {
		return str.slice(1);
	}
};

module.exports = {
	parseArgv(argvRaw) {
		return argvRaw.slice(2).reduce((accu, curr) => {
			const parts = curr.split('=');
			return Object.assign(accu, { [dashToCamelCase(parts[0])]: parts[1] || true });
		}, {});
	},
};
