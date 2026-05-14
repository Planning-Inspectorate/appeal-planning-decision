const { rules, constants } = require('@pins/business-rules');
const {
	calculateWithinDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-is-within-deadline-before-you-start');
const {
	calculateDeadlineFromBeforeYouStart
} = require('@pins/business-rules/src/utils/calculate-deadline-before-you-start');

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
		appeal.decisionDate && calculateDeadlineFromBeforeYouStart({ appeal });

	const deadlinePeriod = rules.appeal.deadlinePeriod(
		appeal.appealType,
		appeal.eligibility.applicationDecision
	);
	req.session.appeal.eligibility.appealPeriod = deadlinePeriod.description;
};

const checkDecisionDateDeadline = (req, res, next) => {
	const { appeal } = req.session;

	if (appeal && appeal.decisionDate) {
		const isInAllowList =
			validationExclusionPages.some((path) => req.originalUrl.includes(path)) &&
			!req.originalUrl.startsWith('/before-you-start/can-use-service');

		if (appeal.appealType && !isInAllowList) {
			if (!calculateWithinDeadlineFromBeforeYouStart({ appeal })) {
				setShutterPageProps(req);
				if (appeal.appealType === constants.APPEAL_ID.HOUSEHOLDER) {
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
