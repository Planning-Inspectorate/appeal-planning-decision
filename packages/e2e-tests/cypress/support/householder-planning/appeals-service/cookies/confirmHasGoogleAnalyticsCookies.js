export const confirmHasGoogleAnalyticsCookies = () => {
  cy.waitUntil(() =>
    cy
      .getCookie('_ga')
      .then((cookie) => Boolean(cookie && cookie.value) && cookie.value.startsWith('GA')),
  );
};

