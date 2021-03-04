Cypress.Commands.add('goToPageBeforeYouAppeal', require('../go-to-page/goToPageBeforeYouAppeal'));

Cypress.Commands.add(
  'guidancePageNavigation',
  require('../guidance-pages/guidancePageNavigation'),
);

Cypress.Commands.add(
  'guidancePageSelectContentList',
  require('../guidance-pages/guidancePageSelectContentList'),
);
