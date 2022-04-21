const { VIEW } = require('../lib/views');

exports.getBeforeYouStartFirstPage = async (_, res) => {
  res.render(VIEW.BEFORE_YOU_START.FIRST_PAGE, {
    nextPage: '/before-you-start/local-planning-depart',
  });
};
