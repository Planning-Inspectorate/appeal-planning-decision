/// <reference types = "Cypress"/>
import SubmissionAccuracy from '../PageObjects/SubmissionAccuracyPageObjects';

const submissionAccuracyPageObjects = new SubmissionAccuracy();

module.exports = () =>{
  submissionAccuracyPageObjects.inaccuracyReasonInput();
}
