// @ts-nocheck

import { users } from '../../../../fixtures/users';
import { urlPaths } from '../../../urlPaths';
import { CaseDetailsPage } from './caseDetailsPage';
import { DateTimeSection } from './dateTimeSection';
import { ListCasesPage } from './listCasePage';

const caseDetailsPage = new CaseDetailsPage();
const dateTimeSection = new DateTimeSection();
const listCasesPage = new ListCasesPage();

let sampleFiles = caseDetailsPage.sampleFiles;

export const happyPathHelper = {
	assignCaseOfficer(caseRef) {
		//cy.visit(urlPaths.appealsList);
		listCasesPage.clickAppealByRef(caseRef);
		cy.log('Assigning case officer for case:', caseRef);
		//caseDetailsPage.clickAssignCaseOfficer();
		cy.get('a.govuk-notification-banner__link').contains('Assign case officer').click();

		cy.log('Searching for case officer');
		//caseDetailsPage.searchForCaseOfficer('case');
		cy.log('Selecting case officer:', users.appeals.caseAdmin.email);
		caseDetailsPage.chooseSummaryListValue(users.appeals.caseAdmin.email);
		cy.log('Continuing to assign case officer');
		//caseDetailsPage.clickLinkByText('Choose');
		//caseDetailsPage.selectRadioButtonByValue('Yes');
		caseDetailsPage.clickButtonByText('Continue');
		caseDetailsPage.clickButtonByText('Assign case officer');
		caseDetailsPage.validateBannerMessage('Case officer has been assigned');
		cy.getByData('validate-appeal').click();
		cy.get('#review-outcome').click();
		cy.advanceToNextPage();
		cy.contains('button', 'Confirm').click();
		caseDetailsPage.validateBannerMessage('Appeal valid');
		//caseDetailsPage.verifyAnswerSummaryValue(users.appeals.caseAdmin.email);
	},
	// reviewAppellantCase(caseRef) {
	// 	let dueDate = new Date();

	// 	cy.visit(urlPaths.appealsList);
	// 	listCasesPage.clickAppealByRef(caseRef);
	// 	caseDetailsPage.clickReviewAppellantCase();
	// 	caseDetailsPage.selectRadioButtonByValue('Valid');
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	dateTimeSection.enterValidDate(dueDate);
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// },
	// reviewLpaq(caseRef) {
	// 	let dueDate = new Date();

	// 	cy.visit(urlPaths.appealsList);
	// 	listCasesPage.clickAppealByRef(caseRef);
	// 	caseDetailsPage.clickReviewLpaq();
	// 	caseDetailsPage.selectRadioButtonByValue('Complete');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// },
	reviewS78Lpaq(caseRef) {
		//let dueDate = new Date();

		//cy.visit(urlPaths.appealsList);
		listCasesPage.clickAppealByRef(caseRef);
		caseDetailsPage.clickReviewLpaq();
		caseDetailsPage.selectRadioButtonByValue('Complete');
		caseDetailsPage.clickButtonByText('Confirm');
		caseDetailsPage.selectRadioButtonByValue('yes');
		caseDetailsPage.clickButtonByText('Continue');
	},

	startCase(caseRef) {
		//cy.visit(urlPaths.appealsList);
		listCasesPage.clickAppealByRef(caseRef);
		caseDetailsPage.clickReadyToStartCase();
		caseDetailsPage.clickButtonByText('Confirm');
	},

	startS78Case(caseRef, procedureType) {
		//cy.visit(urlPaths.appealsList);
		listCasesPage.clickAppealByRef(caseRef);
		caseDetailsPage.clickReadyToStartCase();
		caseDetailsPage.selectRadioButtonByValue(procedureType);
		caseDetailsPage.clickButtonByText('Continue');
		caseDetailsPage.clickButtonByText('Start case');
	},

	// changeStartDate(caseRef) {
	// 	caseDetailsPage.clickChangeStartDate();
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// },

	// validVisitDate() {
	// 	let visitDate = new Date();
	// 	visitDate.setMonth(visitDate.getMonth() + 10); // TODO What is a suitable dynamic date to use here?
	// 	return visitDate;
	// },

	// uploadDocAppellantCase(caseRef) {
	// 	cy.visit(urlPaths.appealsList);
	// 	listCasesPage.clickAppealByRef(caseRef);
	// 	happyPathHelper.assignCaseOfficer(caseRef);
	// 	caseDetailsPage.clickReviewAppellantCase();
	// 	caseDetailsPage.clickAddAgreementToChangeDescriptionEvidence();
	// 	caseDetailsPage.uploadSampleFile(sampleFiles.document);
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.validateBannerMessage('Document added');
	// },

	// manageDocsAppellantCase(caseRef) {
	// 	cy.visit(urlPaths.appealsList);
	// 	listCasesPage.clickAppealByRef(caseRef);
	// 	happyPathHelper.uploadDocAppellantCase(caseRef);
	// 	cy.reloadUntilVirusCheckComplete();
	// 	caseDetailsPage.clickManageAgreementToChangeDescriptionEvidence();
	// 	caseDetailsPage.clickLinkByText('View and edit');
	// 	caseDetailsPage.clickButtonByText('upload a new version');
	// 	caseDetailsPage.uploadSampleFile(sampleFiles.document2);
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.validateBannerMessage('Document updated');
	// },

	// uploadDocsLpaq(bannerMessage = 'Document added') {
	// 	caseDetailsPage.clickReviewLpaq();
	// 	caseDetailsPage.clickAddNotifyingParties();
	// 	caseDetailsPage.uploadSampleFile(sampleFiles.document);
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.validateConfirmationPanelMessage(
	// 		'Success',
	// 		'Who was notified about the application added'
	// 	);
	// },

	// uploadDocVersionLpaq(caseRef) {
	// 	caseDetailsPage.clickManageNotifyingParties();
	// 	caseDetailsPage.clickLinkByText('View and edit');
	// 	caseDetailsPage.clickButtonByText('Upload a new version');
	// 	caseDetailsPage.uploadSampleFile(sampleFiles.document2);
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.validateConfirmationPanelMessage('Success', 'Document updated');
	// },

	// removeDocLpaq(caseRef) {
	// 	caseDetailsPage.clickManageNotifyingParties();
	// 	caseDetailsPage.clickLinkByText('View and edit');
	// 	caseDetailsPage.clickButtonByText('Remove current version');
	// 	caseDetailsPage.selectRadioButtonByValue('Yes');
	// 	caseDetailsPage.clickButtonByText('Continue');
	// 	caseDetailsPage.validateBannerMessage('Success', 'Document removed');
	// },

	addThirdPartyComment(caseRef, state) {
		//cy.addRepresentation(caseRef, 'interestedPartyComment', null).then((caseRef) => {
			cy.reload();
			listCasesPage.clickAppealByRef(caseRef);
			caseDetailsPage.reviewIpComments(state);
			cy.reload();
	//	});
	},

	// addLpaStatement(caseRef, isAllocationPageExist = true) {
	// 	cy.addRepresentation(caseRef, 'lpaStatement', null).then((caseRef) => {
	// 		cy.reload();
	// 		caseDetailsPage.reviewLpaStatement(isAllocationPageExist);
	// 	});
	//},

	addLpaStatement(caseRef, isAllocationPageExist = true) {
		listCasesPage.clickAppealByRef(caseRef);
		caseDetailsPage.reviewLpaStatement(isAllocationPageExist);
	},

	// addLpaFinalComment(caseRef) {
	// 	cy.addRepresentation(caseRef, 'lpaFinalComment', null).then((caseRef) => {
	// 		cy.reload();
	// 		caseDetailsPage.reviewFinalComment('LPA');
	// 	});
	// },

	// addAppellantFinalComment(caseRef, serviceUserId) {
	// 	cy.addRepresentation(caseRef, 'appellantFinalComment', serviceUserId).then((caseRef) => {
	// 		cy.reload();
	// 		caseDetailsPage.reviewFinalComment('appellant');
	// 	});
	// },

	// progressSiteVisit(caseRef) {
	// 	caseDetailsPage.clickChangeVisitTypeHasSiteDetails();
	// 	caseDetailsPage.clickButtonByText('Manage the site visit');
	// 	caseDetailsPage.selectRadioButtonByValue(caseDetailsPage.exactMatch('Accompanied'));
	// 	dateTimeSection.enterVisitDate(happyPathHelper.validVisitDate());
	// 	dateTimeSection.enterVisitStartTime('08', '00');
	// 	dateTimeSection.enterVisitEndTime('12', '00');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	// caseDetailsPage.validateConfirmationPanelMessage(
	// 	// 	'Site visit scheduled',
	// 	// 	'Appeal reference ' + caseRef
	// 	// );
	// 	cy.simulateSiteVisit(caseRef).then((caseRef) => {
	// 		cy.reload();
	// 	});
	// },

	// setupSiteVisitFromBanner(caseRef) {
	// 	caseDetailsPage.clickSiteVisitBanner();
	// 	caseDetailsPage.selectRadioButtonByValue(caseDetailsPage.exactMatch('Accompanied'));
	// 	dateTimeSection.enterVisitDate(happyPathHelper.validVisitDate());
	// 	dateTimeSection.enterVisitStartTime('08', '00');
	// 	dateTimeSection.enterVisitEndTime('12', '00');
	// 	caseDetailsPage.clickButtonByText('Confirm');
	// 	caseDetailsPage.validateBannerMessage('Success', 'Site visit scheduled');
	// }
};
