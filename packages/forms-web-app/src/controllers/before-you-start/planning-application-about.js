const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_ABOUT }
	}
} = require('../../lib/views');
const {
	constants: { APPEAL_ID, APPLICATION_ABOUT: appAboutOptions, APPLICATION_ABOUT_LABELS }
} = require('@pins/business-rules');

/**
 * @type {import('express').RequestHandler}
 */
exports.getApplicationAbout = (req, res) => {
	const { appeal } = req.session;

	render(res, appeal, appeal.eligibility?.planningApplicationAbout || []);
};

/**
 * @type {import('express').RequestHandler}
 */
exports.postApplicationAbout = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const applicationAbout = body['planningApplicationAbout'];
	const answerArray = applicationAbout
		? Array.isArray(applicationAbout)
			? applicationAbout
			: [applicationAbout]
		: [];

	const isCASPlanning = answerArray?.includes(appAboutOptions.NON_OF_THESE);

	if (Object.keys(errors).length > 0) {
		render(res, appeal, answerArray, {
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	try {
		let fullPlanningSwitch = {
			appealType: APPEAL_ID.PLANNING_SECTION_78
		};
		if (isCASPlanning) fullPlanningSwitch = {}; // keep as CAS planning appeal

		// Update the appeal with the application about answers
		const update = {
			...appeal,
			eligibility: {
				...appeal.eligibility,
				planningApplicationAbout: answerArray
			},
			...fullPlanningSwitch
		};

		req.session.appeal = await createOrUpdateAppeal(update);
	} catch (e) {
		logger.error(e);

		render(res, appeal, answerArray, {
			errors,
			errorSummary: [{ text: 'Unable to save answers', href: '#' }]
		});
		return;
	}

	res.redirect('/before-you-start/granted-or-refused');
};

/**
 * @param {import('express').Response} res
 * @param {any} appeal
 * @param {Array<string>} answers
 * @param {any} [additionalRenderParams]
 */
const render = (res, appeal, answers, additionalRenderParams = {}) => {
	res.render(APPLICATION_ABOUT, {
		appeal,
		APPLICATION_ABOUT: appAboutOptions,
		APPLICATION_ABOUT_LABELS,
		planningApplicationAbout: answers,
		...additionalRenderParams
	});
};
