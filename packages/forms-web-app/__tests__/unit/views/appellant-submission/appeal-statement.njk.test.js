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
	it('should display an error if the user tries to submit without ticking the confirmation checkbox', (done) => {
		const sensitiveInformationError =
			'Select to confirm you have not included sensitive information';
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = false;
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
	it.skip('should submit the form if the user has already checked the confirmation checkbox', (done) => {
		document.body.innerHTML = nunjucksTestRenderer.render(
			`${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}.njk`
		);
		const checkbox = document.getElementById('does-not-include-sensitive-information');
		checkbox.checked = true;
		clientsideScriptHelper.reloadScript('clientside-validation', document);
		clientsideScriptHelper.runFunction('saveAndContinueClick', document, [], (result) => {
			expect(result).toEqual(true);
			done();
		});
	});
});
