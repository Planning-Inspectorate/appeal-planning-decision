/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
const cucumber = require('cypress-cucumber-preprocessor').default
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..') // assumes pdf at project root

const parsePdf = async (pdfName) => {
  const pdfPathname = path.join(repoRoot, pdfName)
  let dataBuffer = fs.readFileSync(pdfPathname);
  return await pdf(dataBuffer)  // use async/await since pdf returns a promise
}

/**
 * @type {Cypress.PluginConfig}
 */

 // cucumber configuration
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())
  on('task', {downloadFile})
  on('task', {
    getPdfContent (pdfName) {
      return String(parsePdf(pdfName))
    }
  })
}
