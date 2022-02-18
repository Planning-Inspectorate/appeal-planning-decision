const {
  VIEW: {
    FULL_APPEAL: { ANY_OF_FOLLOWING: currentPage },
  },
} = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

const routeUserOption = (options) => {
  return typeof options === 'string' && options === 'none_of_these';
};
const pageLinks = {
  previousPage: '/before-you-start/type-of-planning-application',
  nextPage: '/before-you-start/granted-or-refused',
  shutterPage: '/before-you-start/use-a-different-service',
};

const getAnyOfFollowing = async (req, res) => {
  const { appeal } = req.session;

  res.render(currentPage, {
    applicationCategory: appeal.eligibility.applicationCategories,
    backLink: pageLinks.previousPage,
  });
};

const postAnyOfFollowing = async (req, res) => {
  const { appeal } = req.session;
  const { option, errors = {}, errorSummary = [] } = req.body;

  if (errors.option) {
    return res.render(currentPage, {
      applicationCategory: option,
      errors,
      errorSummary,
    });
  }

  appeal.eligibility.applicationCategories = option;

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    return res.render(currentPage, {
      applicationCategory: option,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      backLink: pageLinks.previousPage,
    });
  }

  const pagetoRedirect =
    routeUserOption(option) === true ? pageLinks.nextPage : pageLinks.shutterPage;

  return res.redirect(pagetoRedirect);
};

module.exports = {
  getAnyOfFollowing,
  postAnyOfFollowing,
};
