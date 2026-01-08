import { appealsApiClient } from "#support/appealsApiClient";
import { finalCommentTestCases } from "../../../helpers/lpaManageAppeals/finalCommentData";
import { appealIdWaitingForReview } from "./appealIdWaitingForReview";
import { viewValidatedAppealDetailsAppellant } from "./appellantAAPD/viewValidatedAppealDetailsAppellant";
import { ipCommentsForAppealRef } from "./ipComments/ipComments";
import { finalCommnetForCaseRef } from "./lpaManageAppeals/finalComment";
import { finalCommnetForCaseRef as finalCommnetForCaseRefAAPD } from "./appellantAAPD/finalComment";
import { householderQuestionnaire } from "./lpaManageAppeals/houseHolderQuestionnaire";
import { questionnaire } from "./lpaManageAppeals/questionnaire";
import { statementForCaseRef } from "./lpaManageAppeals/statement";
import { viewValidatedAppealDetailsLPA } from "./lpaManageAppeals/viewValidatedAppealDetailsLPA";

export const appealsE2EIntegration = (context, planning, lpaManageAppealsData, questionnaireTestCases, statementTestCases) => {  
    if (context?.endToEndIntegration) {
        // Get the Case Reference and validate submitted appeal details
        cy.get(`a[href="/appeals/your-appeals"]`).click();
        // Fetch both the case reference (td[0]) and appeal type (td[2]) from the last row
        appealIdWaitingForReview().then(({ caseRef, appealType }) => {
            cy.log(`Case Reference: ${caseRef}`); // Log the actual string value, not JSON.stringify             
            //	if (typeof caseRef === 'string') {
            let truncatedAppealId = caseRef;
            // Ensure replace is called on a string
            truncatedAppealId = String(truncatedAppealId).replace(/^\d{2}/, '');
            cy.log(`Case Ref updated: ${truncatedAppealId} -> ${truncatedAppealId}`);
            //Assign Case Officer via API
            appealsApiClient.assignCaseOfficer(truncatedAppealId);

            // Validated appeal details via API and start appeal          
            cy.getBusinessActualDate(new Date(), 0).then((date) => {
                cy.updateAppealDetailsViaApi(caseRef, { validationOutcome: 'valid', validAt: date });
            });
            cy.reload();
            cy.startAppeal(caseRef);

            // Submit the LPA questionnaire in LPA dash board
            viewValidatedAppealDetailsLPA(caseRef);            

            if ( appealType === lpaManageAppealsData?.s78AppealType || appealType === lpaManageAppealsData?.s20AppealType || appealType === lpaManageAppealsData?.commercialadvAppealType || appealType === lpaManageAppealsData?.advertAppealType ) {                
                questionnaire(questionnaireTestCases[0], lpaManageAppealsData, appealType, caseRef);
            } else {               
                householderQuestionnaire(questionnaireTestCases[0], lpaManageAppealsData, appealType, caseRef);
            }
            // Review LPA questionnaire via API
            cy.reviewLpaqSubmission(caseRef);
            
            // Submit the LPA statement in LPA dash board

            if ( appealType === lpaManageAppealsData?.s78AppealType || appealType === lpaManageAppealsData?.s20AppealType || appealType === lpaManageAppealsData?.advertAppealType) {

                viewValidatedAppealDetailsLPA(caseRef);
                statementForCaseRef(statementTestCases[1], caseRef);

                cy.reviewStatementViaApi(caseRef);

                // Add IP Comments from FO
                ipCommentsForAppealRef(caseRef);

                // Review IP Comments in Back Office
                cy.reviewIpCommentsViaApi(caseRef);


                // Elapse duedate through api call for statements
                cy.simulateStatementsDeadlineElapsed(caseRef);


                // Share satatements and IP comments in Back Office
                cy.shareCommentsAndStatementsViaApi(caseRef);


                // Submit LPA final comments
                viewValidatedAppealDetailsLPA(caseRef);
                finalCommnetForCaseRef(finalCommentTestCases[1], caseRef);


                // Submit appellant final comments in AAPD     
                viewValidatedAppealDetailsAppellant(caseRef);
                finalCommnetForCaseRefAAPD(finalCommentTestCases[1], caseRef);

                // Review LPA final comments in Back Office
                cy.reviewLpaFinalCommentsViaApi(caseRef);


                // Review appellant final comments in Back Office
                cy.reviewAppellantFinalCommentsViaApi(caseRef);

                // Elapse final comments through api call
                cy.simulateFinalCommentsDeadlineElapsed(caseRef);

                // Share final comments in Back Office
                // API not available yet         

                // Setup site visit in back office
                // cy.setupSiteVisitViaAPI(caseRef);

                // Validate site visit text in LPA dash board

                // validate site visit text in appellant dash board

                // Elapse site visit date through api call
                // cy.simulateSiteVisit(caseRef);
            }

            // Issue decision in back office

            // validate issued decision in back office

            // Validate issued decision in LPA dash board

            // Validate issued decision in appellant dash board

            // Validate issued decision in IP  dash board

            // Validate notification email.

            //Hearing booked flow to be added here

            //setupHearingViaApi
            // cy.setupHearingViaApi(caseRef);
            //addEstimateViaApi
            // cy.addEstimateViaApi(caseRef);

            //Inquiry booked flow to be added here


        });
    };
}