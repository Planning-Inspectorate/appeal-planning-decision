module.exports = () => {
  cy.assertRadioButtonState(['usage-cookies-no'], {
    isChecked: true,
  });

  cy.assertRadioButtonState(['usage-cookies-yes'], {
    isChecked: false,
  });
};
