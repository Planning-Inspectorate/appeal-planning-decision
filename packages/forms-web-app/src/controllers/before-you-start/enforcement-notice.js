const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { ENFORCEMENT_NOTICE }
	}
} = require('../../lib/views');
const {
	validEnforcementNoticeOptions
} = require('../../validators/before-you-start/enforcement-notice');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');

exports.getEnforcementNotice = (req, res) => {
	const { appeal } = req.session;
	res.render(ENFORCEMENT_NOTICE, {
		appeal
	});
};

exports.postEnforcementNotice = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const isV2forEnforcement = await isLpaInFeatureFlag(
		appeal.lpaCode,
		FLAG.ENFORCEMENT_APPEAL_FORM_V2
	);

	let hasReceivedEnforcementNotice = null;
	if (validEnforcementNoticeOptions.includes(req.body['enforcement-notice'])) {
		hasReceivedEnforcementNotice = req.body['enforcement-notice'] === 'yes';
	}

	if (Object.keys(errors).length > 0) {
		res.render(ENFORCEMENT_NOTICE, {
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					enforcementNotice: hasReceivedEnforcementNotice
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
				enforcementNotice: hasReceivedEnforcementNotice
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(ENFORCEMENT_NOTICE, {
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	if (hasReceivedEnforcementNotice) {
		const redirectEnforcementUrl = isV2forEnforcement
			? 'enforcement-notice-listed-building'
			: 'use-existing-service-enforcement-notice';
		res.redirect(`/before-you-start/${redirectEnforcementUrl}`);
		return;
	}

	res.redirect('/before-you-start/application-number');
};
