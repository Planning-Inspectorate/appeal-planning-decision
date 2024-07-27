const {
	confirmInterestedPartySessionAppealReference,
	getInterestedPartyFromSession,
	markInterestedPartySessionAsSubmitted
} = require('../../../../services/interested-party.service');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const checkAnswersGet = (req, res) => {
	if (!confirmInterestedPartySessionAppealReference(req)) {
		return res.redirect(`enter-appeal-reference`);
	}

	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	if (!interestedParty.firstName || !interestedParty.lastName) {
		return res.redirect(`your-name`);
	}

	if (!interestedParty.comments) {
		return res.redirect(`add-comments`);
	}

	const ipSummaryList = formatIpSummaryList(interestedParty);

	res.render(`comment-planning-appeal/check-answers/index`, { interestedParty, ipSummaryList });
};

/** @type {import('express').RequestHandler} */
const checkAnswersPost = async (req, res) => {
	// const interestedParty = getInterestedPartyFromSession(req);

	markInterestedPartySessionAsSubmitted(req);

	// const result = await req.appealsApiClient.submitInterestedPartyComment(interestedParty);

	return res.redirect(`comment-submitted`);
};

/**
 * @param {InterestedParty} interestedParty
 */
const formatIpSummaryList = (interestedParty) => {
	return [
		{
			key: {
				text: 'Your name'
			},
			value: {
				text: `${interestedParty.firstName} ${interestedParty.lastName}`
			},
			actions: {
				items: [
					{
						href: 'your-name',
						text: 'Change'
					}
				]
			}
		},
		{
			key: {
				text: 'Your address'
			},
			value: {
				text: formatIpAddress(interestedParty)
			},
			actions: {
				items: [
					{
						href: 'enter-address',
						text: 'Change'
					}
				]
			}
		},
		{
			key: {
				text: 'Your email'
			},
			value: {
				text: interestedParty.emailAddress || 'No email address supplied'
			},
			actions: {
				items: [
					{
						href: 'email-address',
						text: 'Change'
					}
				]
			}
		},
		{
			key: {
				text: 'Your comments'
			},
			value: {
				text: interestedParty.comments
			},
			actions: {
				items: [
					{
						href: 'add-comments',
						text: 'Change'
					}
				]
			}
		}
	];
};

/**
 * @param {InterestedParty} interestedParty
 */
const formatIpAddress = (interestedParty) => {
	if (!interestedParty.address) {
		return 'No address supplied';
	}

	const addressComponents = [
		interestedParty.address.addressLine1,
		interestedParty.address.addressLine2,
		interestedParty.address.townCity,
		interestedParty.address.county,
		interestedParty.address.postcode
	];

	return addressComponents.filter(Boolean).join(', ');
};

module.exports = { checkAnswersGet, checkAnswersPost };
