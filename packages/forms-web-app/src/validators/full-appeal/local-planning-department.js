const { body } = require('express-validator');
const { getDepartmentFromName } = require('../../services/department.service');

const rules = () => {
	return [
		body('local-planning-department')
			.custom((_value, { req }) => {
				const addedName = req.body['added-name'];
				if (!addedName) {
					throw new Error();
				}
				return true;
			})
			.withMessage('Enter the local planning authority')
			.bail(),
		body('local-planning-department')
			.custom(async (_value, { req }) => {
				const addedName = req.body['added-name'];
				const lpa = await getDepartmentFromName(addedName);
				if (!lpa) {
					throw new Error();
				}
				return true;
			})
			.withMessage('Enter a real local planning authority')
			.bail()
	];
};

module.exports = {
	rules
};
