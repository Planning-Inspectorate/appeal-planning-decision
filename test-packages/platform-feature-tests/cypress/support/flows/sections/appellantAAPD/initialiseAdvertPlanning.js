// @ts-nocheck
/// <reference types="cypress"/>
// Initialise flow for Advert appeals (minor commercial development – advertised)
// Mirrors initialiseCasPlanning with any advert‑specific divergence kept isolated here.
import { BasePage } from "../../../../page-objects/base-page";
import { DateService } from "../../../../utils/dateService";
import { appealIdWaitingForReview } from "./../appealIdWaitingForReview";
import { ipCommentsForAppealRef } from "./../ipComments/ipComments";
import { questionnaire } from "./../lpaManageAppeals/questionnaire";
import { statementForCaseRef } from "./../lpaManageAppeals/statement";
import { viewValidatedAppealDetailsLPA } from "./../lpaManageAppeals/viewValidatedAppealDetailsLPA";
import { appealsApiClient} from "./../../../../support/appealsApiClient";
import { appealsE2EIntegration } from "../appealsE2EIntegration";
const applicationFormPage = require("../../pages/appellant-aapd/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../../pages/appellant-aapd/prepare-appeal/applicationNamePage");
const { ContactDetailsPage } = require("../../pages/appellant-aapd/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../../pages/appellant-aapd/prepare-appeal/appealSiteAddressPage");
const { HighwayLandPage } = require("../../pages/appellant-aapd/prepare-appeal/highwayLandPage");
const { AdvertisementPositionPage } = require("../../pages/appellant-aapd/prepare-appeal/advertisementPositionPage");
const { SiteAreaPage } = require("../../pages/appellant-aapd/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../../pages/appellant-aapd/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../../pages/appellant-aapd/prepare-appeal/ownSomeLandPage");
const { LandownerPermissionPage } = require("../../pages/appellant-aapd/prepare-appeal/landownerPermissionPage");
const { InspectorNeedAccessPage } = require("../../pages/appellant-aapd/prepare-appeal/inspectorNeedAccessPage");
const { DecideAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/decideAppealsPage");
const { AnySignificantChangesPage } = require("../../pages/appellant-aapd/prepare-appeal/anySignificantChangesPage");
const { OtherAppealsPage } = require("../../pages/appellant-aapd/prepare-appeal/otherAppealsPage");
const { UploadApplicationFormPage } = require("../../pages/appellant-aapd/upload-documents/uploadApplicationFormPage");
const { ApplyAppealCostsPage } = require("../../pages/appellant-aapd/upload-documents/applyAppealCostsPage");
const { HealthSafetyIssuesPage } = require("../../pages/appellant-aapd/prepare-appeal/healthSafetyIssuesPage");
const { PrepareAppealSelector } = require("../../../../page-objects/prepare-appeal/prepare-appeal-selector");
const { NewPlansDrawingsPage } = require("../../pages/appellant-aapd/upload-documents/newPlansDrawingsPage");
module.exports = (planning, grantedOrRefusedId, applicationType, expeditedAppeal, context, prepareAppealData, lpaManageAppealsData, questionnaireTestCases = [], statementTestCases = []) => {
    const basePage = new BasePage();
    const prepareAppealSelector = new PrepareAppealSelector();
    const applicationNamePage = new ApplicationNamePage();
    const contactDetailsPage = new ContactDetailsPage();
    const appealSiteAddressPage = new AppealSiteAddressPage();
    const highwayLandPage = new HighwayLandPage();
    const advertisementPositionPage = new AdvertisementPositionPage();
    const siteAreaPage = new SiteAreaPage();
    const greenBeltPage = new GreenBeltPage();
    const ownAllLandPage = new OwnAllLandPage();
    const ownSomeLandPage = new OwnSomeLandPage();
    const landownerPermissionPage = new LandownerPermissionPage();
    const inspectorNeedAccessPage = new InspectorNeedAccessPage();
    const healthSafetyIssuesPage = new HealthSafetyIssuesPage();
    const anySignificantChangesPage = new AnySignificantChangesPage();
    const otherAppealsPage = new OtherAppealsPage();
    const decideAppealsPage = new DecideAppealsPage();
    const uploadApplicationFormPage = new UploadApplicationFormPage();
    const applyAppealCostsPage = new ApplyAppealCostsPage();
    const newPlansDrawingsPage = new NewPlansDrawingsPage();
    const date = new DateService();
    const applicationDateValues = expeditedAppeal
        ? { day: date.today(), month: date.currentMonth(), year: date.currentYear() }
        : { day: 1, month: 3, year: 2026 };

    cy.getByData(grantedOrRefusedId).click();
    cy.advanceToNextPage();

    // Wait for the first date page returned by the server.
    cy.url().should('match', /application-date|decision-date|date-decision-due/).then((url) => {
        if (url.includes('/application-date')) {
            cy.validateURL(`${prepareAppealSelector?._advertURLs?.beforeYouStart}/application-date`);
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.applicationDateDay, String(applicationDateValues.day));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.applicationDateMonth, String(applicationDateValues.month));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.applicationDateYear, String(applicationDateValues.year));
            cy.advanceToNextPage();

            cy.url().should('match', /decision-date|date-decision-due/).then((nextUrl) => {
                if (nextUrl.includes('/decision-date')) {
                    cy.validateURL(`${prepareAppealSelector?._advertURLs?.beforeYouStart}/decision-date`);
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateDay, String(date.today()));
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateMonth, String(date.currentMonth()));
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateYear, String(date.currentYear()));
                    cy.advanceToNextPage();
                } else if (nextUrl.includes('/date-decision-due')) {
                    cy.validateURL(`${prepareAppealSelector?._advertURLs?.beforeYouStart}/date-decision-due`);
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateDay, String(date.today()));
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateMonth, String(date.currentMonth()));
                    cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateYear, String(date.currentYear()));
                    cy.advanceToNextPage();
                }
            });
        }

        if (url.includes('/decision-date')) {
            cy.validateURL(`${prepareAppealSelector?._advertURLs?.beforeYouStart}/decision-date`);
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateDay, String(date.today()));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateMonth, String(date.currentMonth()));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateYear, String(date.currentYear()));
            cy.advanceToNextPage();
        } else if (url.includes('/date-decision-due')) {
            cy.validateURL(`${prepareAppealSelector?._advertURLs?.beforeYouStart}/date-decision-due`);
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateDay, String(date.today()));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateMonth, String(date.currentMonth()));
            cy.typeWhenEnabled(prepareAppealSelector?._advertSelectors?.decisionDateYear, String(date.currentYear()));
            cy.advanceToNextPage();
        }
    });

    cy.url().should('include', '/can-use-service');

    cy.getByData(basePage?._selectors.applicationType).should('have.text', prepareAppealSelector?._selectors?.advertText);
    cy.advanceToNextPage(prepareAppealData?.button);

    cy.validateURL(`${prepareAppealSelector?._advertURLs?.advert}/email-address`);
    cy.getByData(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
    cy.advanceToNextPage();

    cy.validateURL(`${prepareAppealSelector?._advertURLs?.advert}/enter-code`);
    cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
    cy.advanceToNextPage();

    cy.validateURL(`${prepareAppealSelector?._advertURLs?.advert}/email-address-confirmed`);
    cy.advanceToNextPage();

    cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertAppealForm}/before-you-start`);
    cy.advanceToNextPage();

    cy.location('search').then((search) => {
        const params = new URLSearchParams(search);
        const dynamicId = params.get('id');
        if (grantedOrRefusedId === basePage._selectors?.answerNodecisionreceived || grantedOrRefusedId === basePage._selectors?.answerGranted) {
            cy.get(basePage?._selectors.govukCaption1).should('contain.text', prepareAppealSelector?._selectors?.advertisementAppealCaption);
        } else {
            cy.get(basePage?._selectors.govukCaption1).should('contain.text', prepareAppealSelector?._selectors?.commercialAdvertisementAppealCaption);
        }

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertAppealForm}/your-appeal`);
        applicationFormPage(prepareAppealSelector?._selectors?.advertApplicationType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/application-name`);
        applicationNamePage.addApplicationNameData(context?.applicationForm?.isAppellant, prepareAppealData);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/contact-details`);
        contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.advertApplicationType, prepareAppealData);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/appeal-site-address`);
        appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData, context);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/highway-land`);
        highwayLandPage.selectHighwayLand(context?.applicationForm?.isHighwayLand, context);
        //siteAreaPage.addSiteAreaData(planning, context?.applicationForm?.areaUnits, context, prepareAppealData);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/advertisement-position`);
        advertisementPositionPage.selectAdvertisementPosition(context?.applicationForm?.isAdvertisementPosition, context);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/green-belt`);
        greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/own-all-land`);
        ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);
        if (!context?.applicationForm?.isOwnsAllLand) {
            cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/own-some-land`);
            ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);

            if ((context?.applicationForm?.knowsOtherOwners === 'some' || context?.applicationForm?.knowsOtherOwners === 'yes') || (context?.applicationForm?.knowsAllOwners === 'some' || context?.applicationForm?.knowsAllOwners === 'yes')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/landowner-permission`);
                landownerPermissionPage.selectLandownerPermission(context?.applicationForm?.isLandownerPermission, context);
            }
        }

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/inspector-need-access`);
        inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/health-safety-issues`);
        healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/reference-number`);
        const applicationNumber = `ADVERT-${Date.now()}`;
        cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
        cy.advanceToNextPage();

        // Application date can be skipped by business rules; complete it only when shown.
        cy.url().then((url) => {
            if (url.includes('/application-date')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/application-date`);
                cy.typeWhenEnabled(prepareAppealSelector?._selectors?.onApplicationDateDay, String(applicationDateValues.day));
                cy.typeWhenEnabled(prepareAppealSelector?._selectors?.onApplicationDateMonth, String(applicationDateValues.month));
                cy.typeWhenEnabled(prepareAppealSelector?._selectors?.onApplicationDateYear, String(applicationDateValues.year));
                cy.advanceToNextPage();
            }
        });

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/description-advertisement`);
        cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type(prepareAppealData?.develpmentDescriptionOriginal);
        cy.advanceToNextPage();

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/description-advertisement-correct`);
        if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();

            // Upload evidence page is conditional; only handle when rendered.
            cy.url().then((url) => {
                if (url.includes('/upload-description-evidence')) {
                    cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/upload-description-evidence`);
                    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
                    cy.advanceToNextPage();
                }
            });
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }

        //How would you prefer us to decide your appeal?
        if (grantedOrRefusedId === basePage._selectors?.answerNodecisionreceived || grantedOrRefusedId === basePage._selectors?.answerGranted) {
            cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/decide-appeal`);
            decideAppealsPage.addDecideAppealsData(context?.applicationForm?.appellantProcedurePreference);
            cy.advanceToNextPage();
        }

        // Why are you appealing? (conditional page)
        cy.url().then((url) => {
            if (url.includes('/why-are-you-appealing')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/why-are-you-appealing`);
                cy.get(prepareAppealSelector?._selectors?.whyAreYouAppealing).type(prepareAppealData?.reasonWhyAreYouAppealing);
                cy.advanceToNextPage();
            }
        });

        // Have there been any significant changes that would affect the application? (conditional page)
        cy.url().then((url) => {
            if (url.includes('/any-significant-changes')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/any-significant-changes`);
                anySignificantChangesPage.selectSignificantChanges(context?.applicationForm?.anySignificantChangesCondition);
                cy.advanceToNextPage();
            }
        });

        // Upload evidence can also appear later in the flow after significant changes.
        cy.url().then((url) => {
            if (url.includes('/upload-description-evidence')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/upload-description-evidence`);
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
                cy.advanceToNextPage();
            }
        });

        cy.url().should('include', '/other-appeals');

        cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertPrepareAppeal}/other-appeals`);
        otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

        cy.uploadDocuments(prepareAppealSelector?._selectors?.advertApplicationType, prepareAppealSelector?._selectors?.uploadApplicationForm, dynamicId);
        uploadApplicationFormPage.addUploadApplicationFormData(context);

        // Decision letter: should appear only when a decision exists       
        if (grantedOrRefusedId === basePage._selectors?.answerGranted || grantedOrRefusedId === basePage._selectors?.answerRefused) {
            cy.url().then(url => {
                if (url.includes('/upload-decision-letter')) {
                    cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertUploadDocuments}/upload-decision-letter`);
                    cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDecisionLetter);
                    cy.advanceToNextPage();
                } else {
                    Cypress.log({ name: 'info', message: 'Decision letter page not rendered despite decision status; continuing.' });
                }
            });
        }
        cy.url().then(url => {
            if (url.includes('/upload-appeal-statement')) {
                cy.validateURL(`${prepareAppealSelector?._advertURLs?.appealsAdvertUploadDocuments}/upload-appeal-statement`);
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadAppealStmt);
                cy.advanceToNextPage();
            }
        });

        applyAppealCostsPage.addApplyAppealCostsData(context);

        // Upload plans/drawings when either legacy or current URL variant is rendered.
        cy.url().then((url) => {
            const isPlansUploadPage =
                url.includes('/upload-plans-drawings-and-supporting-documents') ||
                url.includes('/upload-plans-drawings-documents');

            if (isPlansUploadPage && context?.documents?.uploadPlansDrawingAndSupportingDocs) {
                cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlansDrawingAndSupportingDocs);
                cy.advanceToNextPage();
            }
        });

        // Ensure we've reached the task list before looking for declaration link.
        cy.url().then((url) => {
            if (!url.includes('/your-appeal')) {            
                cy.advanceToNextPage();
            }
        });

        cy.get(`a[href*="/appeals/adverts/submit/declaration?id=${dynamicId}"]`).click();
        cy.containsMessage(basePage?._selectors.govukButton, prepareAppealData?.acceptAndSubmitButton).click();
        cy.get(basePage?._selectors.govukPanelTitle).invoke('text').should(text => {
            expect(text.trim()).to.equal(prepareAppealData?.appealSubmitted);
        });
    });
    if (context?.endToEndIntegration){
        appealsE2EIntegration(context, applicationType, lpaManageAppealsData, questionnaireTestCases, statementTestCases);
    }    
};