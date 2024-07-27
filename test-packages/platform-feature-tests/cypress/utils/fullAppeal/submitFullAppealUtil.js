import { fullAppealGrantedTestCases } from "./fullAppealGrantedData";
import { fullAppealNoDecisionTestCases } from "./fullAppealNoDecisionData";
import { fullAppealRefusedTestCases } from "./fullAppealRefusedData";

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
export const submitFullAppealTestCases =	[...fullAppealGrantedTestCases,...fullAppealRefusedTestCases,...fullAppealNoDecisionTestCases];

// To run only Refused test scenarios 
//export const submitFullAppealTestCases =	[...fullAppealRefusedTestCases];

// // To run only Granted test scenarios 
// export const submitFullAppealData =	[...fullAppealGrantedTestCases];

// // To run only No Decision test scenarios 
// export const submitFullAppealData =	[...fullAppealNoDecisionTestCases];


