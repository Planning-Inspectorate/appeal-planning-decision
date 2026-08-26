// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { appealsE2EIntegration } from "../appealsE2EIntegration";
import { DateService } from "../../../../utils/dateService";

const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { DecideAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { OtherNewDocumentsPage } = require("../../pages/appellant-aapd/upload-documents/otherNewDocumentsPage");
const { SubmitPlanningObligationPage } = require("../../pages/appellant-aapd/upload-documents/submitPlanningObligationPage");
const { WhoIsAppealingPage } = require("../../pages/appellant-aapd/prepare-appeal/whoIsAppealingPage");
const { InterestInLandPage } = require("../../pages/appellant-aapd/prepare-appeal/interestInLandPage");
const { ChooseGroundsPage } = require("../../pages/appellant-aapd/prepare-appeal/chooseGroundsPage");
const { GroundsFactsPage } = require("../../pages/appellant-aapd/prepare-appeal/groundsFactsPage");

module.exports = (planning, context, prepareAppealData) => {
    const basePage = new BasePage();
    const prepareAppealSelector = new PrepareAppealSelector();
    const applicationNamePage = new ApplicationNamePage();
    const contactDetailsPage = new ContactDetailsPage();
    const appealSiteAddressPage = new AppealSiteAddressPage();
    const inspectorNeedAccessPage = new InspectorNeedAccessPage();
    const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
    const decideAppealsPage = new DecideAppealsPage();
    const otherAppealsPage = new OtherAppealsPage();
    const applyAppealCostsPage = new ApplyAppealCostsPage();
    const otherNewDocumentsPage = new OtherNewDocumentsPage();
    const submitPlanningObligationPage = new SubmitPlanningObligationPage();
    const whoIsAppealingPage = new WhoIsAppealingPage();
    const interestInLandPage = new InterestInLandPage();
    const chooseGroundsPage = new ChooseGroundsPage();
    const groundsFactsPage = new GroundsFactsPage();
    const date = new DateService();

    //cy.pause();

    //  "Before You Start" page
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
    cy.advanceToNextPage();

    // Select the local planning authority
    cy.get(basePage?._selectors?.localPlanningDepartment).type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil);
    cy.get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
    cy.advanceToNextPage();

    // // Have you received an enforcement notice? -> Yes (Enforcement appeal)
    // cy.getByData(basePage?._selectors.answerYes).click();
    // cy.advanceToNextPage();
    // Select the application type
	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();
    // Is your enforcement notice about a listed building?
  //  if (context?.isListedBuilding) {
        //cy.getByData(basePage?._selectors.answerYes).click();

        // What is the issue date on your enforcement notice?
        // cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/before-you-start/contact-planning-inspectorate`);
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementIssueDateDay).type(context?.enforcementNotice?.issueDate?.day);
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementIssueDateMonth).type(context?.enforcementNotice?.issueDate?.month);
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementIssueDateYear).type(context?.enforcementNotice?.issueDate?.year);
        cy.advanceToNextPage();

        // What is the effective date on your enforcement notice? - future date -
        cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/before-you-start/enforcement-effective-date`);
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementEffectiveDateDay).type(date.futureDay());
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementEffectiveDateMonth).type(date.futureMonth());
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.enforcementEffectiveDateYear).type(date.futureYear());
        cy.advanceToNextPage();

        // // Did you contact the Planning Inspectorate to tell them you will appeal the enforcement notice?
        // cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/before-you-start/contact-planning-inspectorate`);
        // if (context?.enforcementNotice?.contactedPlanningInspectorate) {
        // 	cy.getByData(basePage?._selectors.answerYes).click();
        // 	cy.advanceToNextPage();

        // 	// When did you contact the Planning Inspectorate?
        // 	cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/before-you-start/contact-planning-inspectorate-date`);
        // 	cy.get(prepareAppealSelector?._enforcementAppealSelectors?.contactPlanningInspectorateDateDay).type(date.futureDay());
        // 	cy.get(prepareAppealSelector?._enforcementAppealSelectors?.contactPlanningInspectorateDateMonth).type(date.futureMonth());
        // 	cy.get(prepareAppealSelector?._enforcementAppealSelectors?.contactPlanningInspectorateDateYear).type(date.futureYear());
        // 	cy.advanceToNextPage();
        // } else {
        // 	cy.getByData(basePage?._selectors.answerNo).click();
        // 	cy.advanceToNextPage();
        // }

  //  } else {
  //      cy.getByData(basePage?._selectors.answerNo).click();
  //  }

    // You can appeal using this service -> Start Appeal
    cy.advanceToNextPage(prepareAppealData?.button);

    // What is the reference number on the enforcement notice?
    cy.getByData(prepareAppealSelector?._selectors?.referenceNumber).type(context?.enforcementNotice?.referenceNumber);
    cy.advanceToNextPage();

    // What is your email address?
    cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.enforcement}/email-address`);
    cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
    cy.advanceToNextPage();

    // Enter the code we sent to your email address
    cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.enforcement}/enter-code`);
    cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
    cy.advanceToNextPage();

    cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.enforcement}/email-address-confirmed`);
    cy.advanceToNextPage();

    // Before you start (appeal form)
    cy.advanceToNextPage();

    cy.location('search').then((search) => {
        const params = new URLSearchParams(search);
        const dynamicId = params.get('id');

        // Your appeal (application form page) - enforcement's first prepare-appeal task is "who-is-appealing", not "application-name"
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementAppealForm}/your-appeal`);
        cy.taskListComponent(prepareAppealSelector?._selectors?.enforcementApplicationType, 'who-is-appealing', dynamicId);

        // 1. Who is appealing against the enforcement notice?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/who-is-appealing`);
        const showContactDetailsAndCompleteOnBehalf = whoIsAppealingPage.addWhoIsAppealingData(context, prepareAppealData);

        if (showContactDetailsAndCompleteOnBehalf) {
            // Contact details
            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/contact-details`);
            contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.enforcementApplicationType, prepareAppealData);

            // What is your phone number? (handled within contactDetailsPage)

            // Complete the appeal on behalf of [appellant name] - informational page, just continue
            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/complete-appeal`);
            cy.advanceToNextPage();
        }

        // What is the address of the appeal site?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/appeal-site-address`);
        appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

        // Is the appeal site address your contact address? -> What is [appellant name]'s interest in the land?
        interestInLandPage.addInterestInLandData(context, prepareAppealData);

        // Will an inspector need to access the land or property?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/inspector-need-access`);
        inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

        // Are there any health and safety issues on the appeal site?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/health-safety-issues`);
        healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

        // Enter the description of the alleged breach
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/description-alleged-breach`);
        cy.get(prepareAppealSelector?._enforcementAppealSelectors?.allegedBreachDescription).type(prepareAppealData?.develpmentDescriptionOriginal);
        cy.advanceToNextPage();

        // Choose your grounds of appeal
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/choose-grounds`);
        const grounds = context?.applicationForm?.groundsOfAppeal ?? ['a', 'b'];
        chooseGroundsPage.addChooseGroundsData(grounds);

        // Facts for individual grounds (only shown if that ground was selected)
        groundsFactsPage.addGroundsFactsData(grounds, context, prepareAppealData);

        // How would you prefer us to decide your appeal?
        decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);

        // Are there other appeals linked to your development?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/other-appeals`);
        otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

        // 2. Upload documents

        // Enforcement notice
        cy.uploadDocuments(prepareAppealSelector?._selectors?.enforcementApplicationType, prepareAppealSelector?._enforcementAppealSelectors?.uploadEnforcementNoticeTask, dynamicId);
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnforcementNotice);
        cy.advanceToNextPage();

        // Enforcement notice plan
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnforcementNoticePlan);
        cy.advanceToNextPage();

        // Ground (a) only: do you plan to submit a planning obligation?
        if (grounds.includes('a')) {
            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementUploadDocuments}/submit-planning-obligation`);
            submitPlanningObligationPage.addSubmitPlanningObligationData(context);
        }

        // Do you want to apply for an award of appeal costs?
        applyAppealCostsPage.addApplyAppealCostsData(context);

        // Do you have any other new documents that support your appeal?
        otherNewDocumentsPage.addOtherNewDocumentsData(context);

        // Submit
        cy.get(`a[href*="${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementSubmitDeclaration}?id=${dynamicId}"]`).click();
        cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();

        cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
            expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
        });
    });

    if (context?.endToEndIntegration) {
        appealsE2EIntegration(context, 'Enforcement appeal', null, [], []);
    }
};