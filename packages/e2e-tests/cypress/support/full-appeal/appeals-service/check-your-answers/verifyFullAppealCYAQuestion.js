export const verifyFullAppealCYAQuestion = (question, question_text)=>{
  question().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.equal(question_text);
    });
}
