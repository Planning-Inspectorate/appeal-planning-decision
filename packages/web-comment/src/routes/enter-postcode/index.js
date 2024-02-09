const { enterPostcodeGet, enterPostcodePost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

exports.get = asyncHandler(enterPostcodeGet);
exports.post = asyncHandler(enterPostcodePost);
