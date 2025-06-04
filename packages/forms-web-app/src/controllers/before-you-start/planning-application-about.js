const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { APPLICATION_ABOUT }
	}
} = require('../../lib/views');
const {
	constants: { APPEAL_ID }
} = require('@pins/business-rules');

exports.getApplicationAbout = (req, res) => {
	const { appeal } = req.session;
	res.render(APPLICATION_ABOUT, {
		appeal
	});
};

exports.postApplicationAbout = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const applicationAbout = body['application-about'];
	const answerArray = applicationAbout
		? Array.isArray(applicationAbout)
			? applicationAbout
			: [applicationAbout]
		: undefined;

	const isCASPlanning = answerArray?.includes('none_of_these');

	if (Object.keys(errors).length > 0) {
		res.render(APPLICATION_ABOUT, {
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					planningApplicationAbout: answerArray
				}
			},
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
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				...fullPlanningSwitch,
				planningApplicationAbout: answerArray
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(APPLICATION_ABOUT, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (answerArray?.includes('none_of_these')) {
		return res.redirect('/before-you-start/CAS-PLACEHOLDER'); // todo: handle entire path
	} else {
		res.redirect('/before-you-start/granted-or-refused'); // todo: handle appeal form generation
	}
};
