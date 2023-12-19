/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

module.exports = {
	/**
	 * @param {AppealCaseWithAppellant} appeal
	 * @returns {string}
	 */
	formatAddress: (appeal) => {
		const addressComponents = [
			appeal.siteAddressLine1,
			appeal.siteAddressLine2,
			appeal.siteAddressTown,
			appeal.siteAddressPostcode
		];

		return addressComponents.filter(Boolean).join(', ');
	}
};
