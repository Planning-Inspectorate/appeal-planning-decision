const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf'
  
};
export const houseHolderQuestionnaireTestCases = [
    {
        // statusOfOriginalApplication: 'granted',
        // typeOfDecisionRequested: 'written',
        // statusOfPlanningObligation: 'in draft',
        // typeOfPlanningApplication: 'answer-householder-planning',
       
        constraintsAndDesignations:{
            isCorrectTypeOfAppeal: true,
            affectListedBuildings: false,
            //listedBuildingEntry: '1234567',
            affectedListedBuildings: true,
            conservationArea: true,
            isGreenBelt: true,
        },
        notifyParties:{
            
        },
        consultResponseAndRepresent:{},
        poReportAndSupportDocs:{},
        siteAccess:{},
        appealProcess:{},
        submit:{}
    }
];