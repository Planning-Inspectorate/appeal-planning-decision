/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';

const commonPageObjects = new CommonPageObjects();

module.exports = (question) => {
  commonPageObjects
    .questionTitle()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(question);
    });
};
