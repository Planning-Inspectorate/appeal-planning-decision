const pinsYup = require('../../../lib/pins-yup');

const document = () => {
	return pinsYup.object().shape({
		name: pinsYup.string().max(255).ensure(),
		originalFileName: pinsYup.string().max(255).ensure(),
		id: pinsYup.string().uuid().nullable().default(null),
		horizonDocumentType: pinsYup.string().notRequired(),
		horizonDocumentGroupType: pinsYup.string().notRequired()
	});
};

module.exports = document;
