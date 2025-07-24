// @ts-nocheck

import { formatDateAndTime } from '../../../../utils/formatDateAndTime';
import { Page } from './basePage';
import { DateTimeSection } from './dateTimeSection.js';


const dateTimeSection = new DateTimeSection();
export class CaseDetailsPage extends Page {
	/********************************************************
	 ************************ Locators ***********************
	 *********************************************************/

	_cyDataSelectors = {
		reviewLpaQuestionnaire: 'review-lpa-questionnaire-banner',
		changeCaseOfficer: 'change-case-officer',
		assignCaseOfficer: 'assign-case-officer',
		assignInspector: 'assign-inspector',
		changeInspector: 'change-inspector',
		reviewAppellantCase: 'review-appellant-case',
		setUpSiteVisit: 'set up-site-visit',
		changeSetVisitType: 'change-set-visit-type',
		changeScheduleVisit: 'change-schedule-visit',
		arrangeScheduleVisit: 'arrange-schedule-visit',
		readyToStart: 'ready-to-start',
		issueDetermination: 'issue-determination',
		addLinkedAppeal: 'add-linked-appeal',
		manageLinkedAppeals: 'manage-linked-appeals',
		addRelatedAppeals: 'add-related-appeals',
		addCrossTeamCorrespondence: 'add-cross-team-correspondence',
		addInspectorCorrespondence: 'add-inspector-correspondence',
		addMainPartyCorrespondence: 'add-main-party-correspondence',
		manageCrossTeamCorrespondence: 'manage-cross-team-correspondence',
		manageInspectorCorrespondence: 'manage-inspector-correspondence',
		manageMainPartyCorrespondence: 'manage-main-party-correspondence',
		manageRelatedAppeals: 'manage-related-appeals',
		changeAppealType: 'change-appeal-type',
		addAgreementToChangeDescriptionEvidence: 'add-agreement-to-change-description-evidence',
		addNotifyingParties: 'add-notifying-parties',
		manageNotifyingParties: 'manage-notifying-parties',
		manageAgreementToChangeDescriptionEvidence: 'manage-agreement-to-change-description-evidence',
		addCostsDecision: 'add-costs-decision',
		changeSiteOwnership: 'change-site-ownership',
		changeLpaqDueDate: 'change-lpa-questionnaire-due-date',
		changeStartDate: 'change-start-case-date',
		startAppealWithdrawal: 'start-appeal-withdrawal',
		viewAppealWithdrawal: 'view-appeal-withdrawal',
		changeAppellant: 'change-appellant',
		changeAgent: 'change-agent',
		setupSiteVisitBanner: 'set-up-site-visit-banner',
		reviewIpComments: 'banner-review-ip-comments',
		reviewLpaStatement: 'banner-review-lpa-statement',
		changeApplicationReference: 'change-application-reference',
		viewCaseHistory: 'view-case-history',
		uploadFile: 'upload-file-button'
	};

	fixturesPath = 'cypress/fixtures/';

	sampleFiles = {
		document: 'sample-file.doc',
		document2: 'sample-file-2.doc',
		document3: 'sample-file-3.doc',
		img: 'sample-img.jpeg',
		pdf: 'test.pdf'
	};

	elements = {
		reviewLpaQuestionnaire: () => cy.getByData(this._cyDataSelectors.reviewLpaQuestionnaire),
		changeCaseOfficer: () => cy.getByData(this._cyDataSelectors.changeCaseOfficer),
		assignCaseOfficer: () => cy.getByData(this._cyDataSelectors.assignCaseOfficer).last(),
		assignInspector: () => cy.getByData(this._cyDataSelectors.assignInspector),
		changeInspector: () => cy.getByData(this._cyDataSelectors.changeInspector),
		answerCellAppeals: (answer) =>
			cy.contains(this.selectors.summaryListValue, answer, { matchCase: false }),
		reviewAppeallantCase: () => cy.getByData(this._cyDataSelectors.reviewAppellantCase),
		setUpSiteVisit: () => cy.getByData(this._cyDataSelectors.setUpSiteVisit),
		changeSetVisitType: () => cy.getByData(this._cyDataSelectors.changeSetVisitType),
		changeScheduleVisit: () => cy.getByData(this._cyDataSelectors.changeScheduleVisit),
		arrangeScheduleVisit: () => cy.getByData(this._cyDataSelectors.arrangeScheduleVisit),
		readyToStart: () => cy.getByData(this._cyDataSelectors.readyToStart),
		issueDecision: () => cy.getByData(this._cyDataSelectors.issueDetermination),
		addLinkedAppeal: () => cy.getByData(this._cyDataSelectors.addLinkedAppeal),
		addRelatedAppeals: () => cy.getByData(this._cyDataSelectors.addRelatedAppeals),
		addCrossTeamCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.addCrossTeamCorrespondence),
		addInspectorCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.addInspectorCorrespondence),
		addMainPartyCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.addMainPartyCorrespondence),
		manageLinkedAppeals: () => cy.getByData(this._cyDataSelectors.manageLinkedAppeals),
		manageNotifyingParties: () => cy.getByData(this._cyDataSelectors.manageNotifyingParties),
		clickLinkedAppeal: () => cy.getByData(this._cyDataSelectors.clickLinkedAppeal),
		manageRelatedAppeals: () => cy.getByData(this._cyDataSelectors.manageRelatedAppeals),
		uploadFile: () => cy.getByData(this._cyDataSelectors.uploadFile),
		changeAppealType: () => cy.getByData(this._cyDataSelectors.changeAppealType),
		addAgreementToChangeDescriptionEvidence: () =>
			cy.getByData(this._cyDataSelectors.addAgreementToChangeDescriptionEvidence),
		addNotifiyingParties: () => cy.getByData(this._cyDataSelectors.addNotifyingParties),
		manageAgreementToChangeDescriptionEvidence: () =>
			cy.getByData(this._cyDataSelectors.manageAgreementToChangeDescriptionEvidence),
		addCostsDecision: () => cy.getByData(this._cyDataSelectors.addCostsDecision),
		costDecisionStatus: () => cy.get('.govuk-table__cell appeal-costs-decision-status'),
		changeSiteOwnership: () => cy.getByData(this._cyDataSelectors.changeSiteOwnership),
		changeLpaqDueDate: () => cy.getByData(this._cyDataSelectors.changeLpaqDueDate), // refactor this
		changeStartDate: () => cy.getByData(this._cyDataSelectors.changeStartDate),
		getTimetableDate: (timeTableRow) =>
			cy.get(`.appeal-${timeTableRow} > .govuk-summary-list__value`),
		startAppealWithdrawal: () => cy.getByData(this._cyDataSelectors.startAppealWithdrawal),
		getAppealRefCaseDetails: () => cy.get('.govuk-caption-l'),
		removeFileUpload: () => cy.get('Button').contains('Remove'),
		fileUploadRow: () => cy.get('.govuk-heading-s'),
		viewAppealWithdrawal: () => cy.getByData(this._cyDataSelectors.viewAppealWithdrawal),
		caseNotes: () => cy.get('.govuk-details__summary-text'),
		inputCaseNotes: () => cy.get('textArea'),
		checkCaseNoteAdded: () => cy.get('section'),
		changeAppellant: () => cy.getByData(this._cyDataSelectors.changeAppellant),
		changeAgent: () => cy.getByData(this._cyDataSelectors.changeAgent),
		getAppellantEmailAddress: () => cy.get('#email-address.govuk-input'),
		getAgentEmailAddress: () => cy.get('#email-address.govuk-input'),
		getWarningText: () => cy.get('.govuk-warning-text__text'),
		manageCrossTeamCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.manageCrossTeamCorrespondence),
		manageInspectorCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.manageInspectorCorrespondence),
		manageMainPartyCorrespondence: () =>
			cy.getByData(this._cyDataSelectors.manageMainPartyCorrespondence),
		decisionOutcomeText: () => cy.get('.govuk-inset-text'),
		manageCostDecision: () =>
			cy
				.get('.govuk-table__row')
				.contains('Costs decision')
				.siblings()
				.eq(1)
				.children()
				.first()
				.children()
				.first(), //Returns the manage link next in the Costs decsion row under costs section
		changeRedactionStatus: () =>
			cy.get('.govuk-summary-list__key').contains('Redaction status').siblings().eq(1).children(),
		changeDocFileName: () =>
			cy.get('.govuk-summary-list__key').contains('Name').siblings().eq(1).children(),
		redactionStatus: () =>
			cy.get('.govuk-summary-list__key').contains('Redaction status').siblings().eq(0),
		docVersionNumber: () => cy.get('.govuk-summary-list__key').contains('Version').siblings().eq(0),
		documentName: () => cy.get('.govuk-summary-list__key').contains('Name').siblings().eq(0),
		fileNameTextInput: () => cy.get('#file-name'),
		siteVisitBanner: () => cy.getByData(this._cyDataSelectors.setupSiteVisitBanner),
		ipCommentsReviewLink: () => cy.getByData(this._cyDataSelectors.reviewIpComments),
		lpaStatementReviewLink: () => cy.getByData(this._cyDataSelectors.reviewLpaStatement),
		caseStatusTag: () => cy.get('.govuk-grid-column-full > .govuk-grid-column-full > .govuk-tag'),
		rowChangeLink: (row) => cy.getByData(`change-${row}`),
		showMoreToggle: () => cy.get('.pins-show-more__toggle-label'),
		showMoreContent: () => cy.get('.pins-show-more'),
		lPAStatementTableChangeLink: (row) =>
			cy.get('.govuk-summary-list__key').contains(row).siblings().children('a'),
		caseDetailsHearingSectionButton: () => cy.get('#case-details-hearing-section > .govuk-button'),
		caseDetailsHearingEstimateLink: () => cy.get('#case-details-hearing-section p > a'),
		changeApplicationReferenceLink: () =>
			cy.getByData(this._cyDataSelectors.changeApplicationReference),
		planningApplicationReferenceField: () => cy.get('#planning-application-reference'),
		viewCaseHistory: () => cy.getByData(this._cyDataSelectors.viewCaseHistory),
		cancelHearing: () => cy.get('#cancelHearing')
	};
	/********************************************************
	 ************************ Actions ************************
	 *********************************************************/

	clickManageDocsCostDecision() {
		this.elements.manageCostDecision().click();
	}

	checkDocVersionNumber(versionNumber) {
		let version = this.elements.docVersionNumber().invoke('prop', 'innerText');
		version.should('eq', versionNumber);
	}

	checkFileName(fileName) {
		let nameOfFile = this.elements.documentName().invoke('prop', 'innerText');
		nameOfFile.should('eq', fileName);
	}

	clickChangeRedactionStatus() {
		this.elements.changeRedactionStatus().click();
	}

	clickChangeFileName() {
		this.elements.changeDocFileName().click();
	}

	updateFileName(newFileName) {
		this.elements.fileNameTextInput().clear();
		this.elements.fileNameTextInput().type(newFileName);
	}

	checkRedactionStatus(status) {
		let redactionStatus = this.elements.redactionStatus().invoke('prop', 'innerText');
		redactionStatus.should('eq', status);
	}

	searchForCaseOfficer(text) {
		this.fillInput(text);
		this.clickButtonByText('Search');
	}

	clickAddAdditionalDocs() {
		this.basePageElements.additionalDocumentsAdd().click();
	}

	clickManageAdditionalDocs() {
		this.basePageElements.additonalDocumentManage().click();
	}

	clickChooseCaseOfficerResult(email) {
		cy.getByData(email.toLocaleLowerCase()).click();
	}

	clickReviewLpaq() {
		this.elements.reviewLpaQuestionnaire().click();
	}

	clickAssignCaseOfficer() {
		this.clickAccordionByText('Team');
		this.elements.assignCaseOfficer().click();
	}

	clickAssignInspector() {
		this.clickAccordionByText('Team');
		this.elements.assignInspector().click();
	}

	clickReviewAppellantCase() {
		this.clickAccordionByButton('Documentation');
		this.elements.reviewAppeallantCase().click();
	}

	clickSetUpSiteVisitType() {
		this.clickAccordionByButton('Site');
		this.elements.setUpSiteVisit().click();
	}

	clickReadyToStartCase() {
		this.elements.readyToStart().click();
	}

	clickCaseNotes() {
		this.elements.caseNotes().click();
	}

	inputCaseNotes(text, index = 0) {
		this.elements.inputCaseNotes().eq(index).clear().type(text);
	}

	checkCaseNoteAdded(text) {
		this.elements.checkCaseNoteAdded().contains(text);
	}

	clickArrangeVisitTypeHasCaseTimetable() {
		this.clickAccordionByText('Timetable');
		this.elements.arrangeScheduleVisit().click();
	}

	clickChangeVisitTypeHasCaseTimetable() {
		this.clickAccordionByText('Timetable');
		this.elements.changeScheduleVisit().click();
	}

	clickIssueDecision() {
		this.elements.issueDecision().click();
	}

	clickAddLinkedAppeal() {
		this.elements.addLinkedAppeal().click();
	}

	clickManageLinkedAppeals() {
		this.elements.manageLinkedAppeals().click();
	}

	clickAddRelatedAppeals() {
		this.elements.addRelatedAppeals().click();
	}

	clickManageRelatedAppeals() {
		this.elements.manageRelatedAppeals().click();
	}

	clickAddCrossTeamCorrespondence() {
		this.elements.addCrossTeamCorrespondence().click();
	}

	clickAddNotifyingParties() {
		this.elements.addNotifiyingParties().click();
	}

	clickManageNotifyingParties() {
		this.elements.manageNotifyingParties().click();
	}

	clickAddInspectorCorrespondence() {
		this.elements.addInspectorCorrespondence().click();
	}

	clickAddMainPartyCorrespondence() {
		this.elements.addMainPartyCorrespondence().click();
	}

	clickManageInspectorCorrespondence() {
		this.elements.manageInspectorCorrespondence().click();
	}

	clickManageCrossTeamCorrespondence() {
		this.elements.manageCrossTeamCorrespondence().click();
	}

	clickManageMainPartyCorrespondence() {
		this.elements.manageMainPartyCorrespondence().click();
	}

	clickChangeAppealType() {
		this.elements.changeAppealType().click();
	}

	clickAddCostsDecision() {
		this.elements.addCostsDecision().click();
	}

	clickChangeSiteOwnership() {
		this.elements.changeSiteOwnership().click();
	}

	clickChangeLpaqDueDate() {
		this.clickAccordionByText('Timetable');
		this.elements.changeLpaqDueDate().click();
	}
	clickChangeStartDate() {
		this.clickAccordionByText('Timetable');
		this.elements.changeStartDate().click();
	}

	clickStartAppealWithdrawal() {
		this.elements.startAppealWithdrawal().click();
	}

	clickChangeAppellant() {
		this.clickAccordionByText('Contacts');
		this.elements.changeAppellant().click();
	}

	clickChangeAgent() {
		this.clickAccordionByText('Contacts');
		this.elements.changeAgent().click();
	}

	uploadSampleFile(fileName) {
		this.elements
			.uploadFile()
			.click()
			.selectFile(this.fixturesPath + fileName, { action: 'drag-drop' }, { force: true });
	}

	clickViewAppealWithdrawal() {
		this.elements.viewAppealWithdrawal().click();
	}

	inputAppellantEmailAddress(text) {
		this.elements.getAppellantEmailAddress().click().clear().type(text);
	}

	inputAgentEmailAddress(text) {
		this.elements.getAgentEmailAddress().click().clear().type(text);
	}
	// TODO Get this to use the vanilla 'clickButtonByText()' function
	// This currently doesn't work, as there are multiple matches and some of not invisible
	clickAddAnother() {
		cy.get(this.selectors.button).filter(':visible').contains('Add another').click();
	}

	clickAddAgreementToChangeDescriptionEvidence() {
		this.elements.addAgreementToChangeDescriptionEvidence().click();
	}

	clickManageAgreementToChangeDescriptionEvidence() {
		this.elements.manageAgreementToChangeDescriptionEvidence().click();
	}

	confirmCostDecisionStatus(text) {
		this.elements.costDecisionStatus().contains(text);
	}

	clickRemoveRelatedAppealByRef(caseRefToRelate) {
		cy.log(caseRefToRelate);
		cy.getByData('remove-appeal-' + caseRefToRelate).click();
	}

	clickLinkedAppeal(caseRef) {
		cy.getByData('linked-appeal-' + caseRef).click();
	}

	clickRemoveFileUpload(fileName) {
		this.elements.fileUploadRow().contains(fileName).next().click();
	}

	changeFileManageDocuments(rowName) {
		this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.next()
			.invoke('prop', 'firstChildElement', 'href')
			.click();
	}

	viewDecisionLetter(text) {
		this.basePageElements.linkByText(text);
	}

	clickSiteVisitBanner(caseRef) {
		this.elements.siteVisitBanner(caseRef).click();
	}

	clickRowChangeLink(row) {
		this.elements.rowChangeLink(row).click();
	}

	clickLpaStatementChangeLink(row) {
		this.elements.lPAStatementTableChangeLink(row).click();
	}

	clickHearingButton() {
		this.elements.caseDetailsHearingSectionButton().click();
	}

	clickHearingEstimateLink() {
		this.elements.caseDetailsHearingEstimateLink().click();
	}

	clickViewCaseHistory() {
		this.elements.viewCaseHistory().click();
	}

	clickCancelHearing() {
		this.elements.cancelHearing().click();
	}

	/***************************************************************
	 ************************ Verification ************************
	 ****************************************************************/

	checkAdditonalDocsAppellantCase(value) {
		this.basePageElements.summaryListValue().last().contains(value).should('be.visible');
	}

	checkFileNameDisplays(fileName) {
		cy.get('p').contains(fileName).should('be.visible');
	}

	checkFileNameRemoved(fileName) {
		let savedFile = cy.get('p').contains(fileName);
		savedFile.should('not.exist');
	}

	checkAnswerWithdrawalRequest(rowName, rowAnswer) {
		let answer = this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.children()
			.invoke('prop', 'textContent');
		answer.should('eq', rowAnswer);
	}

	checkAnswerRedactionStatus(rowName, rowAnswer) {
		let answer = this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.invoke('prop', 'innerText');
		answer.should('eq', rowAnswer);
	}

	checkCorrectAnswerDisplays(rowName, rowAnswer) {
		let answer = this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.invoke('prop', 'innerText');
		answer.should('eq', rowAnswer);
	}

	checkAnswerCorrespondenceDoc(rowName, rowAnswer) {
		let answer = this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.children()
			.invoke('prop', 'textContent');
		answer.should('eq', rowAnswer);
	}

	checkAnswerNotifyingParties(rowName, rowAnswer) {
		let answer = this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.invoke('prop', 'textContent');
		answer.should('include', rowAnswer);
	}

	checkDecisionOutcome(text) {
		this.elements.decisionOutcomeText().contains(text, { matchCase: false });
	}

	checkViewDecisionLetterIsLink(text) {
		this.elements.decisionOutcomeText().contains(this.basePageElements.link, text);
	}

	verifyAnswerSummaryValue(answer) {
		this.elements.answerCellAppeals(answer).then(($elem) => {
			cy.wrap($elem)
				.invoke('text')
				.then((text) =>
					expect(text.trim().toLocaleLowerCase()).to.include(answer.toLocaleLowerCase())
				);
		});
	}

	verifyTableCellTextCaseHistory(answer) {
		this.basePageElements.tableCell(answer).then(($elem) => {
			cy.wrap($elem)
				.invoke('text')
				.then((text) =>
					expect(text.trim().toLocaleLowerCase()).to.include(answer.toLocaleLowerCase())
				);
		});
	}
	verifyDateChanges(timeTableRow, date) {
		const formattedDate = formatDateAndTime(date).date;
		this.elements
			.getTimetableDate(timeTableRow)
			.invoke('text')
			.then((dateText) => {
				expect(dateText.trim()).to.equal(formattedDate);
			});
	}

	verifyAppellantEmailAddress(rowName, text) {
		this.basePageElements
			.summaryListKey()
			.then(($elem) => {
				return $elem.filter((index, el) => el.innerText.trim() === rowName);
			})
			.next()
			.contains(text);
	}

	verifyCheckYourAnswerDate(rowName, dateToday) {
		//verify the date on check your answer page is correct
		const formattedDate = formatDateAndTime(dateToday).date;
		this.basePageElements
			.summaryListKey()
			.contains(rowName)
			.next()
			.invoke('prop', 'innerText')
			.then((dateText) => {
				expect(dateText.toString().trim()).to.equal(formattedDate);
			});
	}

	verifyAppealRefOnCaseDetails(caseRef) {
		this.elements.getAppealRefCaseDetails().contains(caseRef);
	}

	verifyWarningText(text) {
		this.elements.getWarningText().contains(text);
	}

	reviewIpComments(valid) {
		const rbValue = valid ? 'Accept comment' : 'Reject comment';
		this.elements.ipCommentsReviewLink().click();
		this.clickLinkByText('Review');
		this.selectRadioButtonByValue(rbValue);
		this.clickButtonByText('Confirm');
		if (valid === false) {
			this.chooseCheckboxByText('Not relevant to this appeal');
			this.clickButtonByText('Continue');
			this.selectRadioButtonByValue('No');
			this.clickButtonByText('Continue');
			this.clickButtonByText('Reject comment');
		}
	}

	reviewLpaStatement(isAllocationPageExist = true) {
		this.elements.lpaStatementReviewLink().click();
		this.selectRadioButtonByValue('Accept statement');
		this.clickButtonByText('Continue');
		if (isAllocationPageExist) {
			this.selectRadioButtonByValue('A');
			this.clickButtonByText('Continue');
			this.selectCheckbox();
		} else {
			this.selectRadioButtonByValue('No');
		}
		this.clickButtonByText('Continue');
		this.clickButtonByText('Confirm');
	}

	reviewFinalComment(type) {
		cy.reload();
		this.basePageElements.bannerLink().click();
		this.selectRadioButtonByValue('Accept final comment');
		this.clickButtonByText('Continue');
		this.clickButtonByText(`Accept ${type} final comment`);
	}

	checkTimetableDueDateIsDisplayed(row) {
		this.elements.getTimetableDate(row).should('be.visible');
	}

	changeTimetableDate(date) {
		dateTimeSection.enterDate(date);
		this.clickButtonByText('Confirm');
	}

	acceptLpaStatement(caseRef, updateAllocation, representation) {
		cy.addRepresentation(caseRef, 'lpaStatement', null, representation).then((caseRef) => {
			cy.reload();
		});
		this.elements.lpaStatementReviewLink().click();
		this.selectRadioButtonByValue('Accept statement');
		this.clickButtonByText('Continue');
		this.selectRadioButtonByValue(updateAllocation);
		this.clickButtonByText('Continue');
	}

	verifyStatementIsDisplayed(statement, isToggleDisplayed) {
		if (isToggleDisplayed) {
			this.elements.showMoreToggle().contains('Read more').should('be.visible');
			this.elements.showMoreToggle().click();
			this.elements.showMoreToggle().contains('Close').should('be.visible');
		} else {
			this.elements.showMoreToggle().should('not.exist');
		}
		this.elements.showMoreContent().should('contain.text', statement);
	}

	verifyHearingEstimateSectionIsDisplayed() {
		this.elements.caseDetailsHearingEstimateLink().should('contain.text', 'Add hearing estimates');
	}

	verifyHearingSectionIsDisplayed() {
		this.elements.caseDetailsHearingSectionButton().should('be.visible');
	}

	clickChangeApplicationReferenceLink() {
		this.elements.changeApplicationReferenceLink().click();
	}

	updatePlanningApplicationReference(reference) {
		this.elements.planningApplicationReferenceField().clear().type(reference);
		this.clickButtonByText('Continue');
	}
}
