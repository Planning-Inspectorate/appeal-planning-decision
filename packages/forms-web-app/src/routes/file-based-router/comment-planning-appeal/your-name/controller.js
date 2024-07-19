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

	if (firstName.length > 250) {
		errors['first-name'] = {
			msg: 'First name must be 250 characters or less',
			param: 'first-name'
		};
		errorSummary.push({
			text: 'First name must be 250 characters or less',
			href: '#first-name'
		});
	}

	if (lastName.length > 250) {
		errors['last-name'] = {
			msg: 'Last name must be 250 characters or less',
			param: 'last-name'
		};
		errorSummary.push({
			text: 'Last name must be 250 characters or less',
			href: '#last-name'
		});
	}

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
