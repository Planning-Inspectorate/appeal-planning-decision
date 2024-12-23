/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../page-objects/base-page";
import { houseHolderQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/houseHolderQuestionnaireData";

const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Manage Your Appeals', () => {
  const basePage = new BasePage();
  const yourAppealsSelector = new YourAppealsSelector();
  let lpaManageAppealsData;
  beforeEach(() => {
    cy.fixture('lpaManageAppealsData').then(data => {
      lpaManageAppealsData = data;
    })
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
    cy.url().then((url) => {
      if (url.includes('/manage-appeals/your-email-address')) {
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
        cy.advanceToNextPage();
      }
    });
  })

  it(`LPA Manage Your Appeals`, () => {
    cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);
  });

  it(`Add and Remove user link validation`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });

  it(`Your Appeals tab`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });
  it(`Appeal Id Hyperlink`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });

  it(`Questionnaire Hyperlink `, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


  it(`Waiting for review tab`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


});

// describe('Full appleal questionnaire validation', () => {
//   const basePage = new BasePage();
//   const yourAppealsSelector = new YourAppealsSelector();
//   let lpaManageAppealsData;
//   beforeEach(() => {
//     cy.fixture('lpaManageAppealsData').then(data => {
//       lpaManageAppealsData = data;
//     })
//     cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
//     cy.url().then((url) => {
//       if (url.includes('/manage-appeals/your-email-address')) {
//         cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
//         cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
//         cy.advanceToNextPage();
//         cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
//         cy.advanceToNextPage();
//       }
//     });
//   })
//   it(`Validating Full appeal questionnaire url`, () => {
//     let appealId;
//     let counter = 0;
//     cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
//       const rowtext = $row.text();		
//       if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
//         if (counter === 0) {				
//           cy.wrap($row).within(() => {
//             cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
//             cy.get('a').each(($link) => {
//               if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
//                 appealId = $link.attr('href')?.split('/').pop();
//                 cy.log(appealId);							
//                 cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
//                 return false;
//               }
//             });
//           });
//         }
//         counter++;
//       }
//     }).then(() => {

//       cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

//     });
//   });

//   it(`Validating Full appeal questionnaire url`, () => {
//     let appealId;
//     let counter = 0;
//     cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
//       const rowtext = $row.text();		
//       if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
//         if (counter === 0) {				
//           cy.wrap($row).within(() => {
//             cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
//             cy.get('a').each(($link) => {
//               if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
//                 appealId = $link.attr('href')?.split('/').pop();
//                 cy.log(appealId);							
//                 cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
//                 return false;
//               }
//             });
//           });
//         }
//         counter++;
//       }
//     }).then(() => {

//       cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

//     });
//   });
// });

describe('House Holder appleal questionnaire validation', () => {
  const basePage = new BasePage();
  const yourAppealsSelector = new YourAppealsSelector();
  const context = houseHolderQuestionnaireTestCases[0];
  let lpaManageAppealsData;
  let appealId;

  beforeEach(() => {
    cy.fixture('lpaManageAppealsData').then(data => {
      lpaManageAppealsData = data;
    })
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
    cy.url().then((url) => {
      if (url.includes('/manage-appeals/your-email-address')) {
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
        cy.advanceToNextPage();
      }
    });
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();
      if (rowtext.includes(lpaManageAppealsData?.hasAppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
        if (counter === 0) {
          cy.log(rowtext);
          cy.wrap($row).within(() => {
            cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.hasAppealType).should('be.visible');
            cy.get('a').each(($link) => {
              if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
                appealId = $link.attr('href')?.split('/').pop();
                cy.log(appealId);
                cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                return false;
              }
            });
          });
        }
        counter++;
      }
    });
  })
  it(`House Holder appleal questionnaire url`, () => {  

      cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

  }); 

  it(`Validate House Holder questionnaire appeal type answer link`, () => {
    cy.get('a.govuk-link').should('exist').each(($link) => {
      if($link.is(':visible')){
        cy.wrap($link).invoke('text').then((text)=>{
          const trimmedText = text.trim()
          if (trimmedText === 'Answer') {
            cy.wrap($link).should('have.text', 'Answer').and('be.visible')
          }
        })
      }
    })
  }); 
//  1. Constraints, designations and other issues section validations
  it(`Validate House Holder questionnaire appeal type error validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Is this the correct type of appeal?').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Is this the correct type of appeal?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#correctAppealType').and('contain.text', 'Select yes if this is the correct type of appeal');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Is this the correct type of appeal?').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Affects a listed building`, () => {
    cy.get('.govuk-summary-list__key').contains('Affects a listed building').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does the proposed development affect the setting of listed buildings?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#affectsListedBuilding').and('contain.text', 'Select yes if the proposed development affects the setting of listed buildings');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Affects a listed building').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');      
      }
    });
  });

  it(`Validate House Holder questionnaire Listed building or site has been added to the case validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Affects a listed building').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does the proposed development affect the setting of listed buildings?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#affectsListedBuilding').and('contain.text', 'Select yes if the proposed development affects the setting of listed buildings');
      }
      else if (linkText === 'Change') {        
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        if(context?.constraintsAndDesignations?.isChangesListedBuilding){
          cy.advanceToNextPage();

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#affectedListedBuildingNumber').and('contain.text', 'Enter a list entry number');
        }        
      }
    });
  });  

  it(`Validate House Holder questionnaire Conversation Area`, () => {
    cy.get('.govuk-summary-list__key').contains('Conservation area').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split(' Is the site in, or next to a conservation area?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#conservationArea').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Conservation area').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Conservation area map and guidance`, () => {
    cy.get('.govuk-summary-list__key').contains('Conservation area').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split(' Is the site in, or next to a conservation area?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#conservationArea').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();

        if(context?.constraintsAndDesignations?.isConservationArea){
          cy.advanceToNextPage();

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadConservation').and('contain.text', 'Select a conservation map and guidance');
        }   

        // cy.get('.govuk-summary-list__key').contains('Conservation area').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Green Belt`, () => {
    cy.get('.govuk-summary-list__key').contains('Green belt').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Is the site in a green belt?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#greenBelt').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Green belt').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  // 2. Notifying relevant parties of the application section validations
  it(`Validate House Holder questionnaire Who was notified`, () => {
    cy.get('.govuk-summary-list__key').contains('Who was notified').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Who did you notify about this application?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Upload') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadWhoNotified').and('contain.text', 'Select your document that lists who you notified');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Who was notified').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Type of notification`, () => {
    cy.get('.govuk-summary-list__key').contains('Type of notification').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('How did you notify relevant parties about the planning application?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#notificationMethod').and('contain.text', 'Select how you notified people about the planning application');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Type of notification').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });  

 // 3. Consultation responses and representations
  it(`Validate House Holder questionnaire Representations from other parties`, () => {
    cy.get('.govuk-summary-list__key').contains('Representations from other parties').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split(' Did you receive representations from members of the public or other parties?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#otherPartyRepresentations').and('contain.text', 'Select yes if you received representations from members of the public or other parties');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Representations from other parties').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Upload representations from other parties`, () => {
    cy.get('.govuk-summary-list__key').contains('Representations from other parties').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split(' Did you receive representations from members of the public or other parties?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#otherPartyRepresentations').and('contain.text', 'Select yes if you received representations from members of the public or other parties');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();

        if(context?.consultResponseAndRepresent?.isOtherPartyRepresentations){
          cy.advanceToNextPage();

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadRepresentations').and('contain.text', 'Select the representations');
        }
      }
    });
  });

  // //4. Planning officer's report and supporting documents
  it(`Validate House Holder questionnaire Upload planning officer’s report`, () => {
    cy.get('.govuk-summary-list__key').contains('Who was notified').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Upload the planning officer’s report or what your decision notice would have said')[0].trim();
      cy.log(linkText);
      if (linkText === 'Upload') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadPlanningOfficerReport').and('contain.text', 'Select the planning officer’s report or what your decision notice would have said');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Who was notified').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Upload the plans, drawings and list of plans`, () => {
    cy.get('.govuk-summary-list__key').contains('Upload the plans, drawings and list of plans').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Upload the plans, drawings and list of plans')[0].trim();
      cy.log(linkText);
      if (linkText === 'Upload') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadPlansDrawings').and('contain.text', 'Select the plans, drawings and list of plans');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Upload the plans, drawings and list of plans').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Policies from statutory development plan`, () => {
    cy.get('.govuk-summary-list__key').contains('Policies from statutory development plan').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Upload relevant policies from your statutory development plan')[0].trim();
      cy.log(linkText);
      if (linkText === 'Upload') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadDevelopmentPlanPolicies').and('contain.text', 'Select the relevant policies from your statutory development plan');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Upload the plans, drawings and list of plans').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Emerging plans`, () => {
    cy.get('.govuk-summary-list__key').contains('Emerging plans').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Do you have an emerging plan that is relevant to this appeal?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#emergingPlan').and('contain.text', 'Select yes if you have an emerging plan that is relevant to this appeal');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Emerging plans').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Upload emerging plan and supporting information`, () => {
    cy.get('.govuk-summary-list__key').contains('Emerging plans').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Do you have an emerging plan that is relevant to this appeal?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#emergingPlan').and('contain.text', 'Select yes if you have an emerging plan that is relevant to this appeal');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
    
        if(context?.poReportAndSupportDocs?.isEmergingPlan){
          cy.advanceToNextPage();
    
          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadEmergingPlan').and('contain.text', 'Select the emerging plan and supporting information');
        }
      } 
    });
  });


  it(`Validate House Holder questionnaire Supplementary planning documents`, () => {
    cy.get('.govuk-summary-list__key').contains('Supplementary planning documents').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Did any supplementary planning documents inform the outcome of the application?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#supplementaryPlanningDocs').and('contain.text', 'Select yes if any supplementary planning documents informed the outcome of the application');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Supplementary planning documents').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Upload supplementary planning documents`, () => {
    cy.get('.govuk-summary-list__key').contains('Supplementary planning documents').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Did any supplementary planning documents inform the outcome of the application?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#supplementaryPlanningDocs').and('contain.text', 'Select yes if any supplementary planning documents informed the outcome of the application');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
    
        if(context?.poReportAndSupportDocs?.isSupplementaryPlanningDocs){
          cy.advanceToNextPage();
    
          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadSupplementaryPlanningDocs').and('contain.text', 'Select the relevant policy extracts and supplementary planning documents');
        }
      } 
    });
  });

  // //  5. Site access
  it(`Validate House Holder questionnaire Access for inspection`, () => {
    cy.get('.govuk-summary-list__key').contains('Access for inspection').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Might the inspector need access to the appellant’s land or property?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#lpaSiteAccess').and('contain.text', 'Select yes if the inspector might need access to the appellant’s land or property');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Access for inspection').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Might the inspector need to enter a neighbour’s land or property?`, () => {
    cy.get('.govuk-summary-list__key').contains('Might the inspector need to enter a neighbour’s land or property?').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Might the inspector need to enter a neighbour’s land or property?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#neighbourSiteAccess').and('contain.text', 'Select yes if the inspector might need to enter a neighbour’s land or property');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Might the inspector need to enter a neighbour’s land or property?').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Potential safety risks`, () => {
    cy.get('.govuk-summary-list__key').contains('Potential safety risks').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Add potential safety risks')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#lpaSiteSafetyRisks').and('contain.text', 'Select yes if there are any potential safety risks');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Potential safety risks').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  // //6. Appeal process
  it(`Validate House Holder questionnaire Appeals near the site`, () => {
    cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Are there any other ongoing appeals next to, or close to the site?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#nearbyAppeals').and('contain.text', 'Select yes if there are any other ongoing appeals next to, or close to the site');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate House Holder questionnaire Other appeal`, () => {
    cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Are there any other ongoing appeals next to, or close to the site?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#nearbyAppeals').and('contain.text', 'Select yes if there are any other ongoing appeals next to, or close to the site');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
    
        if(context?.appealProcess?.isNearbyAppeals){
          cy.advanceToNextPage();
          cy.advanceToNextPage();
    
          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#nearbyAppealReference').and('contain.text', 'Enter an appeal reference number');
        }
      } 
    });
  });

  it(`Validate House Holder questionnaire Extra conditions`, () => {
    cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Add new planning conditions to this appeal')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#newConditions').and('contain.text', 'Select yes if there are any new conditions');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  // // 7. Submit

  it(`Validate House Holder questionnaire Submit`, () => {
    cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Add new planning conditions to this appeal')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#newConditions').and('contain.text', 'Select yes if there are any new conditions');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Appeals near the site').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });
});