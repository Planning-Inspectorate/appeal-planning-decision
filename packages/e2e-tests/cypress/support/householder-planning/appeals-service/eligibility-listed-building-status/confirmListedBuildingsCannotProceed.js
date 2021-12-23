export const confirmListedBuildingsCannotProceed = () => {
  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain("This service is not available for listed buildings");
  });

}
