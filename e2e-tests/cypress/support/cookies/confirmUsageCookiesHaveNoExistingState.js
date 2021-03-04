module.exports = () => {
  cy.assertRadioButtonState(['usage-cookies-yes', 'usage-cookies-no'], {
    isChecked: false,
  });
};
