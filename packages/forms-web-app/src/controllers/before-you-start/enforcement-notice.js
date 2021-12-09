const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
  validEnforcementNoticeOptions,
} = require('../../validators/before-you-start/enforcement-notice');

exports.getEnforcementNotice = (req, res) => {
  res.render(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
    appeal: req.session.appeal,
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
    res.render(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
      appeal: {
        ...appeal,
        beforeYouStart: {
          ...appeal.beforeYouStart,
          enforcementNotice: hasReceivedEnforcementNotice,
        },
      },
      errors,
      errorSummary,
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

    res.render(VIEW.BEFORE_YOU_START.ENFORCEMENT_NOTICE, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  if (hasReceivedEnforcementNotice) {
    res.redirect(`/${VIEW.BEFORE_YOU_START.USE_A_DIFFERENT_SERVICE}`);
    return;
  }

  res.redirect(`/${VIEW.BEFORE_YOU_START.GRANTED_REFUSED_PERMISSION}`);
};
