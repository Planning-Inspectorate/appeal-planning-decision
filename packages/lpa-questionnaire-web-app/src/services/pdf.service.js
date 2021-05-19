const fs = require('fs');
const nunjucks = require('nunjucks');
const path = require('path');
const uuid = require('uuid');

const checkAnswersSections = require('../lib/check-answers-sections');
const appealSidebarDetails = require('../lib/appeal-sidebar-details');
const { generatePDF } = require('../lib/pdf-api-wrapper');
const { createDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

// *****CONFIG***** \\

nunjucks.configure([
  path.join(__dirname, '../..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '../views'),
]);

// *****FUNCTIONALITY***** \\

const getAppealDetails = (appeal) => {
  const sidebarDetails = appealSidebarDetails(appeal);
  return {
    'Planning Application Number': sidebarDetails.number,
    'Site Address': sidebarDetails.address,
    'Appellant Name': sidebarDetails.appellant,
  };
};

const buildAppealDetailsRows = (appealData) => {
  return {
    id: 'appealDataSection',
    heading: 'Appeal Details',
    subTasks: Object.keys(appealData).map((heading) => {
      return {
        key: {
          text: heading,
        },
        value: {
          html: `<p>${appealData[heading]}</p>`,
        },
      };
    }),
  };
};

const convertToHtml = (appealReply, appeal) => {
  const sections = checkAnswersSections(appealReply, null, false);

  const appealDetails = getAppealDetails(appeal);
  const appealDetailsRows = buildAppealDetailsRows(appealDetails);
  sections.unshift(appealDetailsRows);

  const css = fs.readFileSync(path.resolve(__dirname, '../public/stylesheets/main.css'), 'utf8');

  return nunjucks.render(path.resolve(__dirname, '../views/pdf-generation.njk'), {
    css,
    sections,
  });
};

const createPdf = async (appealReply, appeal) => {
  const { id } = appealReply;

  const log = logger.child({ appealReplyId: id, uuid: uuid.v4() });

  try {
    log.info('Creating PDF appeal document');

    const renderedHtml = convertToHtml(appealReply, appeal);
    const pdfBuffer = await generatePDF(`${id}.pdf`, renderedHtml);

    log.debug('Creating document from PDF buffer');
    const document = await createDocument(id, pdfBuffer, `${id}.pdf`);

    log.debug('PDF document successfully created');

    return document;
  } catch (err) {
    const msg = 'Error generating PDF';
    log.error({ err }, msg);

    throw new Error(msg);
  }
};

module.exports = {
  convertToHtml,
  createPdf,
};
