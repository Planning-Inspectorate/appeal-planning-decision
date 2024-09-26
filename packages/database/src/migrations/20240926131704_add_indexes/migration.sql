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
CREATE NONCLUSTERED INDEX [AppealToUser_role_idx] ON [dbo].[AppealToUser]([role]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantFinalCommentSubmission_caseReference_idx] ON [dbo].[AppellantFinalCommentSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [AppellantSubmission_submitted_updatedAt_idx] ON [dbo].[AppellantSubmission]([submitted], [updatedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_caseReference_idx] ON [dbo].[Document]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Document_publishedDocumentURI_idx] ON [dbo].[Document]([publishedDocumentURI]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Event_caseReference_idx] ON [dbo].[Event]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [InterestedPartyComment_caseReference_idx] ON [dbo].[InterestedPartyComment]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [InterestedPartySubmission_caseReference_idx] ON [dbo].[InterestedPartySubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAFinalCommentSubmission_caseReference_idx] ON [dbo].[LPAFinalCommentSubmission]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAQuestionnaireSubmission_appealCaseReference_idx] ON [dbo].[LPAQuestionnaireSubmission]([appealCaseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [LPAStatementSubmission_appealCaseReference_idx] ON [dbo].[LPAStatementSubmission]([appealCaseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [NeighbouringAddress_caseReference_idx] ON [dbo].[NeighbouringAddress]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Oidc_userCode_idx] ON [dbo].[Oidc]([userCode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Oidc_uid_idx] ON [dbo].[Oidc]([uid]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Oidc_grantId_idx] ON [dbo].[Oidc]([grantId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Rule6Party_appealUserId_idx] ON [dbo].[Rule6Party]([appealUserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Rule6Party_caseReference_idx] ON [dbo].[Rule6Party]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [SecurityToken_appealUserId_idx] ON [dbo].[SecurityToken]([appealUserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_caseReference_idx] ON [dbo].[ServiceUser]([caseReference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ServiceUser_caseReference_serviceUserType_idx] ON [dbo].[ServiceUser]([caseReference], [serviceUserType]);

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
