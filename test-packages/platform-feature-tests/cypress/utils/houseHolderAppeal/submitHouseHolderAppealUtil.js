import { houseHolderAppealGrantedTestCases } from "./houseHolderAppealGrantedData";
import { houseHolderAppealNoDecisionTestCases } from "./houseHolderAppealNoDecisionData";
import { houseHolderAppealRefusedTestCases } from "./houseHolderAppealRefusedData";

const documents = {
    uploadAppealStmt:'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost:'other-supporting-docs.pdf',
    uploadNewPlanOrDrawing:'plans-drawings.jpeg',
    uploadOtherNewSupportDoc:'other-supporting-docs.pdf',
    uploadSeparateOwnershipCertAndAgricultureDoc:'draft-planning-obligation.pdf',
    uploadDesignAndAccessStmt:'design-and-access-statement.pdf',
    uploadPlansDrawingAndSupportingDocs:'plans-drawings-and-supporting-documents.pdf',
    uploadFinalisingDocReady:'additional-final-comments-2.pdf',
    uploadFinalisingDocDraft:'additional-final-comments-2.pdf',
    uploadDevelopmentDescription:'additional-final-comments-1.pdf',
    uploadDecisionLetter:'decision-letter.pdf', 
    uploadPlanningApplConfirmLetter:'letter-confirming-planning-application.pdf'          
};
export const submitHouseHolderAppealTestCases=	[...houseHolderAppealRefusedTestCases,...houseHolderAppealGrantedTestCases,...houseHolderAppealNoDecisionTestCases]

// To run only Refused test scenarios 
//export const submitHouseHolderAppealTestCases=	[...houseHolderAppealRefusedTestCases]

// // To run only Granted test scenarios
// export const submitHouseHolderAppealTestCases=	[...houseHolderAppealGrantedTestCases]

// // To run only No decision test scenarios
// export const submitHouseHolderAppealTestCases=	[...houseHolderAppealNoDecisionTestCases]