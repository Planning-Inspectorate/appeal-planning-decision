export const toggleIndividualYourAppealDetailsAccordionPanel = ({ sectionTitle }) => {
  cy.get('button').contains(sectionTitle).click();
};
