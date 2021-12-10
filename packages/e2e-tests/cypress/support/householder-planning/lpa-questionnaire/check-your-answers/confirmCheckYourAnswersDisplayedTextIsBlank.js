export const confirmCheckYourAnswersDisplayedTextIsBlank = (id, answer) => {
  cy.get(`.test__${id}--answer`)
    .invoke('text')
    .then((text) => {
      // remove all double spaces from text to avoid issues with whitespace due to nunjucks
      text = text.replace(/\s|\No/g, '');
      expect(text).equal('');
    });
};
