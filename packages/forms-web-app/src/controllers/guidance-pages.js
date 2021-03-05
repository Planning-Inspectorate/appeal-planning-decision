const { VIEW } = require('../lib/views');

exports.getBeforeAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.BEFORE_APPEAL, {
    currentUrl: '/before-you-appeal',
    heading: 'Appeal a householder planning decision',
    nextPage: {
      text: 'When you can appeal',
      url: '/when-you-can-appeal',
    },
    title: 'Before you appeal - Appeal a householder planning decision - GOV.UK',
  });
};
