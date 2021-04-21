module.exports = () => {
  return cy.get('meta[name="appeal-reply-id"]').invoke('attr', 'content');
};
