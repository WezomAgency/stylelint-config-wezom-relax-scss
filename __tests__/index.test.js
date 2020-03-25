const stylelint = require('stylelint');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const fromCWD = require('from-cwd');
const configWezomRelax = require('../index');

const rules = glob
	.sync(fromCWD('./__tests__/*'))
	.filter((dir) => fs.lstatSync(dir).isDirectory())
	.map((dir) => path.basename(dir));

const getCode = (test, file) => {
	return fs.readFileSync(path.join(__dirname, test, file), 'utf-8').toString();
};

rules.forEach((rule) => {
	const config = {
		...configWezomRelax,
		rules: {
			[rule]: configWezomRelax.rules[rule]
		}
	};

	describe(`${rule} :: ${chalk.yellow('valid cases')}`, () => {
		let result;

		beforeEach(() => {
			result = stylelint.lint({
				config,
				code: getCode(rule, 'valid.css')
			});
		});

		it('did not error', () => {
			return result.then((data) => expect(data.errored).toBeFalsy());
		});

		it('flags no warnings', () => {
			return result.then((data) => {
				expect(data.results[0].warnings).toHaveLength(0);
			});
		});
	});

	describe(`${rule} :: ${chalk.red('invalid cases')}`, () => {
		let result;

		beforeEach(() => {
			result = stylelint.lint({
				config,
				code: getCode(rule, 'invalid.css')
			});
		});

		it('has error', () => {
			return result.then((data) => expect(data.errored).toBeTruthy());
		});

		it('has flags warnings', () => {
			return result.then((data) => {
				expect(data.results[0].warnings.length).toBeGreaterThan(0);
			});
		});
	});
});
