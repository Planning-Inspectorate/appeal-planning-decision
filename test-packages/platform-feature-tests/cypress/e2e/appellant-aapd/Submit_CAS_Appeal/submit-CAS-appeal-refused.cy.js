/// <reference types='cypress'/>

import { casAppealRefusedTestCases } from "../../../helpers/appellantAAPD/casAppeal/casAppealRefusedData"; 
import { users } from "../../../fixtures/users.js";
const { submitAppealFlow } = require('../../../support/flows/sections/appellantAAPD/appeal');

describe("CAS Appeal Refused Test Cases",()=>{

    let prepareAppealData;
    beforeEach( () =>{

        cy.login(users.appeals.authUser);

     
    // Load the fixture data for prepareAppealData

    cy.fixture('prepareAppealData').then(data =>        {
        prepareAppealData=data;

        })
  });

        // Iterate through each test case in the fullAppealRefusedTestCases array
	    // Each test case will be executed with the provided context
	    casAppealRefusedTestCases.forEach((context) => {
            const {
                statusOfOriginalApplication,
                typeOfDecisionRequested,
                statusOfPlanningObligation,
                typeOfPlanningApplication,
                applicationForm
            } = context;

            // Define the test case
            it(`
            - Should check the status of the original application,
            - verify the status of planning obligation as "${statusOfPlanningObligation}",
            - validate the type of planning application as "${typeOfPlanningApplication}",
            - ensure the application form contains the correct details:
            * is Appellant: "${applicationForm?.isAppellant}"
            * Area Units: "${applicationForm?.areaUnits}"
            * appellant in Green Belt: "${applicationForm?.appellantInGreenBelt}"
            * Is Owns All Land: "${applicationForm?.isOwnsAllLand}"
            * Is Owns Some Land: "${applicationForm?.isOwnsSomeLand}"
            * Knows Other Owners: "${applicationForm?.knowsOtherOwners}"
            * Is Agricultural Holding: "${applicationForm?.isAgriculturalHolding}"
            * ${applicationForm?.anyOtherTenants !== undefined ? ` Any Other Tenants:  "${applicationForm?.anyOtherTenants}" ` : "No Other tenants needed"}
            * Is Inspector Access Needed: "${applicationForm?.isInspectorNeedAccess}"
            * Is Appellant Site Safety: "${applicationForm?.isAppellantSiteSafety}"
            * Is Development Description updated: "${applicationForm?.iaUpdateDevelopmentDescription}"
            * Appellant Procedure Preference: "${applicationForm?.appellantProcedurePreference}"
            * Any Other appeals: "${applicationForm?.anyOtherAppeals}"
            * Is Appellant Linked Case Add: "${applicationForm?.isAppellantLinkedCaseAdd}"
            * 		
        `, () => {
            // Call the submitAppealFlow function with the context and prepareAppealData
            submitAppealFlow({
                statusOfOriginalApplication,
                typeOfDecisionRequested,
                statusOfPlanningObligation,
                planning: typeOfPlanningApplication,
                context,
                prepareAppealData
            });
    });

    })

})


