export class DecideAppeal{
    elements = {
        writtenRepresentation: () => cy.get('[data-cy="answer-written-representation"]'),
        hearing: () => cy.get('[data-cy="answer-hearing"]'),
        inquiry: () => cy.get('[data-cy="answer-inquiry"]')
    }

    selectWrittenRepresentation(){
        this.elements.writtenRepresentation().check()
    }

    selectHearing(){
        this.elements.hearing().check()
    }
    
    selectInquiry(){
        this.elements.inquiry().check()
    }
}
