export const provideDetails = () => cy.get('#visible-from-road-details').type(`{selectall}{backspace}The site is behind a tall wall`);
export const errorMessageVisibleFromRoadDetails = () => cy.get('#visible-from-road-details-error');
export const errorMessageVisibleFromRoad = () => cy.get('#visible-from-road-error');
