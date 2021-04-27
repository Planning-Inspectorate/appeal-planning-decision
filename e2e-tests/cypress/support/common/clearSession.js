module.exports = () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
};
