export const confirmGenericPageContentExists = () => {
  const expectedText =
    'Cookies are files saved on your phone, tablet or computer when you visit a website. We use cookies to store information about how you use the appeal a planning decision service, such as the pages you visit.';

  cy.get(`[data-cy="common-cookie-information"]`).contains(expectedText);
 };
