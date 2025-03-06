const express = require('express');
const {
	userPost,
	userSearch,
	userGet,
	userUpdate,
	userDelete,
	userLink,
	r6UserUnlink,
	userIsRule6User
} = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');

router.post('/', openApiValidatorMiddleware(), asyncHandler(userPost));
router.get('/', openApiValidatorMiddleware(), asyncHandler(userSearch));
router.get('/:userLookup', openApiValidatorMiddleware(), asyncHandler(userGet));
router.patch('/:userLookup', openApiValidatorMiddleware(), asyncHandler(userUpdate));
router.delete('/:userLookup', openApiValidatorMiddleware(), asyncHandler(userDelete));
router.get('/:userLookup/isRule6User', openApiValidatorMiddleware(), asyncHandler(userIsRule6User));

// todo: move this
router.post('/:userLookup/appeal/:appealId', openApiValidatorMiddleware(), asyncHandler(userLink));
router.delete(
	'/:userLookup/appeal/:appealId/unlinkRule6',
	openApiValidatorMiddleware(),
	asyncHandler(r6UserUnlink)
);

module.exports = { router };
