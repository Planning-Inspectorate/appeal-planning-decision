// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { appealsE2EIntegration } from "../appealsE2EIntegration";

const applicationFormPage = require("../../pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { DecideAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { OtherNewDocumentsPage } = require("../../pages/appellant-aapd/upload-documents/otherNewDocumentsPage");

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

    // Visit the "Before You Start" page
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
    cy.advanceToNextPage();

    // Select the local planning authority
    cy.get(basePage?._selectors?.localPlanningDepartment).type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil);
    cy.get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
    cy.advanceToNextPage();

    // Have you received an enforcement notice? -> Yes
    cy.getByData(basePage?._selectors.answerYes).click();
    cy.advanceToNextPage();

    // Is your enforcement notice about a listed building?
    if (context?.isListedBuilding) {
        cy.getByData(basePage?._selectors.answerYes).click();
    } else {
        cy.getByData(basePage?._selectors.answerNo).click();
    }
    cy.advanceToNextPage();

    // What is the issue date on your enforcement notice?
    cy.get('#enforcement-notice-issue-date-day').type(context?.enforcementNotice?.issueDate?.day);
    cy.get('#enforcement-notice-issue-date-month').type(context?.enforcementNotice?.issueDate?.month);
    cy.get('#enforcement-notice-issue-date-year').type(context?.enforcementNotice?.issueDate?.year);
    cy.advanceToNextPage();

    // What is the effective date on your enforcement notice?
    cy.get('#enforcement-notice-effective-date-day').type(context?.enforcementNotice?.effectiveDate?.day);
    cy.get('#enforcement-notice-effective-date-month').type(context?.enforcementNotice?.effectiveDate?.month);
    cy.get('#enforcement-notice-effective-date-year').type(context?.enforcementNotice?.effectiveDate?.year);
    cy.advanceToNextPage();

    // You can appeal using this service -> Start Appeal
    cy.advanceToNextPage(prepareAppealData?.button);

    // What is the reference number on the enforcement notice?
    cy.get(prepareAppealSelector?._selectors?.applicationReference).type(context?.enforcementNotice?.referenceNumber);
    cy.advanceToNextPage();

    // What is your email address?
    cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
    cy.advanceToNextPage();

    // Enter the code we sent to your email address
    cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
    cy.advanceToNextPage();

    // Email address confirmed
    cy.advanceToNextPage();

    // Before you start (appeal form)
    cy.advanceToNextPage();

    cy.location('search').then((search) => {
        const params = new URLSearchParams(search);
        const dynamicId = params.get('id');

        // Your appeal (application form page)
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementAppealForm}/your-appeal`);
        applicationFormPage(prepareAppealSelector?._selectors?.enforcementApplicationType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

        // 1. Who is appealing against the enforcement notice?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/who-is-appealing`);
        if (context?.applicationForm?.appellantType === 'organisation') {
            cy.getByData('answer-organisation').click();
        } else if (context?.applicationForm?.appellantType === 'additional-appellants') {
            cy.getByData('answer-additional-appellants').click();
        } else {
            cy.getByData('answer-individual').click();
        }

        cy.advanceToNextPage();

        // What is the name of the individual appealing against the enforcement notice?
        if (context?.applicationForm?.appellantType === 'individual' || !context?.applicationForm?.appellantType) {
            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/appellant-name`);
            cy.get('#firstName').type(prepareAppealData?.appellant?.firstName ?? 'Test first name');
            cy.get('#lastName').type(prepareAppealData?.appellant?.lastName ?? 'Test Last name');
            cy.advanceToNextPage();

            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/are-you-appellant`);
            if (context?.applicationForm?.isAppellant) {
                // Yes - I am the appellant
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();

                // What is your phone number?
                cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/phone-number`);
                cy.get('#contactPhoneNumber').type(prepareAppealData?.appellant?.phoneNumber ?? '01234567890');
                cy.advanceToNextPage();

                // TODO: need to complete here

            } else {
                // No - I am appealing on behalf of the appellant
                cy.getByData(basePage?._selectors.answerNo).click();
                cy.advanceToNextPage();
            }
        }

        // Contact details
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/contact-details`);
        contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.enforcementApplicationType, prepareAppealData);

        // What is your phone number? (handled within contactDetailsPage)

        // Complete the appeal on behalf of [appellant name] - informational page, just continue
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/complete-appeal`);
        cy.advanceToNextPage();

        // What is the address of the appeal site?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/appeal-site-address`);
        appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);

        // Is the appeal site address your contact address?
        // If Yes -> What is [appellant name]'s interest in the land?
        if (context?.applicationForm?.isSiteAddressContactAddress) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();

            cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/interest-in-land`);
            if (context?.applicationForm?.interestInLand === 'other') {
                cy.getByData('answer-other').click();
                cy.get('#interestInAppealLand_interestInAppealLandDetails').type(
                    prepareAppealData?.interestInLandDetails ?? 'Other interest in land details'
                );
            } else if (context?.applicationForm?.interestInLand === 'tenant') {
                cy.getByData('answer-tenant').click();
            } else if (context?.applicationForm?.interestInLand === 'mortgageLender') {
                cy.getByData('answer-mortgageLender').click();
            } else {
                // Default: Owner
                cy.getByData('answer-owner').click();
            }
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }

        // Will an inspector need to access the land or property?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/inspector-need-access`);
        inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

        // Are there any health and safety issues on the appeal site?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/health-safety-issues`);
        healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

        // Enter the description of the alleged breach
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/description-alleged-breach`);
        cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
        cy.advanceToNextPage();

        // Choose your grounds of appeal
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/choose-grounds`);
        const grounds = context?.applicationForm?.groundsOfAppeal ?? ['a', 'b'];
        grounds.forEach((ground) => {
            cy.getByData(`answer-${ground}`).click();
        });
        cy.advanceToNextPage();

       // Facts for individual grounds (only shown if that ground was selected)
		const allGrounds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
		const selectedGrounds = context?.applicationForm?.groundsOfAppeal ?? [];

		allGrounds.forEach((ground) => {
			if (selectedGrounds.includes(ground)) {
				// Facts textarea for this ground
				cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/facts-ground-${ground}`);
				cy.get(`#facts-${ground}`).type(prepareAppealData?.groundsFacts?.[ground] ?? `Facts for ground ${ground} test text`);
				cy.advanceToNextPage();

				// Do you have any documents to support your ground ([x]) facts?
				cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/facts-ground-${ground}-supporting-documents`);
				if (context?.applicationForm?.groundsSupportingDocuments?.[ground]) {
					cy.getByData('answer-yes').click();
					cy.advanceToNextPage();
					cy.uploadFileFromFixtureDirectory(context?.documents?.["uploadGroundSupportingDoc_" + ground] ?? context?.documents?.uploadOtherNewSupportDoc);
				} else {
					cy.getByData('answer-no').click();
				}
				cy.advanceToNextPage();
			}
		});
        // How would you prefer us to decide your appeal?
        decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);

        // Are there other appeals linked to your development?
        cy.validateURL(`${prepareAppealSelector?._enforcementAppealURLs?.appealsEnforcementPrepareAppeal}/other-appeals`);
        otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

        // 2. Upload documents

        // Enforcement notice
        cy.uploadDocuments(prepareAppealSelector?._selectors?.enforcementApplicationType, prepareAppealSelector?._selectors?.uploadEnforcementNotice, dynamicId);
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnforcementNotice);
        cy.advanceToNextPage();

        // Enforcement notice plan
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadEnforcementNoticePlan);
        cy.advanceToNextPage();

        // Do you want to apply for an award of appeal costs?
        applyAppealCostsPage.addApplyAppealCostsData(context);

        // Do you have any other new documents that support your appeal?
        otherNewDocumentsPage.addOtherNewDocumentsData(context);

        // Submit
        cy.get(`a[href*="/appeals/enforcement/submit/declaration?id=${dynamicId}"]`).click();
        cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();

        cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should((text) => {
            expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
        });
    });

    if (context?.endToEndIntegration) {
        appealsE2EIntegration(context, 'Enforcement appeal', null, [], []);
    }
};