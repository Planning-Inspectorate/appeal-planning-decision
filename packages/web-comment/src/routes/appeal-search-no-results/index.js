const { appealSearchNoResults } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

exports.get = asyncHandler(appealSearchNoResults);
