const { VIEW } = require('../../lib/views');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');

exports.getUseExistingServiceEnforcementNotice = async (req, res) => {
	const { appeal } = req.session;

	const isV2forEnforcement = await isLpaInFeatureFlag(
		appeal.lpaCode,
		FLAG.ENFORCEMENT_APPEAL_FORM_V2
	);

	res.render(VIEW.BEFORE_YOU_START.USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE, {
		acpLink: 'https://acp.planninginspectorate.gov.uk/',
		isV2forEnforcement
	});
};
