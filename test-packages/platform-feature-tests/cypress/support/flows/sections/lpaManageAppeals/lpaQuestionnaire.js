import { BasePage } from "../../../../page-objects/base-page";

export const lpaQuestionnaire = (context) => {
	const basePage = new BasePage();
	let appealId;
	let counter = 0;
	cy.get('tr.govuk-table__row').each(($row)=> {
		const rowtext=$row.text();
		//cy.log('countercheck',counter);
		if(rowtext.includes('HAS') && !rowtext.includes('INVALID')) {
			if(counter === 1){		
			cy.log(rowtext);
		
			cy.wrap($row).within(() => {
			cy.get('td.govuk-table__cell').contains('HAS').should('be.visible');
			//Log all below links for debug
			cy.get('a').each(($link) => {
				if($link.attr('href')?.includes('questionnaire')){
					appealId=$link.attr('href')?.split('/').pop();
					cy.log(appealId);
					//cy.log(`Link found:${$link.text()},href:${$link.attr('href')}`);
					cy.wrap($link).scrollIntoView().should('be.visible').click({force: true});
					return false;
				}						
			});			
			});			
		}
		counter++;
		}		
	}).then(() =>{
	
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

	//
	cy.checkIfUnchecked('A site notice');
	cy.checkIfUnchecked('Letters or emails to interested parties');
	cy.checkIfUnchecked('An advert in the local press');
	// cy.getByData('answer-site-notice').click();
	// cy.getByData('answer-letters-or-emails').click();
	// cy.getByData('answer-advert').click();
	cy.advanceToNextPage();
	cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
	cy.advanceToNextPage();
	cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
	cy.advanceToNextPage();
	cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
	cy.advanceToNextPage();


	// Consultation responses and representations 
	if(context?.consultResponseAndRepresent?.otherPartyRepresentations){
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

	//Planning officer's report and supplementary documents	
	cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
	cy.advanceToNextPage();
	cy.uploadFileFromFixtureDirectories('decision-letter.pdf');
	cy.advanceToNextPage();

	//Site access
	if(context?.siteAccess?.lpaSiteAccess){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.get('#lpaSiteAccess_lpaSiteAccessDetails').type('site access information')
		cy.advanceToNextPage();			

	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();		
	}

	if(context?.siteAccess?.neighbourSiteAccess){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.get('#neighbourSiteAccess_neighbourSiteAccessDetails').type('neighbour access')
		cy.advanceToNextPage();
		cy.get('body').then($body => {
			if($body.find('.govuk-fieldset__heading:contains("Do you want to add another neighbour to be visited?")').length > 0){
				cy.getByData(basePage?._selectors.answerNo).click();
			 	cy.advanceToNextPage();	
			} else {
				cy.get('#address-line-1').type('address-line-one');
				cy.get('#address-line-2').type('address-line-two');
				cy.get('#address-town').type('address-town');				
				cy.get('#address-county').type('address-county');
				cy.get('#address-postcode').type('ab1 2cd');
				cy.advanceToNextPage();
				cy.getByData(basePage?._selectors.answerNo).click();
			 	cy.advanceToNextPage();	
			}
		})
		// if(cy.get('.govuk-fieldset__heading').contains('Do you want to add another neighbour to be visited?')){
		// 	cy.getByData(basePage?._selectors.answerNo).click();
		// 	cy.advanceToNextPage();	
		// } else {
		// 	cy.get('#address-line-1').type('address-line-one');
		// 	cy.get('#address-line-2').type('address-line-two');
		// 	cy.get('#address-county').type('address-county');
		// 	cy.get('#address-postcode').type('address-postcode');
		// 	cy.advanceToNextPage();
		// }
	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();		
	}

	if(context?.siteAccess?.lpaSiteSafetyRisks){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.get('#lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails').type('lpaSiteSafetyRisks lpaSiteSafetyRiskDetails')
		cy.advanceToNextPage();			

	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();		
	}
// Appeals Access
	if(context?.appealProcess?.nearbyAppeals){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.advanceToNextPage();
		cy.get('body').then($body => {
			if($body.find('.govuk-fieldset__heading:contains("Add another appeal?")').length > 0){
				cy.getByData(basePage?._selectors.answerNo).click();
			 	cy.advanceToNextPage();	
			} else {		
			cy.get('#nearbyAppealReference').type('1234567');
			cy.advanceToNextPage();
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
			}
		});
	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();		
	}

	if(context?.appealProcess?.newConditions){
		cy.getByData(basePage?._selectors.answerYes).click();
		cy.get('#newConditions_newConditionDetails').type('newConditions newConditionDetails')
		cy.advanceToNextPage();			

	} else {		
		cy.getByData(basePage?._selectors.answerNo).click();
		cy.advanceToNextPage();		
	}
});
// commented for test during codding
// 	cy.getByData('submit-questionnaire').click();
// 	cy.get('.govuk-panel__title').contains('Questionnaire submitted');
 };
