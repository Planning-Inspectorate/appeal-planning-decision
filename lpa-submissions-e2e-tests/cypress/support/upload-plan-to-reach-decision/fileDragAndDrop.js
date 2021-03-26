/// <reference types = "Cypress"/>
import UploadThePlanToReachDecision from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const fileDragAndDrop = new UploadThePlanToReachDecision();
module.exports = (fileName) => {
    fileDragAndDrop.fileDragAndDrop().attachFile(fileName, { subjectType: 'drag-n-drop' });

};
