/// <reference types = "Cypress"/>
import AppealsInImmediateArea from '../PageObjects/appeals-immediate-area-pageobjects'
 const appealsRefernceNumberHelpText = new AppealsInImmediateArea();
 module.exports = () =>{
    appealsRefernceNumberHelpText.appealReferenceNumberLabelText().invoke('text')
    .then(text =>{
      expect(text).to.eq('Enter appeal reference number(s).');
    });

    appealsRefernceNumberHelpText.appealReferenceNumberLabelHint().invoke('text')
    .then(text =>{
      expect(text).to.eq('You can enter more than one, separated by commas');
    })
 }
