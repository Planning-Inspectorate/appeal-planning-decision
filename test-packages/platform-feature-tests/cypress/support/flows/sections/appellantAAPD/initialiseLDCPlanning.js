// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../utils/dateService";
import { assignCaseOfficer } from "../../pages/back-office-appeals/assign-case-officer";
import { happyPathHelper } from "../../pages/back-office-appeals/happyPathHelper";
import { appealIdWaitingForReview } from "../appealIdWaitingForReview";
import { ipCommentsForAppealRef } from "../ipComments/ipComments";
import { questionnaire } from "../lpaManageAppeals/questionnaire";
import { statementForCaseRef } from "../lpaManageAppeals/statement";
import { viewValidatedAppealDetailsLPA } from "../lpaManageAppeals/viewValidatedAppealDetailsLPA";
import { appealsApiClient } from "../../../appealsApiClient";
import { appealsE2EIntegration } from "../appealsE2EIntegration";

const applicationFormPage = require("../../pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../../pages/appellant-aapd/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../../pages/appellant-aapd/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownSomeLandPage");
const { AgriculturalHoldingPage } = require("../../pages/appellant-aapd/prepare-appeal/agriculturalHoldingPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { DecideAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../../pages/appellant-aapd/upload-documents/uploadApplicationFormPage");
const { SubmitPlanningObligationPage } = require("../../pages/appellant-aapd/upload-documents/submitPlanningObligationPage");
const { SeparateOwnershipCertificatePage } = require("../../pages/appellant-aapd/upload-documents/separateOwnershipCertificatePage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { SubmitDesignAccessStatementPage } = require("../../pages/appellant-aapd/upload-documents/submitDesignAccessStatementPage");
const { NewPlansDrawingsPage } = require("../../pages/appellant-aapd/upload-documents/newPlansDrawingsPage");
const { OtherNewDocumentsPage } = require("../../pages/appellant-aapd/upload-documents/otherNewDocumentsPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { MajorMinorDevelopmentPage } = require("../../pages/appellant-aapd/prepare-appeal/majorMinorDevelopmentPage");
const { ApplicationAboutPage } = require("../../pages/appellant-aapd/prepare-appeal/applicationAboutPage");
const { PrepareAppealSelector } = require("../../../../page-objects/prepare-appeal/prepare-appeal-selector");
const { LawfulDevelopmentCertificateTypePage } = require("../../pages/appellant-aapd/prepare-appeal/lawfulDevelopmentCertificateTypePage");

module.exports = (planning, grantedOrRefusedId, applicationType, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases = [], statementTestCases = []) => {
	const basePage = new BasePage();
	const prepareAppealSelector = new PrepareAppealSelector();
	const applicationNamePage = new ApplicationNamePage();
	const contactDetailsPage = new ContactDetailsPage();
	const appealSiteAddressPage = new AppealSiteAddressPage();
	const siteAreaPage = new SiteAreaPage();
	const greenBeltPage = new GreenBeltPage();
	const ownAllLandPage = new OwnAllLandPage();
	const ownSomeLandPage = new OwnSomeLandPage();
	const agriculturalHoldingPage = new AgriculturalHoldingPage();
	const inspectorNeedAccessPage = new InspectorNeedAccessPage();
	const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
	const majorMinorDevelopmentPage = new MajorMinorDevelopmentPage();
	const applicationAboutPage = new ApplicationAboutPage();
	const decideAppealsPage = new DecideAppealsPage();
	const otherAppealsPage = new OtherAppealsPage();
	const uploadApplicationFormPage = new UploadApplicationFormPage();
	const submitPlanningObligationPage = new SubmitPlanningObligationPage();
	const separateOwnershipCertificatePage = new SeparateOwnershipCertificatePage();
	const applyAppealCostsPage = new ApplyAppealCostsPage();
	const submitDesignAccessStatementPage = new SubmitDesignAccessStatementPage();
	const newPlansDrawingsPage = new NewPlansDrawingsPage();
	const otherNewDocumentsPage = new OtherNewDocumentsPage();
	const date = new DateService();
	const lawfulDevelopmentCertificateTypePage = new LawfulDevelopmentCertificateTypePage();
	if (context?.isListedBuilding) {
		cy.getByData(grantedOrRefusedId).click();
		cy.advanceToNextPage();
		if (grantedOrRefusedId === basePage._selectors?.answerNodecisionreceived) {
			cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.beforeYouStart}/date-decision-due`);
		}
		else {
			cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.beforeYouStart}/decision-date`);
		}

		cy.get(prepareAppealSelector?._ldcAppealSelectors?.decisionDateDay).type(date.today());
		cy.get(prepareAppealSelector?._ldcAppealSelectors?.decisionDateMonth).type(date.currentMonth());
		cy.get(prepareAppealSelector?._ldcAppealSelectors?.decisionDateYear).type(date.currentYear());
		cy.advanceToNextPage();
	}

	cy.getByData(basePage?._selectors.applicationType).should('have.text', applicationType);
	// LDC can-use-service uses a generic Continue button
	cy.advanceToNextPage(prepareAppealData?.button);

	cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.ldcAppealSubmit}/email-address`);
	cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.ldcAppealSubmit}/enter-code`);
	cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.ldcAppealSubmit}/email-address-confirmed`);
	cy.advanceToNextPage();

	cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealForm}/before-you-start`);
	cy.advanceToNextPage();

	cy.location('search').then((search) => {
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');

		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealForm}/your-appeal`);
		applicationFormPage(prepareAppealSelector?._selectors?.ldcApplicationType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);
		//Contact details
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/application-name`);
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant, prepareAppealData);

		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/contact-details`);
		contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.ldcApplicationType, prepareAppealData);

		//Site Details
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/appeal-site-address`);
		appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

		//Is the appeal site in a green belt?(Ans:Yes)
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/green-belt`);
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/inspector-need-access`);
		inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);
		//Health and safety issues
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/health-safety-issues`);
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);
		//What is the application reference number?
		const applicationNumber = `TEST-${Date.now()}`;
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/reference-number`);
		cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
		cy.advanceToNextPage();
		//What date did you submit your application?
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/application-date`);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
		cy.advanceToNextPage();

		//What did you use the appeal site for when you made the application?
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/existing-use`);
		cy.get(prepareAppealSelector?._selectors?.siteUseAtTimeOfApplication).type(prepareAppealData?.siteUseAtTimeOfApplication);
		cy.advanceToNextPage();

		//What type of lawful development certificate is the appeal about?
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/lawful-development-certificate-type`);
		cy.log('LDc Type is:', context?.applicationForm?.ldcType);
		lawfulDevelopmentCertificateTypePage.addLawfulDevelopmentCertificateTypeData(context?.applicationForm?.ldcType);

		if (context?.applicationForm?.ldcType === 'proposed-changes-to-a-listed-building' || context?.applicationForm?.ldcType === 'proposed-use-of-a-development') {
			//Enter the description of development that you submitted in your application
			cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/enter-description-of-development`);
			cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
			cy.advanceToNextPage();
			//Did the local planning authority change the description of development?

			cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/description-development-correct`)
			if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
				cy.getByData(basePage?._selectors.answerYes).click();
				cy.advanceToNextPage();
			} else {
				cy.getByData(basePage?._selectors.answerNo).click();
				cy.advanceToNextPage();
			}
		}

		//How would you prefer us to decide your appeal?		
		decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);
		cy.validateURL(`${prepareAppealSelector?._ldcAppealURLs?.appealsLdcAppealPrepareAppeal}/other-appeals`);
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

		cy.uploadDocuments(prepareAppealSelector?._selectors?.ldcApplicationType, prepareAppealSelector?._selectors?.uploadApplicationForm, dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context);

		submitPlanningObligationPage.addSubmitPlanningObligationData(context);

		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
		cy.advanceToNextPage();

		if (context?.applicationForm?.appellantProcedurePreference !== prepareAppealSelector?._selectors?.statusOfOriginalApplicationWritten) {
			//Upload your draft statement of common ground			
			cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDraftStatementOfCommonGround);
			cy.advanceToNextPage();
		}

		applyAppealCostsPage.addApplyAppealCostsData(context);
		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlansDrawingAndSupportingDocs);
		cy.advanceToNextPage();
		newPlansDrawingsPage.addNewPlansDrawingsData(context);
		otherNewDocumentsPage.addOtherNewDocumentsData(context);

		//submit
		cy.get(`a[href*="/appeals/ldc/submit/declaration?id=${dynamicId}"]`).click();

		cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();

		cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
			expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
		});
	});
	if (context?.endToEndIntegration) {
		appealsE2EIntegration(context, applicationType, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
	}
};