/** @type {import('express').RequestHandler} */
const yourNameGet = (req, res) => {
	// if (!req.session.interestedParty.appealNumber) {
	// To be discussed with design / team
	// }

	const interestedParty = req.session.interestedParty || {};

	res.render(`comment-planning-appeal/your-name/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const yourNamePost = async (req, res) => {
	const { 'first-name': firstName, 'last-name': lastName } = req.body;

	req.session.interestedParty.firstName = firstName;
	req.session.interestedParty.lastName = lastName;

	let errors = {};

	if (!firstName) {
		errors.firstName = {
			text: 'Enter your first name'
		};
	}

	if (!lastName) {
		errors.lastName = {
			text: 'Enter your last name'
		};
	}

	// if (!/^[0-9]{7}$/.exec(appealReference)) {
	// 	return res.render(`comment-planning-appeal/enter-appeal-reference/index`, {
	// 		error: { text: 'Enter the appeal reference using numbers 0 to 9', href: '#appeal-reference' },
	// 		value: appealReference
	// 	});
	// }

	if (Object.keys(errors).length) {
		return res.render(`comment-planning-appeal/your-name/index`, {
			errors,
			interestedParty: req.session.interestedParty
		});
	}

	return res.redirect(`email-address`);
};

module.exports = { yourNameGet, yourNamePost };
