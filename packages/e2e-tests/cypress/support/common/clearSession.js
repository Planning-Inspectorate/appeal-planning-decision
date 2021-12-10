export const clearSession = () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
};
