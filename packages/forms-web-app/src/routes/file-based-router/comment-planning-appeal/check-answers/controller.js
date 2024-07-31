const {
	confirmInterestedPartySessionCaseReference,
	getInterestedPartyFromSession,
	markInterestedPartySessionAsSubmitted
} = require('../../../../services/interested-party.service');
const logger = require('../../../../lib/logger');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const checkAnswersGet = (req, res) => {
	if (!confirmInterestedPartySessionCaseReference(req)) {
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
	/** @type {InterestedParty} */
	const interestedParty = getInterestedPartyFromSession(req);

	markInterestedPartySessionAsSubmitted(req);

	try {
		await req.appealsApiClient.submitInterestedPartySubmission(interestedParty);
	} catch (error) {
		logger.error(error);
	}

	return res.redirect(`comment-submitted`);
};

/**
 * @param {InterestedParty} interestedParty
 */
const formatIpSummaryList = (interestedParty) => {
	return [
		{
			key: {
				text: 'What is your name?'
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
				text: 'Address'
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
				text: 'Email'
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
	const addressComponents = [
		interestedParty.addressLine1,
		interestedParty.addressLine2,
		interestedParty.townCity,
		interestedParty.county,
		interestedParty.postcode
	].filter(Boolean);

	return addressComponents.length > 0 ? addressComponents.join(', ') : 'No address supplied';
};

module.exports = { checkAnswersGet, checkAnswersPost };
