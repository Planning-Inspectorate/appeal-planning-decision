// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";

export class AppealProcess {
    _selectors = {
        nearbyAppealReference: '#nearbyAppealReference',
        newConditionsNewConditionDetails: '#newConditions_newConditionDetails',
        significantChangesLocalPlan: 'answer-local-plan',
        significantChangesNationalPolicy: 'answer-national-policy',
        significantChangesCourtJudgment: 'answer-court-judgment',
        significantChangesOther: 'answer-other',
        significantChangesNone: 'answer-none',
        significantChangesLocalPlanDetails: '#anySignificantChanges_localPlanSignificantChanges',
        significantChangesNationalPolicyDetails: '#anySignificantChanges_nationalPolicySignificantChanges',
        significantChangesCourtJudgmentDetails: '#anySignificantChanges_courtJudgementSignificantChanges',
        significantChangesOtherDetails: '#anySignificantChanges_otherSignificantChanges',
        answerWritten: 'answer-written',
        answerHearing: 'answer-hearing',
        answerInquiry: 'answer-inquiry',
        lpaPreferHearingDetails: 'lpaPreferHearingDetails',
        lpaProcedurePreferenceLpaPreferInquiryDuration: 'lpaProcedurePreference_lpaPreferInquiryDuration',
        lpaPreferInquiryDetails: 'lpaPreferInquiryDetails'
    }
    // LDC-specific: Procedure type
    selectLdcProcedureType(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.appealProcess?.ldcProcedureType) {
            cy.getByData(basePage?._selectors.answerYes).click();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
        }
        cy.advanceToNextPage();
    }

    // LDC-specific: Appeals near the site
    selectLdcWhyInquiry(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.appealProcess?.ldcWhyInquiry) {
            cy.getByData(basePage?._selectors.answerYes).click();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
        }
        cy.advanceToNextPage();
    }
    selectProcedureType(context, lpaManageAppealsData) {
        if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.written) {
            cy.getByData(this?._selectors.answerWritten).click();
            cy.advanceToNextPage();
        } else if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.hearing) {
            cy.getByData(this?._selectors.answerHearing).click();
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferHearingDetails).type(lpaManageAppealsData?.appealProcess?.lpaPreferHearingDetails)
            cy.advanceToNextPage();
        } else if (context?.appealProcess?.isProcedureType === lpaManageAppealsData?.inquiry) {
            cy.getByData(this?._selectors.answerInquiry).click();
            cy.get(this._selectors?.lpaProcedurePreferenceLpaPreferInquiryDuration).type(lpaManageAppealsData?.appealProcess?.lpaProcedurePreferenceLpaPreferInquiryDuration)
            cy.advanceToNextPage();
            cy.get(this._selectors?.lpaPreferInquiryDetails).type(lpaManageAppealsData?.appealProcess?.lpaPreferInquiryDetails)
            cy.advanceToNextPage();
        }
    };
    selectOngoingAppealsNextToSite(context, lpaManageAppealsData, appealType) {
        const basePage = new BasePage();
        if (context?.appealProcess?.isOngoingAppeals) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            this.selectNearbyAppeals(context, lpaManageAppealsData, appealType);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectNearbyAppeals(context, lpaManageAppealsData, appealType) {
        const basePage = new BasePage();
        if (context?.appealProcess?.isNearbyAppeals) {
            if (lpaManageAppealsData?.hasAppealType === appealType) {
                cy.getByData(basePage?._selectors.answerYes).click();
                cy.advanceToNextPage();
            }
            cy.get('body').then($body => {
                if ($body.find(`.govuk-fieldset__heading:contains(${lpaManageAppealsData?.appealProcess?.addAnotherAppeal})`).length > 0) {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.nearbyAppealReference).type(lpaManageAppealsData?.appealProcess?.nearByAppealReference);
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            });
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectNewConditions(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        cy.location('pathname').then((pathname) => {
            const isNewConditionsPage = pathname.includes('/appeal-process/new-conditions');

            cy.get('body').then(($body) => {
                const hasQuestion = $body
                    .find('.govuk-fieldset__heading')
                    .toArray()
                    .some((el) => /new conditions/i.test(el.textContent || ''));

                if (!isNewConditionsPage && !hasQuestion) {
                    return;
                }

                if (context?.appealProcess?.isNewConditions) {
                    cy.getByData(basePage?._selectors.answerYes).click();
                    cy.get(this._selectors?.newConditionsNewConditionDetails).type(
                        lpaManageAppealsData?.appealProcess?.conditionsAndDetails
                    );
                    cy.advanceToNextPage();
                } else {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            });
        });
    };

    selectSignificantChanges(context, lpaManageAppealsData) {
        const appealProcessData = lpaManageAppealsData?.appealProcess || {};
        const appealProcessContext = context?.appealProcess || {};
        const option = appealProcessContext?.significantChangesOption;

        const localPlanDetails = appealProcessData?.significantChangesLocalPlanDetails;
        const nationalPolicyDetails = appealProcessData?.significantChangesNationalPolicyDetails;
        const courtJudgmentDetails = appealProcessData?.significantChangesCourtJudgmentDetails;
        const otherDetails = appealProcessData?.significantChangesOtherDetails;

        const selectCheckboxWithDetails = (checkboxSelector, detailSelector, detailsText) => {
            cy.getByData(checkboxSelector).click();
            cy.get(detailSelector).type(detailsText);
        };

        cy.get('body').then(($body) => {
            const hasQuestion = $body
                .find('.govuk-fieldset__heading')
                .toArray()
                .some((el) => /significant changes that would affect the application/i.test(el.textContent || ''));

            if (!hasQuestion) {
                return;
            }

            // Supports both boolean flags and legacy option mode.
            const hasAnySignificantChanges =
                appealProcessContext?.anySignificantChangesCondition === true ||
                appealProcessContext?.isSignificantChanges === true ||
                option === 'local-plan' ||
                option === 'national-policy' ||
                option === 'court-judgment' ||
                option === 'other';

            if (!hasAnySignificantChanges) {
                cy.getByData(this._selectors.significantChangesNone).click();
                cy.advanceToNextPage();
                return;
            }

            const selectLocalPlan =
                option === 'local-plan' ||
                appealProcessContext?.isSignificantChangesLocalPlan === true;
            const selectNationalPolicy =
                option === 'national-policy' ||
                appealProcessContext?.isSignificantChangesNationalPolicy === true;
            const selectCourtJudgment =
                option === 'court-judgment' ||
                appealProcessContext?.isSignificantChangesCourtJudgment === true;
            const selectOther =
                option === 'other' ||
                appealProcessContext?.isSignificantChangesOther === true;

            if (selectLocalPlan) {
                selectCheckboxWithDetails(
                    this._selectors.significantChangesLocalPlan,
                    this._selectors.significantChangesLocalPlanDetails,
                    localPlanDetails
                );
            }

            if (selectNationalPolicy) {
                selectCheckboxWithDetails(
                    this._selectors.significantChangesNationalPolicy,
                    this._selectors.significantChangesNationalPolicyDetails,
                    nationalPolicyDetails
                );
            }

            if (selectCourtJudgment) {
                selectCheckboxWithDetails(
                    this._selectors.significantChangesCourtJudgment,
                    this._selectors.significantChangesCourtJudgmentDetails,
                    courtJudgmentDetails
                );
            }

            if (selectOther) {
                selectCheckboxWithDetails(
                    this._selectors.significantChangesOther,
                    this._selectors.significantChangesOtherDetails,
                    otherDetails
                );
            }

            const selectedCount =
                Number(selectLocalPlan) +
                Number(selectNationalPolicy) +
                Number(selectCourtJudgment) +
                Number(selectOther);

            if (selectedCount === 0) {
                // Keep behavior deterministic: if "yes path" is selected but no options are true,
                // choose local plan by default instead of submitting no answer.
                selectCheckboxWithDetails(
                    this._selectors.significantChangesLocalPlan,
                    this._selectors.significantChangesLocalPlanDetails,
                    localPlanDetails
                );
            }

            // Ensure none is not selected when specific options are chosen.
            cy.getByData(this._selectors.significantChangesNone).then(($noneCheckbox) => {
                if ($noneCheckbox.is(':checked') && selectedCount > 0) {
                    cy.wrap($noneCheckbox).click();
                }
            });

            cy.advanceToNextPage();
        });
    }
}
