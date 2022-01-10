const { get } = require('./router-mock');
const { getDocument } = require('../../../src/controllers/document');

describe('routes/document', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/document');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/:appealOrQuestionnaireId/:documentId', getDocument);
  });
});
