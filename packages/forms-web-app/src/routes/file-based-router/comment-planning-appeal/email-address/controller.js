/** @type {import('express').RequestHandler} */
const emailAddressGet = (req, res) => {
	// if (!req.session.interestedParty.appealNumber) {
	// To be discussed with design / team
	// }

	req.session.interestedParty.emailAddress = '';

	res.render(`comment-planning-appeal/email-address/index`);
};

/** @type {import('express').RequestHandler} */
const emailAddressPost = async (req, res) => {
	const { 'email-address': emailAddress } = req.body;

	if (emailAddress) {
		return res.render(`comment-planning-appeal/email-address/index`, {
			error: {
				text: 'Enter an email address in the correct format, like name@example.com',
				href: '#email-address'
			},
			value: emailAddress
		});
	}

	// if (!lastName) {
	// 	return res.render(`comment-planning-appeal/your-name/index`, {
	// 		error: { text: 'Enter your last name', href: '#last-name' },
	// 		value: lastName
	// 	});
	// }

	// if (!/^[0-9]{7}$/.exec(appealReference)) {
	// 	return res.render(`comment-planning-appeal/enter-appeal-reference/index`, {
	// 		error: { text: 'Enter the appeal reference using numbers 0 to 9', href: '#appeal-reference' },
	// 		value: appealReference
	// 	});
	// }

	req.session.interestedParty.emailAddress = emailAddress;

	return res.redirect(`add-comments`);
};

module.exports = { emailAddressGet, emailAddressPost };
