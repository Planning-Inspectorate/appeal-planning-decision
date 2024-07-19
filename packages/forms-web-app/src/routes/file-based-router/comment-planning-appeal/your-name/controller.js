/** @type {import('express').RequestHandler} */
const yourNameGet = (req, res) => {
	if (!req.session.interestedParty?.appealNumber) {
		return res.redirect(`enter-appeal-reference`);
	}

	const interestedParty = req.session.interestedParty || {};

	res.render(`comment-planning-appeal/your-name/index`, { interestedParty });
};

/** @type {import('express').RequestHandler} */
const yourNamePost = async (req, res) => {
	const { 'first-name': firstName, 'last-name': lastName } = req.body;

	req.session.interestedParty.firstName = firstName;
	req.session.interestedParty.lastName = lastName;

	let errors = {};
	let errorSummary = [];

	if (!firstName) {
		errors['first-name'] = {
			msg: 'Enter your first name',
			param: 'first-name'
		};
		errorSummary.push({
			text: 'Enter your first name',
			href: '#first-name'
		});
	}

	if (!lastName) {
		errors['last-name'] = {
			msg: 'Enter your last name',
			param: 'last-name'
		};
		errorSummary.push({
			text: 'Enter your last name',
			href: '#last-name'
		});
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
			errorSummary,
			interestedParty: req.session.interestedParty
		});
	}

	return res.redirect(`email-address`);
};

module.exports = { yourNameGet, yourNamePost };
