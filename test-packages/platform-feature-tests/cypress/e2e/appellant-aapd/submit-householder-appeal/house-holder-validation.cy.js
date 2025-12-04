// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../page-objects/base-page";
import { houseHolderAppealRefusedTestCases } from "../../../helpers/appellantAAPD/houseHolderAppeal/houseHolderAppealRefusedData";
import { DateService } from "../../../utils/dateService";
import { users } from "../../../fixtures/users.js";
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

describe('House Holder Date Validations',{ tags:'@HAS-validation-1' }, () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    const date = new DateService();
    let prepareAppealData;

    before(() => {
		cy.login(users.appeals.authUser);
	});
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();

        cy.get(basePage?._selectors?.localPlanningDepartment)
            .type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil)
            .get(basePage?._selectors?.localPlanningDepartmentOptionZero)
            .click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors.answerNo).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerHouseholderPlanning).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerRefused).click();
        cy.advanceToNextPage();
    })

    it(`Validate future date error message  in decision date page for future year`, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.nextYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page future month`, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.nextMonth());
        const currentYear = date.currentMonth() > date.nextMonth() ? date.nextYear() : date.currentYear();
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(currentYear);
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page future day`, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.nextDay());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.currentYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Decision date must be today or in the past');
    });

    it(`Validate future date error message  in decision date page negative date`, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(-1);
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.currentYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'The decision date must be a real date');
    });

    it(`Validate future date error message  in decision date page past year`, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.previousYear());
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'You cannot appeal');
        cy.containsMessage(basePage?._selectors?.govukBody, 'Your deadline to appeal has passed.');
    });

    it(`Validate can use service page data `, () => {
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.currentYear());
        cy.advanceToNextPage();

        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        cy.getByData(basePage?._selectors.localPlanningDpmt).should('have.text', prepareAppealSelector?._selectors?.systemTest2BoroughCouncil);
        cy.getByData(basePage?._selectors.enforcementNotice).should('have.text', 'No');
        cy.getByData(basePage?._selectors.applicationType).should('have.text', prepareAppealSelector?._selectors?.householderPlanningText);
        cy.getByData(basePage?._selectors.applicaitonDecision).should('have.text', 'Refused');
        cy.getByData(basePage?._selectors.decisionDate).should('have.text', `${date.today() > 9 ? date.today() : `0${date.today()}`} ${monthNames[date.currentMonth() - 1]} ${date.currentYear()}`);
    });
});

describe('House Holder Validations for enforcement',{ tags:'@HAS-validation-2' },() => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();

    let prepareAppealData;
    before(() => {
		cy.login(users.appeals.authUser);
	});
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();

        cy.get(basePage?._selectors?.localPlanningDepartment)
            .type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil)
            .get(basePage?._selectors?.localPlanningDepartmentOptionZero)
            .click();
        cy.advanceToNextPage();

    })

    it(`Validate error message when user tries to navigate next page without selecting mandatory fields for enforcement`, () => {
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

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'You need to use the existing service');
        cy.containsMessage(basePage._selectors?.govukButton, 'Continue to the Appeals Casework Portal');
    });
});


describe('House Holder Validations',{ tags:'@HAS-validation-3' }, () => {
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
    const date = new DateService();
    before(() => {
		cy.login(users.appeals.authUser);
	});
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
        cy.advanceToNextPage();

        cy.get(basePage?._selectors?.localPlanningDepartment)
            .type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil)
            .get(basePage?._selectors?.localPlanningDepartmentOptionZero)
            .click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors.answerNo).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerHouseholderPlanning).click();
        cy.advanceToNextPage();

        cy.getByData(basePage?._selectors?.answerRefused).click();
        cy.advanceToNextPage();

        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderDay).type(date.today());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderMonth).type(date.currentMonth());
        cy.get(prepareAppealSelector?._houseHolderSelectors?.decisionDateHouseholderYear).type(date.currentYear());
        cy.advanceToNextPage();
        cy.advanceToNextPage();
    })

    it(`Validate emails address with correct email format`, () => {
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type('abcdtestemail');
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter an email address in the correct format, like name@example.com');
    });

    it(`Validate correct email code received `, () => {
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();

        cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukHeadingOne, 'Your email address is confirmed');
    });

    it(`Validate error message when incorrect email code received `, () => {
        cy.getByData(prepareAppealSelector._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
        cy.advanceToNextPage();

        cy.get(prepareAppealSelector?._selectors?.emailCode).type('@12345');
        cy.advanceToNextPage();

        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter the code we sent to your email address');
    });

    it(`Validate change URL for application name in task link page `, () => {
        const applicationNamePage = new ApplicationNamePage();
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
            applicationNamePage.addApplicationNameData(false, prepareAppealData);
            cy.get(basePage._selectors?.govukLink).click({ multiple: true, force: true });
            cy.get(`a[href*="/appeals/householder/prepare-appeal/application-name?id=${dynamicId}"]`).contains('Change')
        });
    });

    it(`Validate data entered while adding the prepare appeal form `, () => {
        const applicationNamePage = new ApplicationNamePage();
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
            applicationNamePage.addApplicationNameData(context.applicationForm?.isAppellant, prepareAppealData);
            contactDetailsPage.addContactDetailsData(context, prepareAppealSelector?._selectors?.houseHolderApplicaitonType, prepareAppealData);
            appealSiteAddressPage.addAppealSiteAddressData(prepareAppealData);
            siteAreaPage.addSiteAreaData(context?.typeOfPlanningApplication, context?.applicationForm?.areaUnits, context, prepareAppealData);
            greenBeltPage.addGreenBeltData(context?.applicationForm?.appellantInGreenBelt);
            ownAllLandPage.addOwnAllLandData(context?.applicationForm?.isOwnsAllLand);

            if (!context?.applicationForm?.isOwnsAllLand) {
                ownSomeLandPage.addOwnSomeLandData(context?.applicationForm?.isOwnsSomeLand, context);
            }
            inspectorNeedAccessPage.addInspectorNeedAccessData(context?.applicationForm?.isInspectorNeedAccess, prepareAppealData);
            healthSafetyIssuesPage.addHealthSafetyIssuesData(context, prepareAppealData);
            cy.advanceToNextPage();
            //What is the application reference number?
            const applicationNumber = `TEST-${Date.now()}`;
            cy.get(prepareAppealSelector?._selectors?.applicationReference).type(applicationNumber);
            cy.advanceToNextPage();

            cy.get(prepareAppealSelector?._selectors?.onApplicationDateDay).type(date.today());
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateMonth).type(date.currentMonth());
            cy.get(prepareAppealSelector?._selectors?.onApplicationDateYear).type(date.currentYear());
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

            cy.containsMessage(basePage._selectors?.govukSummaryListKey, 'Was the application made in your name?').next('.govuk-summary-list__value').contains(`${context.applicationForm?.isAppellant === true ? 'Yes' : 'No'}`);
            cy.containsMessage(basePage._selectors?.govukSummaryListKey, 'Contact details').next('.govuk-summary-list__value').contains(`${prepareAppealData?.contactDetails?.firstName} ${prepareAppealData?.contactDetails?.lastName}`);
        });
    });
});

describe('Returns to pre appeals validations',{ tags:'@HAS-validation-4' }, () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const context = houseHolderAppealRefusedTestCases[0];

    let prepareAppealData;
    before(() => {
		cy.login(users.appeals.authUser);
	});
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/new-saved-appeal`);
        cy.url().then((url) => {
            cy.get('#new-or-saved-appeal-2').click();
            cy.advanceToNextPage();

            cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear();
            cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).type(prepareAppealData?.email?.emailAddress);
            cy.advanceToNextPage();

            cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
            cy.advanceToNextPage();

            let counter = 0;
            cy.reload();
            cy.get('.govuk-table__row').each(($row) => {
                const rowtext = $row.text();
                // if (rowtext.includes(lpaManageAppealsData?.hasAppealType) && !rowtext.includes(prepareAppealData?.todoInvalid)) {
                if (rowtext.includes('Householder') && !rowtext.includes(prepareAppealData?.todoInvalid)) {
                    if (counter == 0) {
                        const $link = cy.wrap($row).find('.govuk-table__cell a.govuk-link:contains("Continue")');
                        $link.scrollIntoView();
                        $link.should('be.visible').click({ force: true });
                    }
                    counter++;
                }
            })
        })
    })

    it(`Validate Save and come back later for return to appeal `, () => {
        cy.containsMessage('.govuk-link--no-visited-state', 'Save and come back later');
        cy.get('.govuk-link--no-visited-state').click();
        cy.containsMessage('.govuk-heading-l', 'Your appeals');
    });

    it(`Validate Continue without uploading documents`, () => {
        cy.get('a[href*="upload-documents"]').first().click();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', 'Select your application form');
    });

    it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
        cy.get('a[href*="upload-documents"]').first().click();
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan25mb);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    });

    it(`Validate multiple uploading documents`, () => {
        cy.get('a[href*="upload-documents"]').first().click();
        const expectedFileNames = [context?.documents?.uploadDevelopmentDescription, context?.documents?.uploadFinalisingDocDraft];
        expectedFileNames.forEach((fileName) => {
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName, index) => {
            cy.get('.moj-multi-file-upload__filename')
                .eq(index)
                .should('contain.text', fileName);
        });
    });

    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.get('a[href*="upload-documents"]').first().click();
        cy.uploadFileFromFixtureDirectory(context?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX`);
    });

    it(`Validate user should be allowed to remove uploaded files`, () => {
        cy.get('a[href*="upload-documents"]').first().click();
        const expectedFileNames = [context?.documents?.uploadDevelopmentDescription, context?.documents?.uploadFinalisingDocDraft];
        expectedFileNames.forEach((fileName) => {
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName, index) => {
            cy.get('.moj-multi-file-upload__filename')
                .eq(index)
                .should('contain.text', fileName);
        });
        expectedFileNames.forEach(() => {
            cy.get('.moj-multi-file-upload__delete')
                .eq(0)
                .click()
        });
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', 'Select your application form');
    });
});

describe('House Holder Task Page Validations',{ tags:'@HAS-validation-5' }, () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    let prepareAppealData;
    before(() => {
		cy.login(users.appeals.authUser);
	});
    beforeEach(() => {
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/new-saved-appeal`);
        cy.url().then((url) => {
            cy.get('#new-or-saved-appeal-2').click();
            cy.advanceToNextPage();
            cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).clear();
            cy.get(`#${prepareAppealSelector._selectors?.emailAddress}`).type(prepareAppealData?.email?.emailAddress);
            cy.advanceToNextPage();
            cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
            cy.advanceToNextPage();

            let counter = 0;
            cy.get('.govuk-table__row').each(($row) => {
                const rowtext = $row.text();

                if (rowtext.includes('Householder') && !rowtext.includes(prepareAppealData?.todoInvalid)) {
                    if (counter == 0) {
                        const $link = cy.wrap($row).find('.govuk-table__cell a.govuk-link:contains("Continue")');
                        $link.scrollIntoView();
                        $link.should('be.visible').click({ force: true });
                    }
                    counter++;
                }
            })
        })
    })

    it(`Validate task list status badges `, () => {
        let statusArray = [];
        cy.get('.moj-task-list__task-completed').each((element, index) => {
            console.log('element check', element)
            cy.wrap(element).invoke('text').then(text => {
                if (text.includes('In progress')) {
                    statusArray.push('In progress');
                }
                else if (text.includes('Not started')) {
                    statusArray.push('Not started');
                }
                else {
                    statusArray.push('Completed');
                }
            });
        });
        cy.get('span.app-task-list__section-number').last().next('strong').invoke('text').then(submitStatus => {
            if (statusArray.includes('In progress') || statusArray.includes('Not started')) {
                expect(submitStatus.replace(/\n/g, '').trim()).to.include('Cannot start yet');
            }
            else {
                expect(submitStatus.replace(/\n/g, '').trim()).to.include('Completed');
            }
        })
    });
});
