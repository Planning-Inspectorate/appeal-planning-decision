jest.mock('../../src/lib/logger');

const logger = require('../../src/lib/logger');
const { QUESTIONNAIRE } = require('../../src/lib/empty-questionnaire');

const { empty: emptyQuestionnaire } = QUESTIONNAIRE;

const mockReq = (questionnaire = emptyQuestionnaire) => ({
  log: logger,
  session: {
    questionnaire,
  },
});

const mockRes = () => {
  const res = {};
  res.redirect = jest.fn();
  res.render = jest.fn();
  return res;
};

module.exports = {
  mockReq,
  mockRes,
};
