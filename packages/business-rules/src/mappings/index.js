const { mapBopsToBeforeYouStart } = require('./bops-api/bops-before-you-start');

module.exports = {
	bops: {
		beforeYouStart: mapBopsToBeforeYouStart
	}
};
