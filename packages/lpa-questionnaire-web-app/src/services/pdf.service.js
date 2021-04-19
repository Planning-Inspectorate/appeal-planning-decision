const nunjucks = require('nunjucks');
const path = require('path');
const checkAnswersSections = require('../lib/check-answers-sections');
const appealSidebarDetails = require('../lib/appeal-sidebar-details');

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
        actions: undefined,
      };
    }),
  };
};

exports.convertToHtml = (req, appeal) => {
  const sections = checkAnswersSections(req.session.appealReply, req.params.id, false);
  const appealDetails = getAppealDetails(appeal);
  const appealDetailsRows = buildAppealDetailsRows(appealDetails);
  sections.unshift(appealDetailsRows);
  return nunjucks.render(path.resolve(__dirname, '../views/pdf-generation.njk'), {
    sections,
  });
};
