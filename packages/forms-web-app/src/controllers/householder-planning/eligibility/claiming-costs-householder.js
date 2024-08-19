const logger = require('../../../lib/logger');
const { createOrUpdateAppeal, getLPAById } = require('../../../lib/appeals-api-wrapper');
const { isFeatureActive } = require('../../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { getDepartmentFromId } = require('../../../services/department.service');

const {
	VIEW: {
		HOUSEHOLDER_PLANNING: {
			ELIGIBILITY: { CLAIMING_COSTS: claimingCosts }
		}
	}
} = require('../../../lib/views');

const nextPage = `/before-you-start/can-use-service`;

// NOTE - this questions is skipped if using v2
exports.getClaimingCostsHouseholder = async (req, res) => {
	const { appeal } = req.session;

	// skip this question if using v2
	const lpa = await getDepartmentFromId(appeal.lpaCode);
	const lpaCode = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code
	const usingV2Form = await isFeatureActive(FLAG.HAS_QUESTIONNAIRE, lpaCode);

	if (usingV2Form) {
		return res.redirect(nextPage);
	}

	res.render(claimingCosts, {
		isClaimingCosts: appeal.eligibility.isClaimingCosts
	});
};

const redirect = (selection, res) => {
	if (selection === 'yes') {
		res.redirect(`/before-you-start/use-existing-service-costs`);
		return;
	}

	res.redirect(nextPage);
};

exports.postClaimingCostsHouseholder = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	const selection = body['claiming-costs-householder'];

	if (errors['claiming-costs-householder']) {
		return res.render(claimingCosts, {
			isClaimingCosts: appeal.eligibility.isClaimingCosts,
			errors,
			errorSummary
		});
	}

	appeal.eligibility = {
		...appeal.eligibility,
		isClaimingCosts: selection === 'yes'
	};

	try {
		req.session.appeal = await createOrUpdateAppeal(appeal);
		return redirect(selection, res);
	} catch (e) {
		logger.error(e);

		return res.render(claimingCosts, {
			isClaimingCosts: appeal.eligibility.isClaimingCosts,
			errors,
			errorSummary: [{ text: e.toString(), href: 'pageId' }]
		});
	}
};
