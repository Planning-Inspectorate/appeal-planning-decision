const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { CONTACT_PLANNING_INSPECTORATE_DATE }
	}
} = require('../../lib/views');
const { getExampleDate } = require('../../dynamic-forms/questions-utils');
const { addDays, parseISO, isBefore, isValid } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const targetTimezone = 'Europe/London';

exports.getContactPlanningInspectorateDate = (req, res) => {
	const { appeal } = req.session;

	const contactPlanningInspectorateDate = parseISO(
		appeal.eligibility?.contactPlanningInspectorateDate
	);
	const planningInspectorateDate = isValid(contactPlanningInspectorateDate)
		? contactPlanningInspectorateDate
		: null;

	res.render(CONTACT_PLANNING_INSPECTORATE_DATE, {
		contactPlanningInspectorateDate: planningInspectorateDate && {
			day: `0${planningInspectorateDate?.getDate()}`.slice(-2),
			month: `0${planningInspectorateDate?.getMonth() + 1}`.slice(-2),
			year: String(planningInspectorateDate?.getFullYear())
		},
		hint: {
			contactPlanningInspectorateDate: `For example ${getExampleDate('past', 27)}`
		}
	});
};

exports.postContactPlanningInspectorateDate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		res.render(CONTACT_PLANNING_INSPECTORATE_DATE, {
			contactPlanningInspectorateDate: {
				day: body['contact-planning-inspectorate-date-day'],
				month: body['contact-planning-inspectorate-date-month'],
				year: body['contact-planning-inspectorate-date-year']
			},
			hint: {
				contactPlanningInspectorateDate: `For example ${getExampleDate('past', 27)}`
			},
			errors,
			errorSummary,
			focusErrorSummary: !!errors
		});
		return;
	}

	const contactPlanningInspectorateDate = new Date(body['contact-planning-inspectorate-date']);

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				contactPlanningInspectorateDate: contactPlanningInspectorateDate.toISOString()
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(CONTACT_PLANNING_INSPECTORATE_DATE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	const zonedEffectiveDate = utcToZonedTime(
		new Date(req.session.appeal.eligibility.enforcementEffectiveDate),
		targetTimezone
	);
	const extendedDeadline = addDays(zonedEffectiveDate, 6);
	const zonedContactPlanningInspectorateDate = utcToZonedTime(
		contactPlanningInspectorateDate,
		targetTimezone
	);

	if (
		isBefore(zonedContactPlanningInspectorateDate, zonedEffectiveDate) &&
		isBefore(new Date(), extendedDeadline)
	) {
		res.redirect('/before-you-start/can-use-service');
		return;
	}

	res.redirect('/before-you-start/cannot-appeal-enforcement');
};
