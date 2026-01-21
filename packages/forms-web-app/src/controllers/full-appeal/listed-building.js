const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
	VIEW: {
		BEFORE_YOU_START: { LISTED_BUILDING }
	}
} = require('../../lib/views');
const {
	APPEAL_ID,
	TYPE_OF_PLANNING_APPLICATION: { LAWFUL_DEVELOPMENT_CERTIFICATE }
} = require('@pins/business-rules/src/constants');

const sectionName = 'eligibility';

const getListedBuilding = async (req, res) => {
	let {
		[sectionName]: { isListedBuilding }
	} = req.session.appeal;

	res.render(LISTED_BUILDING, {
		isListedBuilding
	});
};

const postListedBuilding = async (req, res) => {
	const { body } = req;
	const { errors = {}, errorSummary = [] } = body;
	const { appeal } = req.session;

	let isListedBuilding = null;

	if (body['listed-building'] === 'yes') {
		isListedBuilding = true;
	} else if (body['listed-building'] === 'no') {
		isListedBuilding = false;
	}

	if (Object.keys(errors).length > 0) {
		return res.render(LISTED_BUILDING, {
			isListedBuilding,
			errors,
			errorSummary
		});
	}

	if (appeal.typeOfPlanningApplication !== LAWFUL_DEVELOPMENT_CERTIFICATE) {
		appeal.appealType = isListedBuilding
			? APPEAL_ID.PLANNING_LISTED_BUILDING
			: appeal.eligibility.hasHouseholderPermissionConditions
				? APPEAL_ID.HOUSEHOLDER
				: APPEAL_ID.PLANNING_SECTION_78;
	}

	try {
		appeal[sectionName].isListedBuilding = isListedBuilding;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	} catch (err) {
		logger.error(err);

		return res.render(LISTED_BUILDING, {
			isListedBuilding,
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	if (appeal.typeOfPlanningApplication === LAWFUL_DEVELOPMENT_CERTIFICATE) {
		return isListedBuilding
			? res.redirect(`/before-you-start/granted-or-refused`)
			: res.redirect(`/before-you-start/can-use-service`);
	}

	return appeal.appealType === APPEAL_ID.HOUSEHOLDER
		? res.redirect(`/before-you-start/granted-or-refused-householder`)
		: res.redirect('/before-you-start/granted-or-refused');
};

module.exports = {
	getListedBuilding,
	postListedBuilding
};
