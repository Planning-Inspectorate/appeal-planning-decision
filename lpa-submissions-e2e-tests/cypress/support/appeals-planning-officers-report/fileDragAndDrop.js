/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/CommonPageObjects';
const commonPageObjects = new CommonPageObjects();
module.exports = (fileName) => {
  commonPageObjects.fileDragAndDrop().attachFile(fileName, { subjectType: 'drag-n-drop' });

};
