/** @type {import('express').RequestHandler} */
const checkAnswersGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	if (!req.session.interestedParty?.firstName || !req.session.interestedParty?.lastName) {
		return res.redirect(`your-name`);
	}

	if (!req.session.interestedParty?.comments) {
		return res.redirect(`add-comments`);
	}

	const interestedParty = req.session.interestedParty;

	const ipSummaryList = formatIpSummaryList(interestedParty);

	res.render(`comment-planning-appeal/check-answers/index`, { interestedParty, ipSummaryList });
};

/** @type {import('express').RequestHandler} */
const checkAnswersPost = async (req, res) => {
	// const interestedParty = req.session.interestedParty;

	// const result = await req.appealsApiClient.submitInterestedPartyComment(interestedParty);

	// console.log(result)

	return res.redirect(`add-comments`);
};

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
