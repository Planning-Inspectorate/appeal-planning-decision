const { enterAppealReferenceGet, enterAppealReferencePost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

exports.get = asyncHandler(enterAppealReferenceGet);
exports.post = asyncHandler(enterAppealReferencePost);
