const {
	getInterestedPartyFromSession,
	getInterestedPartySubmissionFromSession,
	markInterestedPartySessionAsSubmitted
} = require('../../../../services/interested-party.service');
const logger = require('../../../../lib/logger');
const { capitalize } = require('@pins/dynamic-forms/src/lib/string-functions');

/**
 * @typedef {import('../../../../services/interested-party.service').InterestedParty} InterestedParty
 */

/** @type {import('express').RequestHandler} */
const checkAnswersGet = (req, res) => {
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
	const interestedPartySubmission = getInterestedPartySubmissionFromSession(req);

	try {
		await req.appealsApiClient.submitInterestedPartySubmission(interestedPartySubmission);
	} catch (error) {
		logger.error(error);
	}

	markInterestedPartySessionAsSubmitted(req);

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
				text: 'Email address'
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
		},
		{
			key: {
				text: 'Documents to support your comment'
			},
			value: {
				text: capitalize(interestedParty.hasDocumentsToSupportComment)
			},
			actions: {
				items: [
					{
						href: 'documents-to-support',
						text: 'Change'
					}
				]
			}
		},
		interestedParty.uploadedFiles?.length > 0 &&
		interestedParty.hasDocumentsToSupportComment === 'yes'
			? {
					key: {
						text: 'Supporting documents'
					},
					value: {
						html: interestedParty.uploadedFiles
							.map(
								(file) =>
									`<a href="/document/${file.id}" class="govuk-link">${file.originalFileName}</a>`
							)
							.join('<br/>')
					},
					actions: {
						items: [
							{
								href: 'documents-upload',
								text: 'Change'
							}
						]
					}
				}
			: undefined
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
