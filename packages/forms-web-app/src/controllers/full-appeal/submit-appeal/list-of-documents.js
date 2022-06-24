const logger = require('../../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { LIST_OF_DOCUMENTS: currentPage, TASK_LIST },
  },
  } = require('../../../lib/full-appeal/views');
const { postSaveAndReturn } = require('../../save');

  const getListOfDocuments = (req, res) => {
    res.render(currentPage, {
    });
  };

  const postListOfDocuments = async (req, res) => {
    const { body } = req;
    const { errors = {}, errorSummary = [] } = body;

    try {
      if (req.body['save-and-return'] !== '') {
        return res.redirect(`/${TASK_LIST}`);
      }
      return await postSaveAndReturn(req, res);
    } catch (e) {
      logger.error(e);
      return res.render(currentPage, {
        errors,
        errorSummary: [{ text: e.toString(), href: '#' }],
      });
    }
  };
  
  module.exports = {
    getListOfDocuments,
    postListOfDocuments,
  };