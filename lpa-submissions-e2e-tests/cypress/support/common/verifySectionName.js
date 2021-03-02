/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';

const commonPageObjects = new CommonPageObjects();

module.exports = (section) => {
  commonPageObjects
    .sectionName()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(section);
    });
};
