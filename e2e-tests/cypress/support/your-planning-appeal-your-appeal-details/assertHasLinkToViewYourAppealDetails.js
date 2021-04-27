module.exports = () => {
  const text = 'View your appeal details';

  cy.assertLink({
    cyTag: 'view-your-appeal-details-link',
    href: '/your-planning-appeal/your-appeal-details',
    title: text,
    text: new RegExp(`^${text}$`),
  });
};
