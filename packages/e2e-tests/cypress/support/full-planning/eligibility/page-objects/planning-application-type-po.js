export const getFullPlanningRadio = () => cy.get('input[data-cy="answer-full-planning"]');
export const getHouseHolderPlanningRadio = () => cy.get('input[data-cy="answer-householder-planning"]');
export const getOutlinePlanningRadio = () => cy.get('input[data-cy="answer-outline-planning"]');
export const getPriorApprovalPlanningRadio = () => cy.get('input[data-cy="answer-prior-approval"]');
export const getReservedMattersPlanningRadio = () => cy.get('input[data-cy="answer-reserved-matters"]');
export const getRemovalOrVariationOfConditionsRadio = () => cy.get('input[data-cy="answer-removal-or-variation-of-conditions"]');
export const getSomethingElseRadio = () => cy.get('input[data-cy="answer-something-else"]');
export const getNoApplicationMadeRadio = () => cy.get('input[data-cy="answer-i-have-not-made-a-planning-application"]');
export const getTypeOfPlanningApplicationError = () => cy.get('#type-of-planning-application-error');

