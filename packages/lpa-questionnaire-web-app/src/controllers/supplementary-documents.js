const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { uploadFiles } = require('../lib/file-upload-helpers');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');
const errorTexts = require('../validators/validation-messages/supplementary-documents-validation-messages');

const question = {
  heading: 'Supplementary planning document',
  section: 'Optional supporting documents',
  title:
    'Add Supplementary planning document - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
};

exports.question = question;

exports.getAddDocument = (req, res) => {
  // TODO: when list pa[ge is created logic around backlink will need adding. If new page normal backlink is fine
  // but if coming from new document button need to set the res.locals.backlink to that page. Session still needed for list page

  const backLink = res.locals.backLink || req.session.backLink;

  res.render(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    question,
  });
};

const renameDocErrorKeys = (errors) => {
  const { 'files.documents[0]': documents, ...rest } = errors;
  return {
    ...(documents ? { documents } : {}),
    ...rest,
  };
};

exports.postAddDocument = async (req, res) => {
  const backLink = res.locals.backLink || req.session.backLink;

  const {
    body: {
      errors: rawErrors = {},
      errorSummary: rawErrorSummary = [],
      documents,
      files,
      documentName,
      formallyAdopted,
      adoptedDate,
      stageReached,
    },
    params: { id: appealId },
    session: { appealReply },
  } = req;

  const values = {
    documents,
    documentName,
    formallyAdopted,
    'adoptedDate-day': req.body['adoptedDate-day'],
    'adoptedDate-month': req.body['adoptedDate-month'],
    'adoptedDate-year': req.body['adoptedDate-year'],
    stageReached,
  };

  const errorSummary = rawErrorSummary.map((error) => {
    // TODO: reduce date errors to single message
    if (error.href === '#files.documents[0]')
      return {
        href: '#documents',
        text: error.text,
      };
    if (error.href === '#adoptedDate')
      return {
        href: '#adoptedDate-day',
        text: error.text,
      };
    return error;
  });

  // Check if all fields have been left blank
  if (
    Object.values(errorTexts).filter((vm) => errorSummary.map((obj) => obj.text).includes(vm))
      .length >= 3
  ) {
    res.redirect(`/${appealId}/task-list`);
    return;
  }

  const errors = renameDocErrorKeys(rawErrors);

  try {
    if (Object.keys(errors).length > 0) throw new Error('Validation failed');

    const uploadedFile = await uploadFiles(files.documents, appealReply.id);

    const { name, id } = uploadedFile[0];

    const uploadWithMeta = {
      name,
      id,
      documentName,
      adoptedDate,
      stageReached,
    };

    appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles = [
      ...appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles,
      uploadWithMeta,
    ];

    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (err) {
    if (err.toString() !== 'Error: Validation failed')
      req.log.error({ err }, 'Error adding supplementary document');

    res.render(VIEW.SUPPLEMENTARY_DOCUMENTS.ADD_DOCUMENT, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: backLink || `/${appealId}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: errorSummary.length ? errorSummary : [{ text: err.toString() }],
      question,
      values,
    });

    return;
  }

  res.redirect(`/${appealId}/supplementary-documents`);
};
