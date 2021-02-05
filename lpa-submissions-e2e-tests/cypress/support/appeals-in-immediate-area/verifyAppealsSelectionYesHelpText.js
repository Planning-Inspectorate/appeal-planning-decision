/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
const appealsReferenceNumberHelpText = new AppealsInImmediateArea();
module.exports = () => {
  appealsReferenceNumberHelpText.appealReferenceNumberLabelText().invoke('text')
  .then(text =>{
    expect(text).to.contain('Enter appeal reference number(s)');
  });

  appealsReferenceNumberHelpText.appealReferenceNumberLabelHint().invoke('text')
  .then(text =>{
    expect(text).to.contain('You can enter more than one, separated by commas');
  })
}
