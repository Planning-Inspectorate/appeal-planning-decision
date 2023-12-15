module.exports = {
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
