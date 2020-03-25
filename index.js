module.exports = {
	extends: [
		'stylelint-config-wezom-relax',
		'stylelint-config-recommended-scss'
	],
	rules: {
		'max-nesting-depth': [5, { ignore: ['pseudo-classes'] }]
	}
};
