/// <reference types = "Cypress"/>
import { pageHeading as pageHeadingObject } from '../PageObjects/common-page-objects';

module.exports = (pageHeading) => {
  pageHeadingObject()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(pageHeading);
    });
};
