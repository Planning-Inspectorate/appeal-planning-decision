/// <reference types = "Cypress"/>
import questionTitle from '../PageObjects/common-page-objects';

module.exports = (question) => {
  questionTitle()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(question);
    });
};
