const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { CONTACT_PLANNING_INSPECTORATE }
	}
} = require('../../lib/views');
const {
	validContactPlanningInspectorateOptions
} = require('../../validators/before-you-start/contact-planning-inspectorate');

exports.getContactPlanningInspectorate = (req, res) => {
	const { appeal } = req.session;
	res.render(CONTACT_PLANNING_INSPECTORATE, {
		appeal
	});
};

exports.postContactPlanningInspectorate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let hasContactedPlanningInspectorate = null;
	if (validContactPlanningInspectorateOptions.includes(req.body['contact-planning-inspectorate'])) {
		hasContactedPlanningInspectorate = req.body['contact-planning-inspectorate'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(CONTACT_PLANNING_INSPECTORATE, {
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					hasContactedPlanningInspectorate
				}
			},
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				hasContactedPlanningInspectorate
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(CONTACT_PLANNING_INSPECTORATE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasContactedPlanningInspectorate) {
		res.redirect('/before-you-start/contact-planning-inspectorate-date');
		return;
	}

	res.redirect('/before-you-start/cannot-appeal-enforcement');
};
