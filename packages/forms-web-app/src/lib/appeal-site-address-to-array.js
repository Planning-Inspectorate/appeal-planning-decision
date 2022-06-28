module.exports = (appeal) => {
	if (!appeal || !appeal.appealSiteSection || !appeal.appealSiteSection.siteAddress) {
		return [];
	}

	const address = [
		appeal.appealSiteSection.siteAddress.addressLine1,
		appeal.appealSiteSection.siteAddress.addressLine2,
		appeal.appealSiteSection.siteAddress.town,
		appeal.appealSiteSection.siteAddress.county,
		appeal.appealSiteSection.siteAddress.postcode
	];

	return address.filter((n) => n);
};
