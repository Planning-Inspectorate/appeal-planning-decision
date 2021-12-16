export const getGrantedRadio = () => cy.get('input[data-cy="answer-granted"]');
export const getRefusedRadio = () => cy.get('input[data-cy="answer-refused"]');
export const getNoDecisionReceivedRadio = () => cy.get('input[data-cy="answer-nodecisionreceived"]');
export const getPlanningApplicationDecisionError = () => cy.get('#granted-or-refused-error');