const fetch = require('node-fetch');
const { createDocument } = require('../lib/documents-api-wrapper');
const { generatePDF } = require('../lib/pdf-api-wrapper');
const { VIEW } = require('../lib/views');

const getHtmlAppeal = async (appeal) => {
  const response = await fetch(
    `http://forms-web-app:3000/${VIEW.APPELLANT_SUBMISSION.SUBMISSION_INFORMATION}/${appeal.id}`
  );

  const ok = (await response.status) === 200;

  if (!ok) {
    throw new Error(response.statusText);
  }

  return response.text();
};

const storePdfAppeal = async (appeal) => {
  try {
    const htmlContent = await getHtmlAppeal(appeal);
    const pdf = await generatePDF(appeal.id, htmlContent);
    return await createDocument(appeal, pdf);
  } catch (e) {
    throw new Error('Error during the appeal pdf generation');
  }
};

module.exports = {
  storePdfAppeal,
  getHtmlAppeal,
};
