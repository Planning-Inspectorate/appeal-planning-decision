// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from '../base-page';
import { TaskList } from './task-list';

const basePage = new BasePage();
const taskList = new TaskList();

export class AppealSiteAddress {
	elements = {
		addressLineOneInput: () => cy.get('[data-cy="site-address-line-one"]'),
		addressLineTwoInput: () => cy.get('[data-cy="site-address-line-two"]'),
		townOrCityInput: () => cy.get('[data-cy="site-town-city"]'),
		countyInput: () => cy.get('[data-cy="site-county"]'),
		postcodeInput: () => cy.get('[data-cy="site-postcode"]')
	}

	enterAppealSiteAddress() {
		taskList.clickAppealSiteSectionLink();
		cy.url().should('include', 'appeal-site-address');
		this.elements.addressLineOneInput().clear().type('Road 1');
		this.elements.addressLineTwoInput().clear().type('Road 2');
		this.elements.townOrCityInput().clear().type('London');
		this.elements.countyInput().clear().type('Islington');
		this.elements.postcodeInput().clear().type('N1 9BE');
		basePage.clickSaveAndContiuneBtn();
	}


	// Do you own all the land involved in the appeal?
	landInvolved(option){
		if (option === 'Yes') {
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
		} else {
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
		}
	}

	// Land Ownership - 'No' sections
	
	// Do you own some of the land involved in the Appeal?
	ownershipOfLand(option){
		if (option === 'Yes') {
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
		}
		else {
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
		}
	}

	// Do you know who owns the rest of the land involved in the appeal? with Additional sections after (end of flow)
	restOfLand(option){
		if (option === 'Yes') {
			basePage.selectRadioBtn('yes');
			basePage.clickContinueBtn();
			cy.url().should('include', 'telling-the-landowners');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickSaveAndContiuneBtn();
		}
		else if (option === 'Some') { 
			basePage.selectRadioBtn('some');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'identifying-the-owners');
			basePage.selectCheckBox('i-agree');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'advertising-your-appeal');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickContinueBtn();
			cy.url().should('include', 'telling-the-landowners');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickSaveAndContiuneBtn();
		}
		else if (option === 'No') {
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'identifying-the-owners');
			basePage.selectCheckBox('i-agree');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'advertising-your-appeal');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickContinueBtn();
		}
	}

	// (End of flow) is this appeal site part of an agricultural holding?  
	argiculturalHoldings(option) {
		if (option === 'Yes') {
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();			
		}
		else {
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn(); 
		}
	}

	tenantOfArgiculturalHoldings(option) {
		if (option === 'Yes') {
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
		} else {
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'telling-the-tenants');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickContinueBtn();

		}
	}

	otherTenants(option){
		if (option === 'Yes'){
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
			cy.url().should('include', 'telling-the-tenants');
			basePage.selectCheckBox('toldAboutMyAppeal');
			basePage.selectCheckBox('withinLast21Days');
			basePage.selectCheckBox('useCopyOfTheForm');
			basePage.clickContinueBtn();
		} else {
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
		}
	}

	visibleFromPublicRoad(option) {
		if (option === 'Yes') {
			cy.url().should('include', 'visible-from-road');
			basePage.selectRadioBtn('yes');
			basePage.clickSaveAndContiuneBtn();
		} else {
			cy.url().should('include', 'visible-from-road');
			basePage.selectRadioBtn('no');
			basePage.enterTextArea('test');
			basePage.clickSaveAndContiuneBtn();
		}
	}

	healthAndSafteyIssues(option) {
		if (option === 'Yes') {
			cy.url().should('include', 'health-safety-issues');
			basePage.selectRadioBtn('yes');
			basePage.enterTextArea('test');
			basePage.clickSaveAndContiuneBtn();
		} else {
			cy.url().should('include', 'health-safety-issues');
			basePage.selectRadioBtn('no');
			basePage.clickSaveAndContiuneBtn();
		}
	}
	
	}
