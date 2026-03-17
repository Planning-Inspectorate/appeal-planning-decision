const { createOrUpdateAppeal } = require('#lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { APPLICATION_DATE: currentPage }
	}
} = require('#lib/views');
const { parseISO, isValid } = require('date-fns');
const logger = require('#lib/logger');

const getApplicationDate = async (req, res) => {
	const { appeal } = req.session;

	const appealApplicationDate = parseISO(appeal.applicationDate);
	const applicationDate = isValid(appealApplicationDate) ? appealApplicationDate : null;

	res.render(currentPage, {
		applicationDate: applicationDate && {
			day: applicationDate.getDate().toString().padStart(2, '0'),
			month: (applicationDate?.getMonth() + 1).toString().padStart(2, '0'),
			year: String(applicationDate?.getFullYear())
		}
	});
};

const postApplicationDate = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	if (Object.keys(errors).length > 0) {
		return res.render(currentPage, {
			applicationDate: {
				day: body['application-date-day'],
				month: body['application-date-month'],
				year: body['application-date-year']
			},
			errors,
			errorSummary
		});
	}

	try {
		const enteredDate = new Date(
			body['application-date-year'],
			(parseInt(body['application-date-month'], 10) - 1).toString(),
			body['application-date-day']
		);

		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			applicationDate: enteredDate.toISOString()
		});

		return res.redirect(`/before-you-start/granted-or-refused`);
	} catch (e) {
		logger.error(e);

		return res.render(currentPage, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: 'application-date' }]
		});
	}
};

module.exports = { getApplicationDate, postApplicationDate };
