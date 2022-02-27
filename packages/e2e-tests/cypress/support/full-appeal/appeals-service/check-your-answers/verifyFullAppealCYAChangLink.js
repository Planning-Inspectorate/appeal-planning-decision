export const verifyFullAppealCYAChangLink =(changeLink, change_url)=>{
  changeLink()
    .should('be.visible')
    .should('have.attr','href',change_url);
}
