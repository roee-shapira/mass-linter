module.exports = {
	env: {
		commonjs: true,
		es6: true,
		node: true,
	},
	extends: 'eslint:recommended',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	rules: {
		indent: ['warn', 'tab'],
		'no-tabs': 'off',
		'arrow-parens': ['warn', 'as-needed'],
		'no-console': 'off',
		'import/no-extraneous-dependencies': 'off',
		'implicit-arrow-linebreak': 'off',
		'comma-dangle': 'off',
		'function-paren-newline': 'off',
		'wrap-iife': 'off',
	},
};
