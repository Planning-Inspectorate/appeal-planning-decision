// todo: combine with packages/common/src/dynamic-forms/journey-types.js
// todo: move journeys/questions out of dynamic forms directory as dynamic forms should move to be a stand-alone package
// todo: this should be held in common so that it can be used in both the web app and the API
const hasAppealParams = require('../dynamic-forms/has-appeal-form/journey');
const hasQuestionnaireParams = require('../dynamic-forms/has-questionnaire/journey');
const s78AppealParams = require('../dynamic-forms/s78-appeal-form/journey');
const s78QuestionnaireParams = require('../dynamic-forms/s78-questionnaire/journey');
const s78AppellantFinalCommentsParams = require('../dynamic-forms/s78-appellant-final-comments/journey');
const s78AppellantProofEvidenceParams = require('../dynamic-forms/s78-appellant-proof-evidence/journey');
const s78LpaFinalCommentsParams = require('../dynamic-forms/s78-lpa-final-comments/journey');
const s78LpaStatementParams = require('../dynamic-forms/s78-lpa-statement/journey');
const s78LpaProofEvidenceParams = require('../dynamic-forms/s78-lpa-proof-evidence/journey');
const s78Rule6ProofEvidenceParams = require('../dynamic-forms/s78-rule-6-proof-evidence/journey');
const s78Rule6StatementParams = require('../dynamic-forms/s78-rule-6-statement/journey');
const s20AppealParams = require('../dynamic-forms/s20-appeal-form/journey');
const s20QuestionnaireParams = require('../dynamic-forms/s20-lpa-questionnaire/journey');
const casPlanningAppealForm = require('../dynamic-forms/cas-planning-appeal-form/journey');
const casPlanningQuestionnaireParams = require('../dynamic-forms/cas-planning-questionnaire/journey');
const advertsAppealForm = require('../dynamic-forms/adverts-appeal-form/journey');
const {
	casAdverts: casAdvertsQuestionnaireParams,
	adverts: advertsQuestionnaireParams
} = require('../dynamic-forms/adverts-questionnaire/journey');
const enforcementAppealParams = require('../dynamic-forms/enforcement-appeal-form/journey');
const enforcementQuestionnaireParams = require('../dynamic-forms/enforcement-questionnaire/journey');

const { Journeys } = require('@pins/dynamic-forms/src/journeys');

const journeys = new Journeys();

const commonParams = {
	defaultSection: 'appeal'
};

journeys.registerJourney({ ...commonParams, ...hasAppealParams });
journeys.registerJourney({ ...commonParams, ...hasQuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...s78AppealParams });
journeys.registerJourney({ ...commonParams, ...s78QuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...s78AppellantFinalCommentsParams });
journeys.registerJourney({ ...commonParams, ...s78AppellantProofEvidenceParams });
journeys.registerJourney({ ...commonParams, ...s78LpaFinalCommentsParams });
journeys.registerJourney({ ...commonParams, ...s78LpaStatementParams });
journeys.registerJourney({ ...commonParams, ...s78LpaProofEvidenceParams });
journeys.registerJourney({ ...commonParams, ...s78Rule6ProofEvidenceParams });
journeys.registerJourney({ ...commonParams, ...s78Rule6StatementParams });
journeys.registerJourney({ ...commonParams, ...s20AppealParams });
journeys.registerJourney({ ...commonParams, ...s20QuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...casPlanningAppealForm });
journeys.registerJourney({ ...commonParams, ...casPlanningQuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...casAdvertsQuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...advertsAppealForm });
journeys.registerJourney({ ...commonParams, ...advertsQuestionnaireParams });
journeys.registerJourney({ ...commonParams, ...enforcementAppealParams });
journeys.registerJourney({ ...commonParams, ...enforcementQuestionnaireParams });

module.exports = { journeys };
