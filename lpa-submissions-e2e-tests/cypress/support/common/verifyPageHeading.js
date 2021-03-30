/// <reference types = "Cypress"/>
import { pageHeading } from '../PageObjects/common-page-objects';

module.exports = (pageHeadingId) => {
  pageHeading()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(pageHeadingId);
    });
};
