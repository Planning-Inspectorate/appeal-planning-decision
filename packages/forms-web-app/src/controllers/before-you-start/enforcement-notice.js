const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  VIEW: {
    BEFORE_YOU_START: {
      ENFORCEMENT_NOTICE: currentPage,
      GRANTED_REFUSED_PERMISSION: nextPage,
      TYPE_OF_PLANNING_APPLICATION: previousPage,
      USE_A_DIFFERENT_SERVICE: shutterPage,
    },
  },
} = require('../../lib/views');
const {
  validEnforcementNoticeOptions,
} = require('../../validators/before-you-start/enforcement-notice');

exports.getEnforcementNotice = (req, res) => {
  res.render(currentPage, {
    appeal: req.session.appeal,
    previousPage: `/${previousPage}`,
  });
};

exports.postEnforcementNotice = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  let hasReceivedEnforcementNotice = null;
  if (validEnforcementNoticeOptions.includes(req.body['enforcement-notice'])) {
    hasReceivedEnforcementNotice = req.body['enforcement-notice'] === 'yes';
  }

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      appeal: {
        ...appeal,
        beforeYouStart: {
          ...appeal.beforeYouStart,
          enforcementNotice: hasReceivedEnforcementNotice,
        },
      },
      errors,
      errorSummary,
      previousPage: `/${previousPage}`,
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      beforeYouStart: {
        ...appeal.beforeYouStart,
        enforcementNotice: hasReceivedEnforcementNotice,
      },
    });
  } catch (e) {
    logger.error(e);

    res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      previousPage: `/${previousPage}`,
    });
    return;
  }

  if (hasReceivedEnforcementNotice) {
    res.redirect(`/${shutterPage}`);
    return;
  }

  res.redirect(`/${nextPage}`);
};
