const { CASE_TYPES } = require('../database/data-static');

/**
 * @param {string | undefined} appealTypeCode
 * @returns {boolean}
 */
const isEnforcementNotice = (appealTypeCode) =>
	appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode;

/**
 * @param {string | undefined} appealTypeCode
 * @returns {boolean}
 */
const isEnforcementListed = (appealTypeCode) =>
	appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode;

/**
 * @param {string | undefined} appealTypeCode
 * @returns {boolean}
 */
const isAnyEnforcement = (appealTypeCode) =>
	isEnforcementNotice(appealTypeCode) || isEnforcementListed(appealTypeCode);

/**
 * @param {string | undefined} appealTypeCode
 * @returns {boolean}
 */
const isLDC = (appealTypeCode) => appealTypeCode === CASE_TYPES.LDC.processCode;

/**
 * @param {string | undefined} appealTypeCode
 * @returns {boolean}
 */
const isAnyEnforcementOrLDC = (appealTypeCode) =>
	isLDC(appealTypeCode) || isAnyEnforcement(appealTypeCode);

module.exports = {
	isEnforcementNotice,
	isEnforcementListed,
	isAnyEnforcement,
	isLDC,
	isAnyEnforcementOrLDC
};
