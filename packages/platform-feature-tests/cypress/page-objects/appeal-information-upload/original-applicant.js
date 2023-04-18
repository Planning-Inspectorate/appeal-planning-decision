export class OriginalApplicant{
    elements = {
        originalApplicantYesRadio: () => cy.get('[data-cy="answer-yes"]'),
        originalApplicantNoRadio:() => cy.get('[data-cy="answer-no"]')
    }

    selectOriginalApplicantYesRadio(){
        this.elements.originalApplicantYesRadio().check()
    }

    selectOriginalApplicantNoRadio(){
        this.elements.originalApplicantNoRadio().check()
    }
}