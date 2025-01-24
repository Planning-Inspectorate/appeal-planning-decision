/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../page-objects/base-page";
import { fullAppealQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/fullAppealQuestionnaireData";

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

  it(`Questionnaire Hyperlink`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


  it(`Waiting for review tab`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


});

describe('Full appleal questionnaire validation', () => {
  const basePage = new BasePage();
  const yourAppealsSelector = new YourAppealsSelector();
  const context = fullAppealQuestionnaireTestCases[0];
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
  
  it(`Validating Full appeal questionnaire url`, () => {
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();		
      if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
        if (counter === 0) {				
          cy.wrap($row).within(() => {
            cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
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
    }).then(() => {

      cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

    });
  });

  it(`Validating Full appeal questionnaire url`, () => {
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();		
      if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
        if (counter === 0) {				
          cy.wrap($row).within(() => {
            cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
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
    }).then(() => {

      cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

    });
  });

  it(`Validate Full appeal questionnaire appeal type answer link`, () => {
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
  it(`Validate Full appeal questionnaire appeal type error validation`, () => {
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

  it(`Validate Full appeal questionnaire changes a listed building validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Changes a listed building').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does the proposed development change a listed building?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#changesListedBuilding').and('contain.text', 'Select yes if this is the correct type of appeal');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Changes a listed building').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire changes listed building or site has been added to the case validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Listed Building').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does the proposed development change a listed building?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#changesListedBuilding').and('contain.text', 'Select yes if the proposed development affects the setting of listed buildings');
      }
      else if (linkText === 'Change') {        
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        if(context?.constraintsAndDesignations?.isChangesListedBuilding){
          cy.advanceToNextPage();
          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#addChangedListedBuilding').and('contain.text', 'Enter a list entry number');
        }        
      }
    });
  });

  it(`Validate Full appeal questionnaire Affects a listed building`, () => {
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

  it(`Validate Full appeal questionnaire Affects Listed building or site has been added to the case validation`, () => {
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

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#addAffectedListedBuilding').and('contain.text', 'Enter a list entry number');
        }        
      }
    });
  });

  it(`Validate Full appeal questionnaire Affects a scheduled monument validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Affects a scheduled monument').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Would the development affect a scheduled monument?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#affectsScheduledMonument').and('contain.text', 'Select yes if affect a scheduled monument');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Affects a scheduled monument').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire Conversation Area`, () => {
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

  it(`Validate Full appeal questionnaire Conservation area map and guidance`, () => {
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

  it(`Validate Full appeal questionnaire affect a protected species validation`, () => {
    cy.get('.govuk-summary-list__key').contains('Protected species').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Would the development affect a protected species?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#protectedSpecies').and('contain.text', 'Select yes if affect protected species');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Protected species').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire Green Belt`, () => {
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

  it(`Validate Full appeal questionnaire Area of outstanding natural beauty`, () => {
    cy.get('.govuk-summary-list__key').contains('Area of outstanding natural beauty').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Is the appeal site in an area of outstanding natural beauty?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#naturalBeauty').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Area of outstanding natural beauty').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire affect any designated sites`, () => {
    cy.get('.govuk-summary-list__key').contains('Designated sites').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Is the development in, near or likely to affect any designated sites?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#designatedSites').and('contain.text', 'Select a designated site, or select ‘No, it is not in, near or likely to affect any designated sites’');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Designated sites').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire Tree Preservation Order`, () => {
    cy.get('.govuk-summary-list__key').contains('Tree Preservation Order').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does a Tree Preservation Order (TPO) apply to any part of the appeal site?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#treePreservationOrder').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Tree Preservation Order').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire Tree Preservation Order extent`, () => {
    cy.get('.govuk-summary-list__key').contains('Tree Preservation Order').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Does a Tree Preservation Order (TPO) apply to any part of the appeal site?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#treePreservationOrder').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();

        if(context?.constraintsAndDesignations?.isConservationArea){
          cy.advanceToNextPage();

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadTreePreservationOrder').and('contain.text', 'Select a plan showing the extent of the order');
        } 
      }
    });
  });

  it(`Validate Full appeal questionnaire public right of way need to be removed or diverted`, () => {
    cy.get('.govuk-summary-list__key').contains('Public right of way').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Would a public right of way need to be removed or diverted?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#publicRightOfWay').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.get('.govuk-summary-list__key').contains('Public right of way').closest('.govuk-summary-list__row').find('.govuk-summary-list__value').should('not.have.text', 'Not started').and('be.visible');
      }
    });
  });

  it(`Validate Full appeal questionnaire Definitive map and statement extract`, () => {
    cy.get('.govuk-summary-list__key').contains('Public right of way').closest('.govuk-summary-list__row').find('a.govuk-link').then(($link) => {
      const linkText = $link.text().split('Would a public right of way need to be removed or diverted?')[0].trim();
      cy.log(linkText);
      if (linkText === 'Answer') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();
        cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#publicRightOfWay').and('contain.text', 'You must select an answer');
      }
      else if (linkText === 'Change') {
        cy.wrap($link).should('be.visible').click({ force: true });
        cy.advanceToNextPage();

        if(context?.constraintsAndDesignations?.isConservationArea){
          cy.advanceToNextPage();

          cy.get('.govuk-list.govuk-error-summary__list').find('a').should('have.attr', 'href', '#uploadDefinitiveMapStatement').and('contain.text', 'Select the definitive map and statement extract');
        } 
      }
    });
  });


  // 2. Environmental impact assessment


  // 3. Notifying relevant parties of the application section validations
  it(`Validate Full appeal questionnaire Who was notified`, () => {
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

  it(`Validate Full appeal questionnaire Type of notification`, () => {
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

 // 4. Consultation responses and representations
  it(`Validate Full appeal questionnaire Representations from other parties`, () => {
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

  it(`Validate Full appeal questionnaire Upload representations from other parties`, () => {
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

  // 5. Planning officer's report and supporting documents
  it(`Validate Full appeal questionnaire Upload planning officer’s report`, () => {
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

  it(`Validate Full appeal questionnaire Upload the plans, drawings and list of plans`, () => {
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

  it(`Validate Full appeal questionnaire Policies from statutory development plan`, () => {
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

  it(`Validate Full appeal questionnaire Emerging plans`, () => {
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

  it(`Validate Full appeal questionnaire Upload emerging plan and supporting information`, () => {
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

  it(`Validate Full appeal questionnaire Supplementary planning documents`, () => {
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

  it(`Validate Full appeal questionnaire Upload supplementary planning documents`, () => {
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

  //  6. Site access
  it(`Validate Full appeal questionnaire Access for inspection`, () => {
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

  it(`Validate Full appeal questionnaire Might the inspector need to enter a neighbour’s land or property?`, () => {
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

  it(`Validate Full appeal questionnaire Potential safety risks`, () => {
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

  // 7. Appeal process
  it(`Validate Full appeal questionnaire Appeals near the site`, () => {
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

  it(`Validate Full appeal questionnaire Other appeal`, () => {
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

  it(`Validate Full appeal questionnaire Extra conditions`, () => {
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

  // 8. Submit

  it(`Validate Full appeal questionnaire Submit`, () => {
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

