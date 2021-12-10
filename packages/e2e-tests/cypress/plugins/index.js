const cucumber = require('cypress-cucumber-preprocessor').default;
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');
const pdf = require('pdf-parse');
const htmlvalidate = require('cypress-html-validate/dist/plugin');

/**
 * @type {function(*): {metadata: null, text: string, numpages: number, version: null, numrender: number, info: null}}
 */
const parsePdf = async (pdfBuffer) => {
  return await pdf(pdfBuffer);
};

module.exports = (on) => {
  on('file:preprocessor', cucumber());
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    async getPdfContent(pdfBuffer) {
      const parsed = parsePdf(pdfBuffer);
      return parsed.text;
    },
    downloadFile,
  });
  htmlvalidate.install(on, null, {
    exclude: ["title", "link","script",".govuk-header",".govuk-footer", "h1", "h2"],
    include: [],
  });
}
