export const confirmCheckYourAnswersDisplayed = (id, answer) => {
  cy.get(`.test__${id}--answer`)
    .invoke('text')
    .then((text) => {
      // remove all double spaces from text to avoid issues with whitespace due to nunjucks
      expect(text.replace(/\s\s/g, '')).to.contain(answer.replace(/\s\s/g, ''));
    });
};
