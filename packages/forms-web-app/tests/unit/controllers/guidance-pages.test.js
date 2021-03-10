const guidancePagesController = require('../../../src/controllers/guidance-pages');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

describe('controllers/appellant-submission/appeal-statement', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    jest.resetAllMocks();
  });

  describe('getBeforeAppeal', () => {
    it('should call the correct template', async () => {
      await guidancePagesController.getBeforeAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.GUIDANCE_PAGES.BEFORE_APPEAL, {
        currentUrl: '/before-you-appeal',
        nextPage: {
          text: 'When you can appeal',
          url: '/when-you-can-appeal',
        },
        title: 'Before you appeal - Appeal a householder planning decision - GOV.UK',
      });
    });
  });

  describe('getWhenAppeal', () => {
    it('should call the correct template', async () => {
      await guidancePagesController.getWhenAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.GUIDANCE_PAGES.WHEN_APPEAL, {
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
    });
  });

  describe('getAfterAppeal', () => {
    it('should call the correct template', async () => {
      await guidancePagesController.getAfterAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.GUIDANCE_PAGES.AFTER_APPEAL, {
        currentUrl: '/after-you-appeal',
        previousPage: {
          text: 'The stages of an appeal',
          url: '/stages-of-an-appeal',
        },
        nextPage: {
          text: 'Start your appeal',
          url: '/start-your-appeal',
        },
        title: 'After you appeal - Appeal a householder planning decision - GOV.UK',
      });
    });
  });

  describe('getStagesAppeal', () => {
    it('should call the correct template', async () => {
      await guidancePagesController.getStagesAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.GUIDANCE_PAGES.STAGES_APPEAL, {
        currentUrl: '/stages-of-an-appeal',
        previousPage: {
          text: 'When you can appeal',
          url: '/when-you-can-appeal',
        },
        nextPage: {
          text: 'After you appeal',
          url: '/after-you-appeal',
        },
        title: 'Stages of an appeal - Appeal a householder planning decision - GOV.UK',
      });
    });
  });

  describe('getStartAppeal', () => {
    it('should call the correct template', async () => {
      await guidancePagesController.getStartAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.GUIDANCE_PAGES.START_APPEAL, {
        hideNavigation: true,
        title: 'Start your appeal - Appeal a householder planning decision - GOV.UK',
      });
    });
  });
});
