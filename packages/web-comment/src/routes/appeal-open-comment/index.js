const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { appealOpenComment } = require('./controller');

exports.get = asyncHandler(appealOpenComment);
