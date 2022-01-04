const express = require('express');
const grantedOrRefusedController = require('../../controllers/full-appeal/granted-or-refused');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: householderPlanningApplicationStatusRules,
} = require('../../validators/full-appeal/granted-or-refused');

const router = express.Router();

router.get(
  '/granted-or-refused',
  fetchExistingAppealMiddleware,
  grantedOrRefusedController.getGrantedOrRefused
);

router.post(
  '/granted-or-refused',
  householderPlanningApplicationStatusRules(),
  validationErrorHandler,
  grantedOrRefusedController.postGrantedOrRefused
);

module.exports = router;
