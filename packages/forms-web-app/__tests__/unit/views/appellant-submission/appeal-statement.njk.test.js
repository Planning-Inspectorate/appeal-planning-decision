/**
 * @jest-environment jsdom
 */
/* eslint-env browser */
const { VIEW } = require('../../../../src/lib/views');
const nunjucksTestRenderer = require('../nunjucks-render-helper');
const fileSizeDisplayHelper = require('../../../../src/lib/file-size-display-helper');
const clientsideScriptHelper = require('../nunjucks-clientside-scripts-helper');

nunjucksTestRenderer.addFilter('formatBytes', fileSizeDisplayHelper);

describe('views/appellant-submission/appeal-statement.njk', () => {
	beforeEach(() => {});
	afterEach(() => {});
	it('should return true if the appeal statement is selected', (done) => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		const fileUpload = document.getElementById('file-upload');

		Object.defineProperty(fileUpload, 'value', {
			value: 'appealStatement.pdf',
			writable: false
		});

		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('isAppealStatementSelected', document, [], (result) => {
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
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);

		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('isAppealStatementSelected', document, [], (result) => {
			try {
				expect(result).toEqual(false);
			} catch (e) {
				console.log(e);
			} finally {
				done();
			}
		});
	});
	it('should display an error if the user tries to submit without ticking the confirmation checkbox', (done) => {
		const sensitiveInformationError =
			'Select to confirm you have not included sensitive information';
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = false;
		const fileUpload = document.getElementById('file-upload');
		Object.defineProperty(fileUpload, 'value', {
			value: 'appealStatement.pdf',
			writable: false
		});
		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(false);
			const errorSummary = document.getElementById('error-summary');
			const errorSummaryItems = errorSummary.querySelectorAll(`li`);
			expect(errorSummaryItems.length).toEqual(1);
			expect(errorSummaryItems[0].textContent).toEqual(sensitiveInformationError);
			done();
		});
	});
	it('should submit the form if the user has already checked the confirmation checkbox and selected an appeal statement', (done) => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);

		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = true;

		const fileUpload = document.getElementById('file-upload');
		Object.defineProperty(fileUpload, 'value', {
			value: 'appealStatement.pdf',
			writable: false
		});

		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(true);
			const errorSummary = document.getElementById('error-summary');
			const errorSummaryItems = errorSummary.querySelectorAll(`li`);
			expect(errorSummaryItems.length).toEqual(0);
			expect(errorSummary.style.display).toEqual('none');
			done();
		});
	});
	it('should display an error if the user tries to submit without uploading an appeal statement', (done) => {
		const appealStatementMissingError = 'Select your appeal statement';
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = true;

		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(false);
			const errorSummary = document.getElementById('error-summary');
			const errorSummaryItems = errorSummary.querySelectorAll(`li`);
			expect(errorSummaryItems.length).toEqual(1);
			expect(errorSummaryItems[0].textContent).toEqual(appealStatementMissingError);
			done();
		});
	});
});
