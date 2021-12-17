Cypress.Commands.add(
  'confirmBodyContentWithJavaScriptEnabled',
  require('./confirmBodyContentWithJavaScriptEnabled'),
);

Cypress.Commands.add(
  'confirmBodyContentWithoutJavaScriptEnabled',
  require('./confirmBodyContentWithoutJavaScriptEnabled'),
);

Cypress.Commands.add(
  'confirmGenericPageContentExists',
  require('./confirmGenericPageContentExists'),
);

Cypress.Commands.add(
  'confirmPageHeadingWithJavaScriptEnabled',
  require('./confirmPageHeadingWithJavaScriptEnabled'),
);

Cypress.Commands.add(
  'confirmPageHeadingWithoutJavaScriptEnabled',
  require('./confirmPageHeadingWithoutJavaScriptEnabled'),
);
