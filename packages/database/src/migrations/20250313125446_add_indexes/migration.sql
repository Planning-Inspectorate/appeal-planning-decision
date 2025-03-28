BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE NONCLUSTERED INDEX [Appeal_legacyAppealSubmissionId_idx] ON [dbo].[Appeal]([legacyAppealSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCase_LPACode_idx] ON [dbo].[AppealCase]([LPACode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCase_casePublishedDate_idx] ON [dbo].[AppealCase]([casePublishedDate]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCase_caseDecisionOutcomeDate_idx] ON [dbo].[AppealCase]([caseDecisionOutcomeDate]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCase_siteAddressPostcodeSanitized_idx] ON [dbo].[AppealCase]([siteAddressPostcodeSanitized]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseListedBuilding_caseReference_idx] ON [dbo].[AppealCaseListedBuilding]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseListedBuilding_listedBuildingReference_idx] ON [dbo].[AppealCaseListedBuilding]([listedBuildingReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseLpaNotificationMethod_caseReference_idx] ON [dbo].[AppealCaseLpaNotificationMethod]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseLpaNotificationMethod_lPANotificationMethodsKey_idx] ON [dbo].[AppealCaseLpaNotificationMethod]([lPANotificationMethodsKey]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseRelationship_caseReference_idx] ON [dbo].[AppealCaseRelationship]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealCaseRelationship_caseReference2_idx] ON [dbo].[AppealCaseRelationship]([caseReference2]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealToUser_appealId_idx] ON [dbo].[AppealToUser]([appealId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealToUser_userId_idx] ON [dbo].[AppealToUser]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealToUser_role_idx] ON [dbo].[AppealToUser]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealUser_email_idx] ON [dbo].[AppealUser]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppealUser_lpaCode_idx] ON [dbo].[AppealUser]([lpaCode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantFinalCommentSubmission_caseReference_idx] ON [dbo].[AppellantFinalCommentSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantProofOfEvidenceSubmission_caseReference_idx] ON [dbo].[AppellantProofOfEvidenceSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseReference_idx] ON [dbo].[Document]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_publishedDocumentURI_idx] ON [dbo].[Document]([publishedDocumentURI]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Event_caseReference_idx] ON [dbo].[Event]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [InterestedPartySubmission_caseReference_idx] ON [dbo].[InterestedPartySubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAFinalCommentSubmission_caseReference_idx] ON [dbo].[LPAFinalCommentSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAProofOfEvidenceSubmission_caseReference_idx] ON [dbo].[LPAProofOfEvidenceSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAQuestionnaireSubmission_appealCaseReference_idx] ON [dbo].[LPAQuestionnaireSubmission]([appealCaseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAStatementSubmission_appealCaseReference_idx] ON [dbo].[LPAStatementSubmission]([appealCaseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [NeighbouringAddress_caseReference_idx] ON [dbo].[NeighbouringAddress]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Representation_caseReference_idx] ON [dbo].[Representation]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RepresentationDocument_representationId_idx] ON [dbo].[RepresentationDocument]([representationId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [RepresentationDocument_documentId_idx] ON [dbo].[RepresentationDocument]([documentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Rule6ProofOfEvidenceSubmission_caseReference_idx] ON [dbo].[Rule6ProofOfEvidenceSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Rule6StatementSubmission_caseReference_idx] ON [dbo].[Rule6StatementSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SecurityToken_appealUserId_idx] ON [dbo].[SecurityToken]([appealUserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_caseReference_idx] ON [dbo].[ServiceUser]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_emailAddress_idx] ON [dbo].[ServiceUser]([emailAddress]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_caseReference_emailAddress_serviceUserType_idx] ON [dbo].[ServiceUser]([caseReference], [emailAddress], [serviceUserType]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionAddress_questionnaireId_idx] ON [dbo].[SubmissionAddress]([questionnaireId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionAddress_appellantSubmissionId_idx] ON [dbo].[SubmissionAddress]([appellantSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_questionnaireId_idx] ON [dbo].[SubmissionDocumentUpload]([questionnaireId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_appellantSubmissionId_idx] ON [dbo].[SubmissionDocumentUpload]([appellantSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_lpaStatementId_idx] ON [dbo].[SubmissionDocumentUpload]([lpaStatementId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_appellantFinalCommentId_idx] ON [dbo].[SubmissionDocumentUpload]([appellantFinalCommentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_lpaFinalCommentId_idx] ON [dbo].[SubmissionDocumentUpload]([lpaFinalCommentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_appellantProofOfEvidenceId_idx] ON [dbo].[SubmissionDocumentUpload]([appellantProofOfEvidenceId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_lpaProofOfEvidenceId_idx] ON [dbo].[SubmissionDocumentUpload]([lpaProofOfEvidenceId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_rule6ProofOfEvidenceSubmissionId_idx] ON [dbo].[SubmissionDocumentUpload]([rule6ProofOfEvidenceSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionDocumentUpload_rule6StatementSubmissionId_idx] ON [dbo].[SubmissionDocumentUpload]([rule6StatementSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionLinkedCase_lPAQuestionnaireSubmissionId_idx] ON [dbo].[SubmissionLinkedCase]([lPAQuestionnaireSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionLinkedCase_appellantSubmissionId_idx] ON [dbo].[SubmissionLinkedCase]([appellantSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionListedBuilding_lPAQuestionnaireSubmissionId_idx] ON [dbo].[SubmissionListedBuilding]([lPAQuestionnaireSubmissionId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SubmissionListedBuilding_appellantSubmissionId_idx] ON [dbo].[SubmissionListedBuilding]([appellantSubmissionId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
