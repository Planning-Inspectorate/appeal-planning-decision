const documents = {
    uploadAppealStmt: 'appeal-statement-valid.pdf',
    uploadApplicationForAppealCost: 'other-supporting-docs.pdf',
    uploadNewPlanOrDrawing: 'plans-drawings.jpeg',
    uploadOtherNewSupportDoc: 'other-supporting-docs.pdf',
    uploadSeparateOwnershipCertAndAgricultureDoc: 'draft-planning-obligation.pdf',
    uploadDesignAndAccessStmt: 'design-and-access-statement.pdf',
    uploadPlansDrawingAndSupportingDocs: 'plans-drawings-and-supporting-documents.pdf',
    uploadFinalisingDocReady: 'additional-final-comments-2.pdf',
    uploadFinalisingDocDraft: 'additional-final-comments-2.pdf',
    uploadDevelopmentDescription: 'additional-final-comments-1.pdf',
    uploadDecisionLetter: 'decision-letter.pdf',
    uploadPlanningApplConfirmLetter: 'letter-confirming-planning-application.pdf',
    uploadDraftStatementOfCommonGround: 'draft-statement-of-common-ground.pdf'
};
export const casPlanningAppealGrantedTestCases = [
    //this case is for CAS planning
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-development',
        selectAllPlanningApplicationAbout: false,
        endToEndIntegration: true,
        applicationForm: {
            isAppellant: true,
            // areaUnits: 'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            knowsAllOwners: 'no',
            knowsOtherOwners: 'yes',
            isAgriculturalHolding: false,
            isTenantAgricultureHolding: true,
            anyOtherTenants: true,
            majorMionorDevelopmentData: 'major',
            applicationAboutData: 'householder',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'written',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
            isApplyAwardCost: true,
            isSubmitDesignAndAccessStmt: true,
            isNewPlanOrDrawingAvailable: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }, {
            appealReferenceNumber: '7654321'
        }],
        finalComments: {
            check: false, // TODO: set these to true after feature flag introduced
            uploadAdditionalDocuments: false
        }
    },
    //this case is for Full planning
    {
        statusOfOriginalApplication: 'granted',
        typeOfDecisionRequested: 'written',
        statusOfPlanningObligation: 'in draft',
        typeOfPlanningApplication: 'answer-minor-commercial-development',
        selectAllPlanningApplicationAbout: true,
        applicationForm: {
            isAppellant: true,
            areaUnits: 'squaremeter',
            appellantInGreenBelt: true,
            isOwnsAllLand: false,
            isOwnsSomeLand: true,
            // knowsAllOwners: 'yes',
            knowsOtherOwners: 'no',
            isAgriculturalHolding: false,
            // isTenantAgricultureHolding : true,
            // anyOtherTenants: true,
            majorMionorDevelopmentData: 'other',
            applicationAboutData: 'mineralworkings',
            isInspectorNeedAccess: true,
            isAppellantSiteSafety: true,
            iaUpdateDevelopmentDescription: true,
            appellantProcedurePreference: 'hearing',
            anyOtherAppeals: true,
            isAppellantLinkedCaseAdd: false
        },
        uploadDocuments: {
            submitPlanningObligation: true,
            finalisedPlanningStatus: 'ready',
            haveSeparateOwnershipAndLandDecl: true,
            isApplyAwardCost: true,
            isSubmitDesignAndAccessStmt: true,
            isNewPlanOrDrawingAvailable: true,
            isOtherNewDocumentAvailable: true
        },
        documents,
        otherAppeals: [{
            appealReferenceNumber: '1234567'
        }, {
            appealReferenceNumber: '7654321'
        }],
        finalComments: {
            check: false, // TODO: set these to true after feature flag introduced
            uploadAdditionalDocuments: false
        }
    }
];