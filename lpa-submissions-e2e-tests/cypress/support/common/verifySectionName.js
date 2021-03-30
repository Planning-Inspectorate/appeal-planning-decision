/// <reference types = "Cypress"/>
import { sectionName } from '../PageObjects/common-page-objects';

module.exports = (section) => {
  sectionName()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(section);
    });
};
