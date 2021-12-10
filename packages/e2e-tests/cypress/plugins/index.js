const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');
const pdf = require('pdf-parse');
const htmlvalidate = require('cypress-html-validate/dist/plugin');
// cucumber configuration
const cucumber = require('cypress-cucumber-preprocessor').default
/**
 * @type {Cypress.PluginConfig}
 */
const parsePdf = async (pdfBuffer) => {
  return await pdf(pdfBuffer);
};



module.exports = (on, config) => {
  const queue = require('./queue')(config);
  on('file:preprocessor', cucumber());
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
    async getPdfContent(pdfBuffer) {
      const parsed = await parsePdf(pdfBuffer);
      return parsed.text;
    },
    downloadFile,
  });
  htmlvalidate.install(on, null, {
    exclude: ["title", "link","script",".govuk-header",".govuk-footer", "h1", "h2"],
    include: [],
  }),
  on('task', {
    listenToQueue: queue.listenToQueue,
    putOnQueue: queue.putOnQueue,
    getLastFromQueue: queue.getLastFromQueue,
  })

}
