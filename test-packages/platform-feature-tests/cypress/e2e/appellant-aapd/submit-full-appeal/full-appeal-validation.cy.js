// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../page-objects/base-page";
import { fullAppealRefusedTestCases } from "../../../helpers/appellantAAPD/fullAppeal/fullAppealRefusedData";
import { DateService } from "../../../utils/dateService";
const { ContactDetailsPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/ownSomeLandPage");
const { InspectorNeedAccessPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { HealthSafetyIssuesPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { OtherAppealsPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { PrepareAppealSelector } = require("../../../page-objects/prepare-appeal/prepare-appeal-selector");
const applicationFormPage = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { DecideAppealsPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { AgriculturalHoldingPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/agriculturalHoldingPage");
const { MajorMinorDevelopmentPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/majorMinorDevelopmentPage");
const { ApplicationAboutPage } = require("../../../support/flows/pages/appellant-aapd/prepare-appeal/applicationAboutPage");


describe('Full Appeal Validations for enforcement', () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();    

    beforeEach(() => {       
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get(basePage?._selectors?.localPlanningDepartment).type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil).get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
        cy.advanceToNextPage();        
    })

    it(`Validate error message when user tries to navigate next page without selecting mandatory fields for enforecement`, () => {
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you have received an enforcement notice');

    });
    it(`Validate Back button when user tries to navigate previous page from enforcement page`, () => {
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you have received an enforcement notice');

        basePage.backBtn();
        cy.containsMessage(prepareAppealSelector?._selectors?.govukLabelGovUkLabel1, "Which local planning authority (LPA) do you want to appeal against?");
    });
    it(`Validate exiting service page and button when user tries to use exiting appeals case work portal`, () => {
        cy.getByData(basePage._selectors?.answerYes).click();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage._selectors?.govukHeadingOne, 'You need to use the existing service');
        cy.containsMessage(basePage._selectors?.govukButton, 'Continue to the Appeals Casework Portal');
    });    
});
describe('Full Appeal Validations', () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    const contactDetailsPage = new ContactDetailsPage();
    const appealSiteAddressPage = new AppealSiteAddressPage();
    const siteAreaPage = new SiteAreaPage();
    const greenBeltPage = new GreenBeltPage();
    const ownAllLandPage = new OwnAllLandPage();
    const ownSomeLandPage = new OwnSomeLandPage();
    const inspectorNeedAccessPage = new InspectorNeedAccessPage();
    const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
    const majorMinorDevelopmentPage =  new MajorMinorDevelopmentPage();
	const applicationAboutPage =  new ApplicationAboutPage();
    const otherAppealsPage = new OtherAppealsPage();
    const context = fullAppealRefusedTestCases[0];
    const decideAppealsPage = new DecideAppealsPage();
    const agriculturalHoldingPage = new AgriculturalHoldingPage();

    let prepareAppealData;
    const date = new DateService();

    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get(basePage?._selectors?.localPlanningDepartment).type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil).get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors.answerNo).click();
	    cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerFullAppeal).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerRefused).click();
        cy.advanceToNextPage();

        cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateDay).type(date.today());
        cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._fullAppealselectors?.decisionDateYear).type(date.currentYear());
        cy.advanceToNextPage();
    })    

    it(`Validate emails address with correct email format`, () => {
        cy.advanceToNextPage(prepareAppealData?.button);        
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type('abcdtestemail');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter an email address in the correct format, like name@example.com');
    });

    it(`Validate correct email code received `, () => {
        cy.advanceToNextPage(prepareAppealData?.button);        
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'Your email address is confirmed');
    });

    it(`Validate error message when incorrect email code received `, () => {
        cy.advanceToNextPage(prepareAppealData?.button);  
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type('@12345');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter the code we sent to your email address');
    });

    it(`Validate change URL for application name in task link page `, () => {
        const applicationNamePage = new ApplicationNamePage();
        cy.advanceToNextPage(prepareAppealData?.button);
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();

        cy.location('search').then((search) => {
            const params = new URLSearchParams(search);
            const dynamicId = params.get('id');
            applicationFormPage(prepareAppealSelector?._selectors?.fullPlanningApplicaitonType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

            applicationNamePage.addApplicationNameData(false, prepareAppealData);
            cy.get(basePage._selectors?.govukLink).click({ multiple: true, force: true });
            cy.get(`a[href*="/appeals/full-planning/prepare-appeal/application-name?id=${dynamicId}"]`).contains('Change')
        });
    });

    it(`Validate data entered while adding the prepare appeal form `, () => {
        const applicationNamePage = new ApplicationNamePage();
        cy.advanceToNextPage(prepareAppealData?.button);       
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();

        cy.location('search').then((search) => {
            const params = new URLSearchParams(search);
            const dynamicId = params.get('id');
            applicationFormPage(prepareAppealSelector?._selectors?.fullPlanningApplicaitonType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

            applicationNamePage.addApplicationNameData(context.applicationForm?.isAppellant, prepareAppealData);
            contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.fullPlanningApplicaitonType, prepareAppealData);
            //Site Details
            appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);
            //What is the area of the appeal site?
            siteAreaPage.addSiteAreaData(context?.typeOfDecisionRequested, context?.applicationForm?.areaUnits, context, prepareAppealData);

            //Is the appeal site in a green belt?(Ans:Yes)
            greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

            //Do you own all the land involved in the appeal?
            ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

            if (!context?.applicationForm?.isOwnsAllLand) {
                //Do you own some of the land involved in the appeal?
                ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
                //cy.advanceToNextPage();			
            }
            agriculturalHoldingPage.addAgriculturalHoldingData(context?.applicationForm?.isAgriculturalHolding, context);

            inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);
            //Health and safety issues
            healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);
            //What is the application reference number?
            const applicationNumber = `TEST-${Date.now()}`;
            cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
            cy.advanceToNextPage();
            //What date did you submit your application?

            cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
            cy.advanceToNextPage();
            //Was your application for a major or minor development?
            majorMinorDevelopmentPage.addMajorMionorDevelopmentData(context?.applicationForm?.majorMionorDevelopmentData);
            //Was your application about any of the following?
            applicationAboutPage.addApplicationAboutData(context?.applicationForm?.applicationAboutData);
            cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
            //Enter the description of development that you submitted in your application
            cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
            cy.advanceToNextPage();
            //Did the local planning authority change the description of development?
            //cy.get('#updateDevelopmentDescription').click();
            if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
            } else {
                cy.getByData(basePage?._selectors.answerNo).click();
                cy.advanceToNextPage();
            }

            //How would you prefer us to decide your appeal?		
            decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);
            otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);
            cy.containsMessage(basePage._selectors?.govukSummaryListKey, 'Was the application made in your name?').next('.govuk-summary-list__value').contains(`${context.applicationForm?.isAppellant === true ? 'Yes' : 'No'}`);
            cy.containsMessage(basePage._selectors?.govukSummaryListKey, 'Contact details').next('.govuk-summary-list__value').contains(`${prepareAppealData?.contactDetails?.firstName} ${prepareAppealData?.contactDetails?.lastName}`);
        });
    });
});