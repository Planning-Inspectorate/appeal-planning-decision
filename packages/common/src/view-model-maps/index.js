module.exports = {
	...require('./appeal-headline'),
	...require('../lib/format-appeal-details'),
	...require('../lib/format-appeal-documents'),
	...require('./sections'),
	...require('./rows'),
	...require('../lib/format-questionnaire-details')
};
