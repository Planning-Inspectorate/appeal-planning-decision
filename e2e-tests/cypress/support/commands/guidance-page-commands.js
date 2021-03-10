Cypress.Commands.add('goToPageBeforeYouAppeal', require('../go-to-page/goToPageBeforeYouAppeal'));
Cypress.Commands.add('goToPageWhenYouCanAppeal', require('../go-to-page/goToPageWhenYouCanAppeal'));
Cypress.Commands.add('goToPageStagesOfAnAppeal', require('../go-to-page/goToPageStagesOfAnAppeal'));

Cypress.Commands.add(
  'guidancePageNavigation',
  require('../guidance-pages/guidancePageNavigation'),
);

Cypress.Commands.add(
  'guidancePageSelectContentList',
  require('../guidance-pages/guidancePageSelectContentList'),
);
