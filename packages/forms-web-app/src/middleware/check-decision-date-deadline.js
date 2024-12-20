const { rules, validation } = require('@pins/business-rules');
const {
	VIEW: {
		FULL_APPEAL: { CANNOT_APPEAL: cannotAppealFP }
	}
} = require('../lib/full-appeal/views');
const {
	VIEW: {
		APPELLANT_SUBMISSION: { CANNOT_APPEAL: cannotAppealHAS }
	}
} = require('../lib/views');
const validationExclusionPages = ['/before-you-start', `/${cannotAppealFP}`, `/${cannotAppealHAS}`];

const setShutterPageProps = (req) => {
	const { appeal } = req.session;
	req.session.appeal.eligibility.appealDeadline =
		appeal.decisionDate &&
		rules.appeal.deadlineDate(
			new Date(appeal.decisionDate),
			appeal.appealType,
			appeal.eligibility.applicationDecision
		);

	const deadlinePeriod = rules.appeal.deadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	req.session.appeal.eligibility.appealPeriod = deadlinePeriod.description;
};

const isWithinExpiryPeriod = (appeal) => {
	return validation.appeal.decisionDate.isWithinDecisionDateExpiryPeriod(
		new Date(appeal.decisionDate),
		appeal.appealType,
		appeal.eligibility?.applicationDecision
	);
};

const checkDecisionDateDeadline = (req, res, next) => {
	const { appeal } = req.session;

	if (appeal && appeal.decisionDate) {
		const isInAllowList = validationExclusionPages.some((path) => req.originalUrl.includes(path));

		if (appeal.appealType && !isInAllowList) {
			if (!isWithinExpiryPeriod(appeal)) {
				setShutterPageProps(req);
				if (appeal.appealType === '1001') {
					res.redirect(`/${cannotAppealHAS}`);
				} else {
					res.redirect(`/${cannotAppealFP}`);
				}
				return;
			}
		}
	}

	next();
};

module.exports = checkDecisionDateDeadline;
