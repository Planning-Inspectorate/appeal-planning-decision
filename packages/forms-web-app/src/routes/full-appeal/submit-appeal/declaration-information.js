const express = require('express');

const fetchAppealByUrlParam = require('../../../middleware/fetch-appeal-by-url-param');
const declarationInformationController = require('../../../controllers/full-appeal/submit-appeal/declaration-information');

const router = express.Router();

router.get(
  '/submit-appeal/declaration-information/:appealId',
  [fetchAppealByUrlParam('appealId')],
  declarationInformationController.getDeclarationInformation
);

module.exports = router;
