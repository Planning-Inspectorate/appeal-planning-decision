module.exports = () => {
  cy.waitUntil(() =>
    cy
      .getCookie('_ga')
      .then((cookie) => Boolean(cookie && cookie.value) && cookie.value.startsWith('GA')),
  );
};
