const { getDepartmentFromId } = require('../services/department.service');
const { getLPAById } = require('./appeals-api-wrapper');
const { isFeatureActive } = require('../featureFlag');

/**
 * @param {string} lpaCode this is ONS LPA code, i.e. E60000068
 * @param {string} featureFlag
 *
 * @returns {Promise<boolean>}
 */
exports.isLpaInFeatureFlag = async (lpaCode, featureFlag) => {
	const lpa = await getDepartmentFromId(lpaCode);
	const lpaCodePINS = lpa.lpaCode ?? (await getLPAById(lpa.id)).lpaCode; // fallback to lookup in case cached lpa doesn't have code
	return await isFeatureActive(featureFlag, lpaCodePINS);
};
