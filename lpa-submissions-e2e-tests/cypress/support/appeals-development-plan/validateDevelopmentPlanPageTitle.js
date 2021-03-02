module.exports = () => {
  cy.title().should(
    'eq',
    'Development Plan Document or Neighbourhood Plan - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK',
  );
};
