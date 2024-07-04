const applicationFormPage = require("../pages/applicationFormPage");
const contactDetailsPage = require("../pages/contactDetailsPage");
const appealSiteAddressPage = require("../pages/appealSiteAddressPage");
const siteAreaPage = require("../pages/siteAreaPage");
const greenBeltPage = require("../pages/greenBeltPage");
const ownAllLandPage = require("../pages/ownAllLandPage");
const ownSomeLandPage = require("../pages/ownSomeLandPage");
const ownsLandInvolvedPage = require("../pages/ownsLandInvolvedPage");
const initialiseHouseHolderPlanning = require("../sections/initialiseHouseHolderPlanning");
const initialiseFullPlanning = require("../sections/initialiseFullPlanning");
module.exports = (statusOfOriginalApplication,planning) => {
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
	if(planning === "answer-full-appeal"){
		initialiseFullPlanning(statusOfOriginalApplication,planning,"#site-selection-7");
	}
	else if(planning === "answer-householder-planning"){
		initialiseHouseHolderPlanning(statusOfOriginalApplication,planning,"#listed-building-householder-2");
	}
};
