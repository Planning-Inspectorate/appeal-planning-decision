import { BasePage } from "../../../page-objects/base-page";
import { prepareAppealData } from '../../../fixtures/prepareAppealData.json';
const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../pages/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../pages/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../pages/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../pages/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../pages/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../pages/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../pages/prepare-appeal/ownSomeLandPage");
const { InspectorNeedAccessPage } = require("../pages/prepare-appeal/inspectorNeedaccessPage");
const { OtherAppealsPage } = require("../pages/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../pages/upload-documents/uploadApplicationFormPage");
const { ApplyAppealCostsPage } = require("../pages/upload-documents/applyAppealCostsPage");
const { HealthSafetyIssuesPage } = require("../pages/prepare-appeal/healthSafetyIssuesPage");
const { PrepareAppealSelector } = require("../../../page-objects/prepare-appeal/prepare-appeal-selector");

module.exports = (statusOfOriginalApplication, planning, grantedOrRefusedId, context, prepareAppealData) => {
	const basePage = new BasePage();
	const prepareAppealSelector = new PrepareAppealSelector();
	const applicationNamePage = new ApplicationNamePage();
	const contactDetailsPage = new ContactDetailsPage();
	const appealSiteAddressPage = new AppealSiteAddressPage();
	const siteAreaPage = new SiteAreaPage();
	const greenBeltPage = new GreenBeltPage();
	const ownAllLandPage = new OwnAllLandPage();
	const ownSomeLandPage = new OwnSomeLandPage();
	const inspectorNeedAccessPage = new InspectorNeedAccessPage();
	const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
	const otherAppealsPage = new OtherAppealsPage();
	const uploadApplicationFormPage = new UploadApplicationFormPage();
	const applyAppealCostsPage = new ApplyAppealCostsPage();
	
	cy.getByData(grantedOrRefusedId).click();
	cy.advanceToNextPage();
	
	cy.validateURL('/before-you-start/decision-date-householder');

	let currentDate = new Date();
	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
	cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
	cy.advanceToNextPage();

	cy.getByData(basePage?._selectors.answerNo).click();
	cy.advanceToNextPage();

	cy.getByData(basePage?._selectors.applicationType).should('have.text', 'Householder Planning');
	
	cy.advanceToNextPage('Continue to my appeal');

	cy.validateURL('/appeal-householder-decision/planning-application-number');

	const applicationNumber = `TEST-${Date.now()}`;
	cy.getByData(prepareAppealSelector?._selectors?.applicationNumber).type(applicationNumber);
	cy.advanceToNextPage();

	cy.validateURL('/appeal-householder-decision/email-address');
	console.log('Prepare Appeal Data', prepareAppealData);
	cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
	cy.advanceToNextPage();

	cy.validateURL('/appeal-householder-decision/enter-code');
	cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
	cy.advanceToNextPage();

	cy.validateURL('/appeal-householder-decision/email-address-confirmed');
	cy.advanceToNextPage();

	cy.validateURL('/appeal-householder-decision/list-of-documents');
	cy.advanceToNextPage();
	cy.wait(2000);
	cy.location('search').then((search) => {
		const params = new URLSearchParams(search);
		const dynamicId = params.get('id');

		cy.validateURL('/appeals/householder/appeal-form/your-appeal');
		applicationFormPage('householder', 'other', dynamicId);

		cy.validateURL('/appeals/householder/prepare-appeal/application-name');
		//Contact details
		applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant,prepareAppealData);


		cy.validateURL('/appeals/householder/prepare-appeal/contact-details');
		contactDetailsPage.addContactDetailsData(context, 'householder',prepareAppealData);

		//Site Details		
		cy.validateURL('/appeals/householder/prepare-appeal/appeal-site-address');
		appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

		//What is the area of the appeal site?

		cy.validateURL('/appeals/householder/prepare-appeal/site-area');
		siteAreaPage.addSiteAreaData(planning, context?.applicationForm?.areaUnits, context, prepareAppealData);

		//Is the appeal site in a green belt?(Ans:Yes)

		cy.validateURL('/appeals/householder/prepare-appeal/green-belt');
		greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

		//Do you own all the land involved in the appeal?

		cy.validateURL('/appeals/householder/prepare-appeal/own-all-land');
		ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

		if (!context?.applicationForm?.isOwnsAllLand) {
			//Do you own some of the land involved in the appeal?

			cy.validateURL('/appeals/householder/prepare-appeal/own-some-land');
			ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
		}
		//Will an inspector need to access your land or property?		

		cy.validateURL('/appeals/householder/prepare-appeal/inspector-need-access');
		inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

		//Health and safety issues

		cy.validateURL('/appeals/householder/prepare-appeal/health-safety-issues');
		healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

		//What is the application reference number?

		cy.validateURL('/appeals/householder/prepare-appeal/reference-number');
		cy.get(prepareAppealSelector?._selectors?.applicationReference).invoke('val').then((inputValue) => {
			expect(inputValue).to.equal(applicationNumber);
		});

		cy.advanceToNextPage();
		//What date did you submit your application?

		cy.validateURL('/appeals/householder/prepare-appeal/application-date');
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(currentDate.getDate() - 1);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(currentDate.getMonth() - 1);
		cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(currentDate.getFullYear());
		cy.advanceToNextPage();
		//Enter the description of development that you submitted in your application

		cy.validateURL('/appeals/householder/prepare-appeal/enter-description-of-development');
		cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
		cy.advanceToNextPage();
		//Did the local planning authority change the description of development?

		cy.validateURL('/appeals/householder/prepare-appeal/description-development-correct');
		if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
			cy.getByData(basePage?._selectors.answerYes).click();
			cy.advanceToNextPage();
		} else {
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
		}

		cy.validateURL('/appeals/householder/prepare-appeal/other-appeals');
		otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

		cy.uploadDocuments('householder', 'upload-application-form', dynamicId);
		uploadApplicationFormPage.addUploadApplicationFormData(context, dynamicId);

		//Upload your appeal statement		
		cy.validateURL('/appeals/householder/upload-documents/upload-appeal-statement');

		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
		cy.advanceToNextPage();
		//Do you need to apply for an award of appeal costs?
		applyAppealCostsPage.addApplyAppealCostsData(context);

		//submit
		cy.get(`a[href*="/appeals/householder/submit/declaration?id=${dynamicId}"]`).click();
		cy.wait(2000);
		//Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
		cy.containsMessage(basePage?._selectors.govukButton,prepareAppealData?.acceptAndSubmitButton).click();

		cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {		
			expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
		});
	});
};
