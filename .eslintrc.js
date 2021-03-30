module.exports = {
	"extends": "airbnb-base",
	"rules": {
		// don't require .vue extension when importing
		'import/extensions': ['error', 'always', {
			'js': 'never',
			'vue': 'never'
		}],
		// allow optionalDependencies
		'import/no-extraneous-dependencies': ['error', {
			'optionalDependencies': ['test/unit/index.js']
		}],
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'indent': 2,
		'no-tabs': 0,
		"no-param-reassign": 0,
		"no-mixed-operators": 0,
		"no-new": 0,
		"no-underscore-dangle": 0,
		"consistent-return": 0,
		"arrow-body-style": 0,
		"no-undef": 0,
		"array-callback-return": 0,
		"no-plusplus": 0,
		"max-len": 0,
		"import/no-unresolved": 0,
		"import/no-extraneous-dependencies": 0,
		"import/no-duplicates": 0,
		"import/extensions": 0,
		"import/no-absolute-path": 0,
		"import/no-named-as-default": 0,
		"import/no-named-as-default-member": 0,
		"import/prefer-default-export": 0,
		"import/order": 0,
		"global-require": 0,
		"no-return-assign": 0,
		"linebreak-style": 0,
		"prefer-promise-reject-errors": 0,
	}
};