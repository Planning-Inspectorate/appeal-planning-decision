module.exports = (id, answer) => {
  cy.get(`.test__${id}--answer`)
    .invoke('text')
    .then((text) => {
      // remove all double spaces from text to avoid issues with whitespace due to nunjucks
      expect(text.replaceAll(/\s\s/g, '')).to.contain(answer.replaceAll(/\s\s/g, ''));
    });
}
