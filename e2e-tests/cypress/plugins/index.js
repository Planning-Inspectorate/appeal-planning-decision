const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
const cucumber = require('cypress-cucumber-preprocessor').default
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');

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
