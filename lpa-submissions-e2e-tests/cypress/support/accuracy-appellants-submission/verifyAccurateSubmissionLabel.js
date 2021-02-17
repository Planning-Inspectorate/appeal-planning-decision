/// <reference types = "Cypress"/>
import SubmissionAccuracy from '../PageObjects/SubmissionAccuracyPageObjects';

const submissionAccuracyPageObjects = new SubmissionAccuracy();

module.exports = (label) => {
  submissionAccuracyPageObjects
    .accurateSubmissionLabel()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(label);
    });
};
