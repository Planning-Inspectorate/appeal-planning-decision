const {
	constants: { APPLICATION_DECISION }
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	validHouseholderPlanningPermissionStatusOptions
} = require('../../validators/eligibility/granted-or-refused-permission');
const config = require('../../config');

exports.getNoDecision = async (req, res) => {
	res.render(VIEW.ELIGIBILITY.NO_DECISION, { bannerHtmlOverride: config.betaBannerText });
};

exports.getGrantedOrRefusedPermissionOut = async (req, res) => {
	res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT, {
		bannerHtmlOverride: config.betaBannerText
	});
};

exports.getGrantedOrRefusedPermission = async (req, res) => {
	res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
		bannerHtmlOverride: config.betaBannerText,
		appeal: req.session.appeal
	});
};

const forwardPage = (permissionStatus) => {
	const status = {
		[APPLICATION_DECISION.GRANTED]: VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT,
		[APPLICATION_DECISION.REFUSED]: VIEW.ELIGIBILITY.DECISION_DATE,
		[APPLICATION_DECISION.NODECISIONRECEIVED]: VIEW.ELIGIBILITY.NO_DECISION,
		default: VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION
	};

	return status[permissionStatus] || status.default;
};

exports.forwardPage = forwardPage;

exports.postGrantedOrRefusedPermission = async (req, res) => {
	const { body } = req;
	const { appeal } = req.session;
	const { errors = {}, errorSummary = [] } = body;

	const planningPermissionStatus = body['granted-or-refused-permission'];
	let selectedPermissionStatus = null;

	if (validHouseholderPlanningPermissionStatusOptions.includes(planningPermissionStatus)) {
		selectedPermissionStatus = planningPermissionStatus.toLowerCase();
	}

	if (Object.keys(errors).length > 0) {
		res.render(forwardPage('default'), {
			bannerHtmlOverride: config.betaBannerText,
			appeal: {
				...appeal,
				eligibility: {
					...appeal.eligibility,
					planningPermissionStatus: selectedPermissionStatus
				}
			},
			errors,
			errorSummary
		});
		return;
	}

	try {
		req.session.appeal = await createOrUpdateAppeal({
			...appeal,
			eligibility: {
				...appeal.eligibility,
				planningPermissionStatus: selectedPermissionStatus
			}
		});
	} catch (e) {
		logger.error(e);

		res.render(forwardPage('default'), {
			bannerHtmlOverride: config.betaBannerText,
			appeal,
			errors,
			errorSummary: [{ text: e.toString(), href: '#' }]
		});
		return;
	}

	res.redirect(`/${forwardPage(selectedPermissionStatus)}`);
};
