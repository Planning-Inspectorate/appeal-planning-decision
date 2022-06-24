const logger = require('../../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { LIST_OF_DOCUMENTS: currentPage, TASK_LIST },
  },
  } = require('../../../lib/full-appeal/views');
const { postSaveAndReturn } = require('../../save');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');

  const sectionName = 'appealSiteSection';
  const taskName = 'siteAddress';

  const getListOfDocuments = (req, res) => {
    res.render(currentPage, {
      appeal: req.session.appeal,
    });
  };

  const postListOfDocuments = async (req, res) => {
    const { body } = req;
    const { errors = {}, errorSummary = [] } = body;
    const { appeal } = req.session;
  
    if (Object.keys(errors).length > 0) {
      return res.render(currentPage, {
        appeal,
        errors,
        errorSummary,
      });
    }
  
    try {
      if (req.body['save-and-return'] !== '') {
        req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
        req.session.appeal = await createOrUpdateAppeal(appeal);
        return res.redirect(`/${TASK_LIST}`);
      }
      appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return await postSaveAndReturn(req, res);
    } catch (e) {
      logger.error(e);
      return res.render(currentPage, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: '#' }],
      });
    }
  };
  
  module.exports = {
    getListOfDocuments,
    postListOfDocuments,
  };