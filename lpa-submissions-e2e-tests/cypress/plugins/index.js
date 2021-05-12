const cucumber = require('cypress-cucumber-preprocessor').default;
const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
const pdf = require('pdf-parse');
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
/**
 * @type {Cypress.PluginConfig}
 */

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const parsePdf = async (pdfBuffer) => {
  return await pdf(pdfBuffer);
};

module.exports = (on, config) => {
  on('file:preprocessor', cucumber());
  on('task', {downloadFile})
  on('task', {
    log(message) {
      console.log(message);

      return null;
    },
    async getPdfContent(pdfBuffer) {
      const parsed = await parsePdf(pdfBuffer);
      return parsed.text;
    },
  });
};
