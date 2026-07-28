// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";

export class OriginalEvidence {
    _selectors = {
        listOfDocumentsBeforeDecision: '#listOfDocumentsBeforeDecision'
    }

    isQuestionPageVisible(questionRegex) {
        return cy.get('body').then(($body) => {
            return $body
                .find('.govuk-fieldset__heading')
                .toArray()
                .some((el) => questionRegex.test(el.textContent || ''));
        });
    }

    uploadIfPagePresent(uploadFileName) {
        cy.get('body').then(($body) => {
            if ($body.find('input[type="file"]').length > 0) {
                cy.uploadFileFromFixtureDirectories(uploadFileName);
                cy.advanceToNextPage();
            }
        });
    }

    getOriginalEvidenceConfig(context, lpaManageAppealsData) {
        return {
            ...(lpaManageAppealsData?.originalEvidence || {}),
            ...(context?.originalEvidence || {})
        };
    }

    getOriginalEvidenceUploads(context, lpaManageAppealsData, originalEvidenceConfig) {
        const fallbackUpload =
            lpaManageAppealsData?.documents?.uploadAppealStmt || 'appeal-statement-valid.pdf';

        return {
            designAccessUpload:
                context?.documents?.uploadDesignAccess ||
                context?.documents?.uploadDesignAccessStatement ||
                originalEvidenceConfig?.designAccessUpload ||
                lpaManageAppealsData?.documents?.uploadDesignAccessStatement ||
                fallbackUpload,
            plansAndDrawingsUpload:
                context?.documents?.uploadPlansAndDrawings ||
                context?.documents?.uploadPlansDrawings ||
                originalEvidenceConfig?.plansAndDrawingsUpload ||
                lpaManageAppealsData?.documents?.uploadPlansDrawings ||
                fallbackUpload,
            otherDocumentsUpload:
                context?.documents?.uploadOtherDocuments ||
                context?.documents?.uploadAdditionalDocuments ||
                originalEvidenceConfig?.otherDocumentsUpload ||
                lpaManageAppealsData?.documents?.uploadAdditionalDocuments ||
                fallbackUpload
        };
    }

    selectDesignAccessStatement(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        const config = this.getOriginalEvidenceConfig(context, lpaManageAppealsData);
        const uploads = this.getOriginalEvidenceUploads(context, lpaManageAppealsData, config);
        return this.isQuestionPageVisible(/design and access statement with the application/i).then(
            (isVisible) => {
                if (!isVisible) {
                    return;
                }

                if (config?.isDesignAccessStatement === true) {
                    cy.getByData(basePage?._selectors.answerYes).click();
                    cy.advanceToNextPage();
                    this.uploadIfPagePresent(uploads?.designAccessUpload);
                } else {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            }
        );
    }

    selectPlansAndDrawingsSubmitted(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        const config = this.getOriginalEvidenceConfig(context, lpaManageAppealsData);
        const uploads = this.getOriginalEvidenceUploads(context, lpaManageAppealsData, config);
        return this.isQuestionPageVisible(/plans and drawings with the application/i).then((isVisible) => {
            if (!isVisible) {
                return;
            }

            if (config?.isPlansAndDrawingsSubmitted === true) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
                this.uploadIfPagePresent(uploads?.plansAndDrawingsUpload);
            } else {
                cy.getByData(basePage?._selectors.answerNo).click();
                cy.advanceToNextPage();
            }
        });
    }

    selectOtherDocumentsSubmitted(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        const config = this.getOriginalEvidenceConfig(context, lpaManageAppealsData);
        const uploads = this.getOriginalEvidenceUploads(context, lpaManageAppealsData, config);
        return this.isQuestionPageVisible(/any other documents with the application/i).then((isVisible) => {
            if (!isVisible) {
                return;
            }

            if (config?.isOtherDocumentsSubmitted === true) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
                this.uploadIfPagePresent(uploads?.otherDocumentsUpload);
            } else {
                cy.getByData(basePage?._selectors.answerNo).click();
                cy.advanceToNextPage();
            }
        });
    }

    selectListOfDocumentsBeforeDecision(context, lpaManageAppealsData) {
        const config = this.getOriginalEvidenceConfig(context, lpaManageAppealsData);
        const listOfDocumentsText =
            config?.listOfDocumentsBeforeDecision ||
            'Officer report, approved plans, consultation responses and decision notice.';

        cy.get('body').then(($body) => {
            const hasListField =
                $body.find(this._selectors.listOfDocumentsBeforeDecision).length > 0 ||
                $body.find('textarea[name="listOfDocumentsBeforeDecision"]').length > 0;

            if (!hasListField) {
                return;
            }

            if ($body.find(this._selectors.listOfDocumentsBeforeDecision).length > 0) {
                cy.get(this._selectors.listOfDocumentsBeforeDecision).type(listOfDocumentsText);
            } else {
                cy.get('textarea[name="listOfDocumentsBeforeDecision"]').type(listOfDocumentsText);
            }

            cy.advanceToNextPage();
        });
    }
}