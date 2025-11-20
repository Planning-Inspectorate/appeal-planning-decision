const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_EFFECTIVE_DATE }
	}
} = require('../../lib/views');
const { getExampleDate } = require('../../dynamic-forms/questions-utils');
const { parseISO, isAfter, isValid } = require('date-fns');

exports.getEnforcementEffectiveDate = (req, res) => {
	const { appeal } = req.session;

	const enforcementEffectiveDate = parseISO(appeal.eligibility?.enforcementEffectiveDate);
	const effectiveDate = isValid(enforcementEffectiveDate) ? enforcementEffectiveDate : null;

	res.render(ENFORCEMENT_EFFECTIVE_DATE, {
		enforcementEffectiveDate: effectiveDate && {
			day: `0${effectiveDate?.getDate()}`.slice(-2),
			month: `0${effectiveDate?.getMonth() + 1}`.slice(-2),
			year: String(effectiveDate?.getFullYear())
		},
		hint: {
			enforcementEffectiveDate: `For example ${getExampleDate('future', 27)}`
		}
	});
};

exports.postEnforcementEffectiveDate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		res.render(ENFORCEMENT_EFFECTIVE_DATE, {
			enforcementEffectiveDate: {
				day: body['enforcement-effective-date-day'],
				month: body['enforcement-effective-date-month'],
				year: body['enforcement-effective-date-year']
			},
			hint: {
				enforcementEffectiveDate: `For example ${getExampleDate('future', 27)}`
			},
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	const enforcementEffectiveDate = new Date(body['enforcement-effective-date']);

	const effectiveDateIsInFuture = isAfter(enforcementEffectiveDate, new Date());

	try {
		const eligibility = {
			...appeal.eligibility,
			enforcementEffectiveDate: enforcementEffectiveDate.toISOString()
		};

		// nullify contacted PINS fields if previously set & effective date in future
		// eg if appellant previously set effective date in past then changes to future
		if (effectiveDateIsInFuture && eligibility.hasContactedPlanningInspectorate) {
			eligibility.hasContactedPlanningInspectorate = null;
			eligibility.contactPlanningInspectorateDate = null;
		}

		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility
		});
	} catch (e) {
		logger.error(e);

		res.render(ENFORCEMENT_EFFECTIVE_DATE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	// TODO: both redirect URLs are placeholders for later tickets
	if (effectiveDateIsInFuture) {
		res.redirect('/before-you-start/can-use-service');
		return;
	}

	res.redirect('/before-you-start/contact-planning-inspectorate');
};
