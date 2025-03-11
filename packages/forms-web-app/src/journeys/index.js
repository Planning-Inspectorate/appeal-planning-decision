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
const s20QuestionnaireParams = require('../dynamic-forms/s20-lpa-questionairre/journey');

const { Journeys } = require('../dynamic-forms/journeys');

const journeys = new Journeys();

journeys.registerJourney(hasAppealParams);
journeys.registerJourney(hasQuestionnaireParams);
journeys.registerJourney(s78AppealParams);
journeys.registerJourney(s78QuestionnaireParams);
journeys.registerJourney(s78AppellantFinalCommentsParams);
journeys.registerJourney(s78AppellantProofEvidenceParams);
journeys.registerJourney(s78LpaFinalCommentsParams);
journeys.registerJourney(s78LpaStatementParams);
journeys.registerJourney(s78LpaProofEvidenceParams);
journeys.registerJourney(s78Rule6ProofEvidenceParams);
journeys.registerJourney(s78Rule6StatementParams);
journeys.registerJourney(s20AppealParams);
journeys.registerJourney(s20QuestionnaireParams);

module.exports = { journeys };
