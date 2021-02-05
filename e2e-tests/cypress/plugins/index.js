const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
const cucumber = require('cypress-cucumber-preprocessor').default
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');//'/Users/raymitchell/WebstormProjects/appeal-planning-decision/e2e-tests/cypress/fixtures/Download/f90d2cc3-6af8-4f3b-bdea-a17fbbd805e7.pdf';//path.join(__dirname, '..', '..') // assumes pdf at project root

const parsePdf = async (pdfName) => {
  const pdfPathname = path.join(repoRoot, pdfName)
  let dataBuffer = fs.readFileSync(pdfPathname);
  return await pdf(dataBuffer)  // use async/await since pdf returns a promise
};

const getPdfContent = (filePath) => {

}

/**
 * @type {Cypress.PluginConfig}
 */

 // cucumber configuration
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())
  on('task', {downloadFile})
  on('task', {
    getPdfContent(filePath) {
      return new Promise((resolve, reject) => {
        const pdfPathname = path.join(repoRoot, filePath);

        try {
           pdf(fs.readFileSync(pdfPathname)).then(function(data) {
              resolve(data.text);
          });

        } catch (e) {
          reject(e);
        }
      });
    }

  })
}
