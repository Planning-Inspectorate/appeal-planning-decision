export class BasePage {
	_selectors={
		answerYes: "answer-yes",
		answerNo:  "answer-no",
		applicationType: "application-type",
		localPlanningDpmt: "local-planning-department",
		listedBuilding: "listed-building",
		applicaitonDecision: "application-decision",
		decisionDate: "decision-date",
		enforcementNotice: "enforcement-notice",
		govukButton: ".govuk-button",
		govukPanelTitle: ".govuk-panel__title",
		localPlanningDepartment: "#local-planning-department",
		localPlanningDepartmentOptionZero: "#local-planning-department__option--0",
		answerHouseholderPlanning: "answer-householder-planning",
		answerFullAppeal: "answer-full-appeal",
		answerListedBuilding: "answer-listed-building",
		answerRefused: "answer-refused",
		answerNodecisionreceived: "answer-nodecisionreceived",
		answerGranted: "answer-granted",
		siteSelectionSeven: "#site-selection-7",		
		govukErrorSummaryBody: ".govuk-error-summary__body  > ul > li > a",
		govukHeadingOne: ".govuk-heading-l",
		govukBody: ".govuk-body",
		govukLink: ".govuk-link",
		govukSummaryListKey: ".govuk-summary-list__key",
		trgovukTableRow:"tr.govuk-table__row",
		trgovukTableCell:"td.govuk-table__cell",
		dlgovukSummaryListAppealDetails:"dl.govuk-summary-list.appeal-details",
		govukSummaryListRow:'.govuk-summary-list__row',
		agovukLink:"a.govuk-link",		
		govukSummaryListValue:".govuk-summary-list__value",
		
	}

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
		completedTask: () => cy.get('[data-cy="task-list-item-contactDetailsSection"]'),
		clickRadioBtn: (radioId) => cy.get(radioId),
		clickCheckBox: (checkboxId) => cy.get(checkboxId),
		addTextField: (fieldType) => cy.get(fieldType),
	};

	backBtn() {
		this.basePageElements.backBtn().click();
	}

	clickRadioBtn(radioId) {
		this.basePageElements.clickRadioBtn(radioId).click();
	}

	clickCheckBox(checkboxId) {
		this.basePageElements.clickCheckBox(checkboxId).click();
	}
	addTextField(fieldType, fieldValue) {
		this.basePageElements.addTextField(fieldType).type(fieldValue);
	}

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

	fileUpload(file) {
		this.basePageElements.uploadFile().selectFile(file, { force: true });
	}

	completedTaskBtn(string) {
		this.basePageElements.completedTask().contains(string)
	}
}
