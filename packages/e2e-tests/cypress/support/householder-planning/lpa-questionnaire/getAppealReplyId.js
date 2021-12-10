export const getAppealReplyId = () => {
  return cy.get('@appealReply').then((appealReply) => appealReply.id);
};
