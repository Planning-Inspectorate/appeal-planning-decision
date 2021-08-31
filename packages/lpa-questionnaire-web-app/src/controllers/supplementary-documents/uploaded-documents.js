const { format } = require('date-fns');
const { VIEW } = require('../../lib/views');
const getAppealSideBarDetails = require('../../lib/appeal-sidebar-details');

const question = {
  heading: 'Supplementary planning documents',
  section: 'Optional supporting documents',
  title:
    'Supplementary planning documents - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
};

exports.question = question;

const populateUploadedFiles = (req) => {
  return req.session.appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles.map(
    (uf, index) => {
      const formallyAdopted = uf.stageReached
        ? `No - ${uf.stageReached}`
        : `Yes - Adopted on ${format(new Date(uf.adoptedDate), 'd MMMM YYY')}`;
      return [
        { text: uf.documentName },
        { text: formallyAdopted },
        { html: `<a href="delete-document?row=${index}">Delete</a>`, class: 'govuk-link' },
      ];
    }
  );
};

exports.getUploadedDocuments = (req, res) => {
  const backLink = res.locals.backLink || req.session.backLink;
  const uploadedDocumentsUrl = `${req.protocol}://${req.headers.host}${req.url}`.replace(
    '/uploaded-documents',
    ''
  );

  res.render(VIEW.SUPPLEMENTARY_DOCUMENTS.UPLOADED_DOCUMENTS, {
    uploadedDocumentsUrl,
    uploadedFiles: populateUploadedFiles(req),
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    question,
  });
};
