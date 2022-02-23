export const selectWrittenRepresentations= () => cy.get('[data-cy="answer-written-representation"]');
export const selectHearing = () => cy.get('[data-cy="answer-hearing"]');
export const selectInquiry = () => cy.get('[data-cy="answer-inquiry"]');
export const procedureErrorMessage = () => cy.get('#procedure-type-error');
export const inquiryTextBoxErrorMessage = () => cy.get('#why-inquiry-error');
export const textBoxInquiry = () => cy.get('#why-inquiry');
export const textBoxExpectDays = () => cy.get('#expected-days');
export const expectedDaysErrorMessage = () => cy.get('#expected-days-error');

