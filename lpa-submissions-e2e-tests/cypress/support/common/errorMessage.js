/// <reference types = "Cypress"/>
import CommonPageObjects from '../PageObjects/Commonpageobjects'
const commonObjects = new CommonPageObjects();
module.exports = () =>{
  commonObjects.errorMessage();
}
