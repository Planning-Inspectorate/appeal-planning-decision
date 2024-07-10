const applicationFormPage = require("../pages/prepare-appeal/applicationFormPage");
const contactDetailsPage = require("../pages/prepare-appeal/contactDetailsPage");
const appealSiteAddressPage = require("../pages/prepare-appeal/appealSiteAddressPage");
const siteAreaPage = require("../pages/prepare-appeal/siteAreaPage");
const greenBeltPage = require("../pages/prepare-appeal/greenBeltPage");
const ownAllLandPage = require("../pages/prepare-appeal/ownAllLandPage");
const ownSomeLandPage = require("../pages/prepare-appeal/ownSomeLandPage");
const ownsLandInvolvedPage = require("../pages/prepare-appeal/ownsLandInvolvedPage");
const initialiseHouseHolderPlanning = require("../sections/initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("../sections/initialiseFullPlanning");
module.exports = (statusOfOriginalApplication,planning,context) => {
	cy.visit(`${Cypress.config('appeals_beta_base_url')}/before-you-start`);
	cy.advanceToNextPage(); 
	cy.get('#local-planning-department')
		.type('System Test Borough Council')
		.get('#local-planning-department__option--0')
		.click();
	cy.advanceToNextPage();
	//cy.get('#type-of-planning-application').click();
	cy.get(`[data-cy="${planning}"]`).click();
	cy.advanceToNextPage();
	
	let grantedOrRefusedId = '';
	if (statusOfOriginalApplication === 'refused') {
		grantedOrRefusedId ='[data-cy="answer-refused"]';
	} else if (statusOfOriginalApplication === 'no decision') {
		grantedOrRefusedId = '[data-cy="answer-nodecisionreceived"]';
	} else {
		grantedOrRefusedId = '[data-cy="answer-granted"]';
	}
	
	if(planning === "answer-full-appeal"){
		
		cy.get("#site-selection-7").click();
		cy.advanceToNextPage();
		initialiseFullPlanning(statusOfOriginalApplication,planning,grantedOrRefusedId,context);
	}
	else if(planning === "answer-householder-planning"){

		cy.get("#listed-building-householder-2").click();
	cy.advanceToNextPage();

	statusOfOriginalApplication === 'refused'?initialiseHouseHolderPlanning(statusOfOriginalApplication,planning,grantedOrRefusedId,context):initialiseFullPlanning(statusOfOriginalApplication,planning,grantedOrRefusedId,context);
	}
};
