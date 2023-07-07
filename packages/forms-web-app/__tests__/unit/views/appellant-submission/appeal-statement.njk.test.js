/**
 * @jest-environment ./__tests__/environments/nunjucks-test-environment.js
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');
const fileSizeDisplayHelper = require('../../../../src/lib/file-size-display-helper');

nunjucksTestRenderer.addFilter('formatBytes', fileSizeDisplayHelper);

describe('views/appellant-submission/appeal-statement.njk', () => {
	beforeAll(() => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		global.reloadScript('clientside-validation', document);
	});
	beforeEach(() => {
		const errorSummary = document.getElementById('error-summary');
		const ul = errorSummary.querySelector('ul');
		ul.innerHTML = '';
		const fileUpload = document.getElementById('file-upload');

		Object.defineProperty(fileUpload, 'value', {
			value: '',
			writable: true
		});
	});
	afterEach(() => {});
	it('should return true if the appeal statement is selected', (done) => {
		const fileUpload = document.getElementById('file-upload');
		fileUpload.value = 'appealStatement.pdf';

		global.runFunctionSync('isAppealStatementSelected', document, [], (result) => {
			try {
				expect(result).toEqual(true);
			} catch (e) {
				throw new Error(e);
			} finally {
				done();
			}
		});
	});
	it('should return false if the appeal statement is not selected', (done) => {
		global.runFunctionSync('isAppealStatementSelected', document, [], (result) => {
			try {
				expect(result).toEqual(false);
			} catch (e) {
				console.log(e);
			} finally {
				done();
			}
		});
	});
	it('should return true if a error summary item is already in the list', (done) => {
		const errorSummary = document.getElementById('error-summary');
		const errorSummaryList = errorSummary.querySelectorAll('ul')[0];
		const errorSummaryListItem = document.createElement('li');
		const errorText = 'There was an error';
		errorSummaryListItem.textContent = errorText;
		errorSummaryList.appendChild(errorSummaryListItem);

		global.runFunctionSync('getErrorSummaryListItem', document, [errorText], (result) => {
			try {
				expect(result).toEqual(true);
			} catch (e) {
				console.log(e);
				throw new Error(e.message);
			} finally {
				done();
			}
		});
	});
	it('should display an error if the user tries to submit without ticking the confirmation checkbox', (done) => {
		const sensitiveInformationError =
			'Select to confirm you have not included sensitive information';
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = false;
		const fileUpload = document.getElementById('file-upload');
		fileUpload.value = 'appealStatement.pdf';

		global.runFunctionSync('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(false);
			const errorSummary = document.getElementById('error-summary');
			const errorSummaryItems = errorSummary.querySelectorAll(`li`);
			expect(errorSummary.style.display).toEqual('block');
			expect(errorSummaryItems.length).toEqual(1);
			expect(errorSummaryItems[0].textContent).toEqual(sensitiveInformationError);
			done();
		});
	});
	it('should submit the form if the user has already checked the confirmation checkbox and selected an appeal statement', (done) => {
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = true;

		const fileUpload = document.getElementById('file-upload');
		(fileUpload.value = 'appealStatement.pdf'),
			global.runFunctionSync('saveAndContinueClick', document, [], (result) => {
				expect(result).toEqual(true);
				const errorSummary = document.getElementById('error-summary');
				const errorSummaryItems = errorSummary.querySelectorAll(`li`);
				expect(errorSummary.style.display).toEqual('none');
				expect(errorSummaryItems.length).toEqual(0);
				expect(errorSummary.style.display).toEqual('none');
				done();
			});
	});
	it('should display an error if the user tries to submit without uploading an appeal statement', (done) => {
		const appealStatementMissingError = 'Select your appeal statement';
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = true;

		global.runFunctionSync('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(false);
			const errorSummary = document.getElementById('error-summary');
			const errorSummaryItems = errorSummary.querySelectorAll(`li`);
			expect(errorSummary.style.display).toEqual('block');
			expect(errorSummaryItems.length).toEqual(1);
			expect(errorSummaryItems[0].textContent).toEqual(appealStatementMissingError);
			done();
		});
	});
});
