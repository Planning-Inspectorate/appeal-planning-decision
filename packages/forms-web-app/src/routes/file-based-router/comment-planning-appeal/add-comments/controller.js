/** @type {import('express').RequestHandler} */
const addCommentsGet = (req, res) => {
	// if (!req.session.interestedParty.appealNumber) {
	// To be discussed with design / team
	// }

	res.render(`comment-planning-appeal/add-comments/index`);
};

/** @type {import('express').RequestHandler} */
const addCommentsPost = async (req, res) => {
	// const { 'first-name': firstName, 'last-name': lastName } = req.body;

	// if (!firstName) {
	// 	return res.render(`comment-planning-appeal/your-name/index`, {
	// 		error: { text: 'Enter your first name', href: '#first-name' },
	// 		value: firstName
	// 	});
	// }

	// if (!lastName) {
	// 	return res.render(`comment-planning-appeal/your-name/index`, {
	// 		error: { text: 'Enter your last name', href: '#last-name' },
	// 		value: lastName
	// 	});
	// }

	// // if (!/^[0-9]{7}$/.exec(appealReference)) {
	// // 	return res.render(`comment-planning-appeal/enter-appeal-reference/index`, {
	// // 		error: { text: 'Enter the appeal reference using numbers 0 to 9', href: '#appeal-reference' },
	// // 		value: appealReference
	// // 	});
	// // }

	// req.session.interestedParty.firstName = firstName;
	// req.session.interestedParty.lastName = lastName;

	return res.redirect(`comment-planning-appeal/add-comments/index`);
};

module.exports = { addCommentsGet, addCommentsPost };
