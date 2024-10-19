import { BasePage } from "../../../../page-objects/base-page";

export const lpaQuestionnaire = (context) => {
	const basePage = new BasePage();
	const appealId = '6003810';
	cy.get('tr.govuk-table__row').each(($row)=> {
		const rowtext=$row.text();
		if(rowtext.includes('HAS') && rowtext.includes(appealId)) {
			cy.wrap($row).within(()=>{
				cy.get('td.govuk-table__cell').contains('HAS').should('be.visible');
				cy.get('a.govuk-link').contains(appealId).scrollIntoView();
				cy.get('a.govuk-link').contains(appealId).click({force: true});
				return false;
			})
		}
	})
	cy.url().should('include',`/manage-appeals/questionnaire/${appealId}`);
	cy.get('dl.govuk-summary-list.appeal-details').within(()=>{
		cy.get('.govuk-summary-list__row').each(($row)=>{
			const $key = $row.find('.govuk-summary-list__key');
			if($key.text().trim() === 'Appeal type') {
				cy.wrap($row).find('.govuk-summary-list__value').should('contain.text','Householder');
			return false;
			} 
		});

	});
	cy.contains('Is this the correct type of appeal?').closest('.govuk-summary-list__row').find('a.govuk-link').then($link=>{
		if($link.text().includes('Answer')){
			cy.wrap($link).contains('Answer').click();
		} else {
			cy.wrap($link).contains('Change').click();
		}
	});
	if(context?.constraintsAndDesignations?.isCorrectTypeOfAppeal){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.advanceToNextPage();
	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();
	}
	// Once we tested we wil move to separate section
	if(context?.constraintsAndDesignations?.affectListedBuildings){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.advanceToNextPage();
		cy.get('#affectedListedBuildingNumber').type('')
		cy.advanceToNextPage();
	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();
	}
	// conservative area section 
	if(context?.constraintsAndDesignations?.conservationArea){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.advanceToNextPage();		
		cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
		cy.advanceToNextPage();	

	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();
	}

	// Green belt  area section 
	if(context?.constraintsAndDesignations?.isGreenBelt){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.advanceToNextPage();		
		cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
		cy.advanceToNextPage();	

	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();
		cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
		cy.advanceToNextPage();	
	}


	
	
};
