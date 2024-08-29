const hasAppealParams = require('../dynamic-forms/has-appeal-form/journey');
const hasQuestionnaireParams = require('../dynamic-forms/has-questionnaire/journey');
const s78AppealParams = require('../dynamic-forms/s78-appeal-form/journey');
const s78QuestionnaireParams = require('../dynamic-forms/s78-questionnaire/journey');

const { Journeys } = require('../dynamic-forms/journeys');

const journeys = new Journeys();

journeys.registerJourney(hasAppealParams);
journeys.registerJourney(hasQuestionnaireParams);
journeys.registerJourney(s78AppealParams);
journeys.registerJourney(s78QuestionnaireParams);

module.exports = { journeys };
