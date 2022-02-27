export const verifyFullAppealCYAAnswer =(answer, answer_text)=>{
  answer().should('be.visible')
    .invoke('text')
    .then((text)=>{
      expect(text).to.contain(answer_text);
    });
}
