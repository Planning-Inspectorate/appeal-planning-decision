/// <reference types = "Cypress"/>
import FileDragAndDrop from '../PageObjects/UploadThePlanToReachDecisionPageObjects';
const fileDragAndDrop = new FileDragAndDrop();
module.exports = (fileName) => {
    fileDragAndDrop.fileDragAndDrop().attachFile(fileName, { subjectType: 'drag-n-drop' });

};
