/// <reference types = "Cypress"/>
import SubmissionAccuracy from '../PageObjects/SubmissionAccuracyPageObjects';

const submissionAccuracyPageObjects = new SubmissionAccuracy();

module.exports = (value) => {
  if (value === 'Yes') {
    submissionAccuracyPageObjects.accurateSubmissionRadioYes();
  } else {
    submissionAccuracyPageObjects.accurateSubmissionRadioNo();
  }
};
