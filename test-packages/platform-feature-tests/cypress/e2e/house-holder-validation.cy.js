import { BasePage } from "../page-objects/base-page";
import { houseHolderAppealRefusedTestCases } from "../helpers/houseHolderAppeal/houseHolderAppealRefusedData";
const { ContactDetailsPage } = require("../support/flows/pages/prepare-appeal/contactDetailsPage");
const { AppealSiteAddressPage } = require("../support/flows/pages/prepare-appeal/appealSiteAddressPage");
const { SiteAreaPage } = require("../support/flows/pages/prepare-appeal/siteAreaPage");
const { GreenBeltPage } = require("../support/flows/pages/prepare-appeal/greenBeltPage");
const { OwnAllLandPage } = require("../support/flows/pages/prepare-appeal/ownAllLandPage");
const { OwnSomeLandPage } = require("../support/flows/pages/prepare-appeal/ownSomeLandPage");
const { InspectorNeedAccessPage } = require("../support/flows/pages/prepare-appeal/inspectorNeedAccessPage");
const { HealthSafetyIssuesPage } = require("../support/flows/pages/prepare-appeal/healthSafetyIssuesPage");
const { OtherAppealsPage } = require("../support/flows/pages/prepare-appeal/otherAppealsPage");
const { PrepareAppealSelector } = require("../page-objects/prepare-appeal/prepare-appeal-selector");
const applicationFormPage = require("../support/flows/pages/prepare-appeal/applicationFormPage");
const { ApplicationNamePage } = require("../support/flows/pages/prepare-appeal/applicationNamePage");

describe('House Holder Date Validations', () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    let prepareAppealData;


    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        cy.get(basePage?._selectors?.localPlanningDepartment)
            .type('System Test Borough Council')
            .get(basePage?._selectors?.localPlanningDepartmentOptionZero)
            .click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerHouseholderPlanning).click();       
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerListedBuilding).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerRefused).click();
        cy.advanceToNextPage();

    })

    it(`Validate future date error message  in decision date page for future year`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear() + 1);
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');        
    });

    it(`Validate future date error message  in decision date page future month`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 2);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page future day`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();

         cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page negative date`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(-1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'The Decision Date must be a real date');
    });

    it(`Validate future date error message  in decision date page past year`, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear() - 1);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'You cannot appeal.');
        cy.containsMessage(basePage?._selectors?.govukBody,'Your deadline to appeal has passed.');
    });

    it(`Validate can use service page data `, () => {
        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors.answerNo).click();
        cy.advanceToNextPage();

        let monthNames = ["January", "February", "March","April","May", "June", "July","August","September", "October", "November", "December"];        
        
        cy.getByData(basePage?._selectors.localPlanningDepartment).should('have.text', 'System Test Borough Council');
        cy.getByData(basePage?._selectors.applicationType).should('have.text', prepareAppealSelector?._selectors?.householderPlanningText);
        cy.getByData(basePage?._selectors.listedBuilding).should('have.text', 'No');
        cy.getByData(basePage?._selectors.applicaitonDecision).should('have.text', 'Refused');
        cy.getByData(basePage?._selectors.decisionDate).should('have.text', `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
        cy.getByData(basePage?._selectors.enforcementNotice).should('have.text', 'No');
    });
});

describe('House Holder Validations', () => {
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
    const otherAppealsPage = new OtherAppealsPage();
    const context = houseHolderAppealRefusedTestCases[0];

    let prepareAppealData;

    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();
        cy.get(basePage?._selectors?.localPlanningDepartment)
            .type('System Test Borough Council')
            .get(basePage?._selectors?.localPlanningDepartmentOptionZero)
            .click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerHouseholderPlanning).click();       
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerListedBuilding).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerRefused).click();
        cy.advanceToNextPage();

        let currentDate = new Date();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(currentDate.getDate());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(currentDate.getMonth() + 1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentDate.getFullYear());
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
        cy.containsMessage(prepareAppealSelector?._selectors?.govukFieldsetHeading, "What’s the date on the decision letter from the local planning authority?");
    });
    it(`Validate exiting service page and button when user tries to use exiting appeals case work portal`, () => {
        cy.getByData(basePage._selectors?.answerYes).click();
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'You need to use the existing service');      
        cy.containsMessage(basePage._selectors?.govukButton,'Continue to the Appeals Casework Portal');
    });

    it(`Validate emails address with correct email format`, () => {
        cy.getByData(basePage._selectors?.answerNo).click();
        cy.advanceToNextPage();
        cy.advanceToNextPage(prepareAppealData?.button);
        const applicationNumber = `TEST-${Date.now()}`;
        cy.getByData(prepareAppealSelector._selectors?.applicationNumber).type(applicationNumber);
        cy.advanceToNextPage();
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type('abcdtestemail');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter an email address in the correct format, like name@example.com');       
    });

    it(`Validate correct email code received `, () => {
        cy.getByData(basePage._selectors?.answerNo).click();
        cy.advanceToNextPage();
        cy.advanceToNextPage(prepareAppealData?.button);
        const applicationNumber = `TEST-${Date.now()}`;
        cy.getByData(prepareAppealSelector._selectors?.applicationNumber).type(applicationNumber);
        cy.advanceToNextPage();
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'Your email address is confirmed');      
    });

    it(`Validate error message when incorrect email code received `, () => {
        cy.getByData(basePage._selectors?.answerNo).click();
        cy.advanceToNextPage();
        cy.advanceToNextPage(prepareAppealData?.button);
        const applicationNumber = `TEST-${Date.now()}`;
        cy.getByData(prepareAppealSelector._selectors?.applicationNumber).type(applicationNumber);
        cy.advanceToNextPage();
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type('@12345');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter the correct code');
    });

    it(`Validate change URL for application name in task link page `, () => {
        const applicationNamePage = new ApplicationNamePage();
        cy.getByData(basePage._selectors?.answerNo).click();
        cy.advanceToNextPage();
        cy.advanceToNextPage(prepareAppealData?.button);
        const applicationNumber = `TEST-${Date.now()}`;
        cy.getByData(prepareAppealSelector._selectors?.applicationNumber).type(applicationNumber);
        cy.advanceToNextPage();
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();

        cy.location('search').then((search) => {
            const params = new URLSearchParams(search);
            const dynamicId = params.get('id');
            applicationFormPage(prepareAppealSelector?._selectors?.houseHolderApplicaitonType, prepareAppealSelector?._selectors?.appellantOther, dynamicId);

            applicationNamePage.addApplicationNameData(false,prepareAppealData);
            cy.get(basePage._selectors?.govukLink).click( {multiple: true, force: true} );
            cy.get(`a[href*="/appeals/householder/prepare-appeal/application-name?id=${dynamicId}"]`).contains('Change')
        });
    });

    it(`Validate data entered while adding the prepare appeal form `, () => {
        const applicationNamePage = new ApplicationNamePage();
        cy.getByData(basePage._selectors?.answerNo).click();
        cy.advanceToNextPage();
        cy.advanceToNextPage(prepareAppealData?.button);
        const applicationNumber = `TEST-${Date.now()}`;
        cy.getByData(prepareAppealSelector._selectors?.applicationNumber).type(applicationNumber);
        cy.advanceToNextPage();
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();

        cy.location('search').then((search) => {
            const params = new URLSearchParams(search);
            const dynamicId = params.get('id');
            applicationFormPage(prepareAppealSelector?._selectors?.houseHolderApplicaitonType,prepareAppealSelector?._selectors?.appellantOther, dynamicId);

            applicationNamePage.addApplicationNameData(context.applicationForm?.isAppellant, prepareAppealData);
            contactDetailsPage.addContactDetailsData(context,prepareAppealSelector?._selectors?.houseHolderApplicaitonType,prepareAppealData);
            appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);
            siteAreaPage.addSiteAreaData(context?.typeOfPlanningApplication, context?.applicationForm?.areaUnits, context, prepareAppealData);
            greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);
            ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

            if (!context?.applicationForm?.isOwnsAllLand) {
                ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
            }
            inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess,prepareAppealData);

            healthSafetyIssuesPage.addHealthSafetyIssuesData(context,prepareAppealData);
            cy.advanceToNextPage();

            const currentDate = new Date();
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(currentDate.getDate());
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(currentDate.getMonth() - 1);
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(currentDate.getFullYear());
            cy.advanceToNextPage();

            cy.get(prepareAppealSelector?._selectors?.developmentDescriptionOriginal).type('developmentDescriptionOriginal-hint123456789!£$%&*j');
            cy.advanceToNextPage();

            if (context?.applicationForm?.iaUpdateDevelopmentDescription) {
                cy.getByData(basePage._selectors?.answerYes).click();
                cy.advanceToNextPage();
            } else {
                cy.getByData(basePage._selectors?.answerNo).click();
                cy.advanceToNextPage();
            }

            otherAppealsPage.addOtherAppealsData(context?.applicationForm?.anyOtherAppeals, context);

            cy.containsMessage(basePage._selectors?.govukSummaryListKey,'Was the application made in your name?').next('.govuk-summary-list__value').contains(`${context.applicationForm?.isAppellant === true ? 'Yes':'No'}`);
            cy.containsMessage(basePage._selectors?.govukSummaryListKey,'Contact details').next('.govuk-summary-list__value').contains(`${prepareAppealData?.contactDetails?.firstName} ${prepareAppealData?.contactDetails?.lastName}`);        });
     });
});

describe('Returns to pre appels validations', () => {
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
    const otherAppealsPage = new OtherAppealsPage();
    const context = houseHolderAppealRefusedTestCases[0];

    let prepareAppealData;


    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/new-saved-appeal`);
        cy.get('#new-or-saved-appeal-2').click();
        cy.advanceToNextPage();       
    })   

    it(`Validate Save and come back later for return to appeal `, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();       
        cy.containsMessage('.govuk-link--no-visited-state','Save and come back later');  
        cy.get('.govuk-link--no-visited-state').click();
        cy.containsMessage('.govuk-heading-l','Your appeals');
    });

    it(`Validate Continue without uploading documents`, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();
        cy.get('a[href*="upload-documents"]').first().click();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]','Select your application form');        
    });

    it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();
        cy.get('a[href*="upload-documents"]').first().click();
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan25mb);
        cy.advanceToNextPage();       
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]',`${context?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);        
    });

    it(`Validate multiple uploading documents`, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();
        cy.get('a[href*="upload-documents"]').first().click();
        const expectedFileNames = [context?.documents?.uploadDevelopmentDescription, context?.documents?.uploadFinalisingDocDraft];
        expectedFileNames.forEach((fileName,index)=>{
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName,index)=>{
          cy.get('.moj-multi-file-upload__filename')         
            .eq(index)
            .should('contain.text',fileName);
        });              
    });
    
    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();
        cy.get('a[href*="upload-documents"]').first().click();
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();       
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]',`${context?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);        
    });   
    it(`Validate user should be allowed to remove uploaded files`, () => {
        cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear().type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();
        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();
        cy.get('a[href*="continue"]').first().click();
        cy.get('a[href*="upload-documents"]').first().click();
        const expectedFileNames = [context?.documents?.uploadDevelopmentDescription, context?.documents?.uploadFinalisingDocDraft];
        expectedFileNames.forEach((fileName,index)=>{
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName,index)=>{
          cy.get('.moj-multi-file-upload__filename')         
            .eq(index)
            .should('contain.text',fileName);
        });   
        expectedFileNames.forEach((fileName,index)=>{
            cy.get('.moj-multi-file-upload__delete')         
              .eq(0)
              .click()
          });
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]','Select your application form'); 
    });  
});