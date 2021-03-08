const { VIEW } = require('../lib/views');

exports.getBeforeAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.BEFORE_APPEAL, {
    currentUrl: '/before-you-appeal',
    nextPage: {
      text: 'When you can appeal',
      url: '/when-you-can-appeal',
    },
    title: 'Before you appeal - Appeal a householder planning decision - GOV.UK',
  });
};

exports.getWhenAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.WHEN_APPEAL, {
    currentUrl: '/when-you-can-appeal',
    previousPage: {
      text: 'Before you appeal',
      url: '/before-you-appeal',
    },
    nextPage: {
      text: 'The stages of an appeal',
      url: '/stages-of-an-appeal',
    },
    title: 'When you can appeal - Appeal a householder planning decision - GOV.UK',
  });
};
