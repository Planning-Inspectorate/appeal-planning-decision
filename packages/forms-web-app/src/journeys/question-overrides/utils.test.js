const { getQuestions } = require('../../dynamic-forms/questions.js');
const { createAppealSiteGridReferenceLink } = require('./utils.js');
const questions = getQuestions();

describe('createAppealSiteGridReferenceLink', () => {
	const section = {
		name: 'Prepare appeal',
		segment: 'prepare-appeal',
		questions: [questions.appealSiteGridReference, questions.appealSiteAddress]
	};
	const journey = {
		section,
		getCurrentQuestionUrl: () => {
			return '';
		}
	};

	it('creates AppealSiteGridReferenceLink for site address question', () => {
		journey.getCurrentQuestionUrl = () => {
			return '/appeals/adverts/prepare-appeal/appeal-site-address?id=8d5ab0f5-e87a-43aa-a8c1-09a631e7f8ef';
		};
		expect(createAppealSiteGridReferenceLink('siteAddress', journey, section)).toEqual(
			'/appeals/adverts/prepare-appeal/grid-reference?id=8d5ab0f5-e87a-43aa-a8c1-09a631e7f8ef'
		);
	});
	it('creates AppealSiteGridReferenceLink for grid reference question', () => {
		journey.getCurrentQuestionUrl = () => {
			return '/appeals/adverts/prepare-appeal/grid-reference?id=8d5ab0f5-e87a-43aa-a8c1-09a631e7f8ef';
		};
		expect(createAppealSiteGridReferenceLink('gridReference', journey, section)).toEqual(
			'/appeals/adverts/prepare-appeal/appeal-site-address?id=8d5ab0f5-e87a-43aa-a8c1-09a631e7f8ef'
		);
	});
	it('returns undefined for other question', () => {
		journey.getCurrentQuestionUrl = () => {
			return '/appeals/adverts/prepare-appeal/grid-reference?id=8d5ab0f5-e87a-43aa-a8c1-09a631e7f8ef';
		};
		expect(createAppealSiteGridReferenceLink('test', journey, section)).toEqual(undefined);
	});
});
