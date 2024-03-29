export class BasePage {
	basePageElements = {
		acceptCookiesBtn: () => cy.get('[data-cy="cookie-banner-accept-analytics-cookies"]'),
		declineCookiesBtn: () => cy.get('[data-cy="cookie-banner-reject-analytics-cookies"]'),
		pageHeading: () => cy.get('.govuk-heading-l'),
		continueBtn: () => cy.get('[data-cy="start-button"]'),
		radioBtn: () => cy.get('.govuk-radios__input'),
		checkBox: () => cy.get('.govuk-checkboxes__input'),
		backBtn: () => cy.get('[data-cy="back"]'),
		saveAndContiuneBtn: () => cy.get('[data-cy="button-save-and-continue"]'),
		saveAndComeBackLaterBtn: () => cy.get('[data-cy="button-save-and-return"]'),
		textArea: () => cy.get('.govuk-textarea'),
		uploadFile: () => cy.get('#file-upload'),
		completedTask: () => cy.get('[data-cy="task-list-item-contactDetailsSection"]')
	};

	clickContinueBtn() {
		this.basePageElements.continueBtn().click();
	}

	clickSaveAndContiuneBtn() {
		this.basePageElements.saveAndContiuneBtn().click();
	}

	acceptCookies() {
		this.basePageElements.acceptCookiesBtn().click();
	}

	declineCookies() {
		this.basePageElements.declineCookiesBtn().click();
	}

	verifyPageHeading(pageHeading) {
		this.basePageElements.pageHeading().contains(pageHeading);
	}

	selectCheckBox(checkBoxValue) {
		this.basePageElements.checkBox().check(checkBoxValue);
	}

	selectRadioBtn(radioBtnValue) {
		this.basePageElements.radioBtn().check(radioBtnValue);
	}

	clickSaveAndComeBackLaterBtn() {
		this.basePageElements.saveAndComeBackLaterBtn().click();
	}

	enterTextArea(text) {
		this.basePageElements.textArea().clear().type(text);
	}

	fileUpload(file){
		this.basePageElements.uploadFile().selectFile(file, {force: true} );
	}

	completedTaskBtn(string){
		this.basePageElements.completedTask().contains(string)
	}
}
