const pinsYup = require('../../../lib/pins-yup');

const document = () => {
	return pinsYup.object().shape({
		name: pinsYup.string().max(255).ensure().required(),
		originalFileName: pinsYup.string().max(255).ensure().required(),
		id: pinsYup.string().uuid().required(),
		horizonDocumentType: pinsYup.string().notRequired(),
		horizonDocumentGroupType: pinsYup.string().notRequired()
	});
};

module.exports = document;
