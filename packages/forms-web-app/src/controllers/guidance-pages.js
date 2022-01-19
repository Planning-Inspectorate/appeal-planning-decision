const { VIEW } = require('../lib/views');

exports.getBeforeAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.BEFORE_APPEAL, {
    currentUrl: '/before-you-appeal',
    nextPage: {
      text: 'When you can appeal',
      url: '/when-you-can-appeal',
    },
    title: 'Before you appeal - Appeal a planning decision - GOV.UK',
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
    title: 'When you can appeal - Appeal a planning decision - GOV.UK',
  });
};

exports.getStagesAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.STAGES_APPEAL, {
    currentUrl: '/stages-of-an-appeal',
    previousPage: {
      text: 'When you can appeal',
      url: '/when-you-can-appeal',
    },
    nextPage: {
      text: 'After you appeal',
      url: '/after-you-appeal',
    },
    title: 'Stages of an appeal - Appeal a planning decision - GOV.UK',
  });
};

exports.getAfterAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.AFTER_APPEAL, {
    currentUrl: '/after-you-appeal',
    previousPage: {
      text: 'The stages of an appeal',
      url: '/stages-of-an-appeal',
    },
    nextPage: {
      text: 'Start your appeal',
      url: '/start-your-appeal',
    },
    title: 'After you appeal - Appeal a planning decision - GOV.UK',
  });
};

exports.getStartAppeal = (_, res) => {
  res.render(VIEW.GUIDANCE_PAGES.START_APPEAL, {
    hideNavigation: true,
    title: 'Start your appeal - Appeal a planning decision - GOV.UK',
  });
};
