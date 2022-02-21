import {
  summaryErrorMessage,
} from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

export const verifyFileUploadErrorMessage = (errorMessage, errorMessageObjectId, summaryErrorMessageId, invalidFile1, invalidFile2) => {
  let errorMessgList = errorMessage.split( ':' );
  //cy.log( 'erro messg list = ' + errorMessgList );
  summaryErrorMessage(summaryErrorMessageId).should( 'be.visible' );
  cy.title().should( 'contain', 'Error:' );
  cy.checkPageA11y();

  summaryErrorMessage(summaryErrorMessageId).invoke( 'text' )
    .then( (text) => {
      // cy.log('text=' + text);
      if (text.includes(invalidFile1))
        expect(text).to.contain(errorMessgList[0]);
      else if (text.includes(invalidFile2))
        expect(text).to.contain(errorMessgList[1]);
    } );

  if (errorMessageObjectId) {
    const errorMessageObject = () => cy.get(errorMessageObjectId);
    errorMessageObject().should( 'be.visible');
    errorMessageObject().invoke( 'text')
      .then( (text) => {
        if (text.includes(invalidFile1))
          expect(text).to.contain(errorMessgList[0]);
        else if (text.includes(invalidFile2))
          expect(text).to.contain(errorMessgList[1]);
      } );
  }

}
