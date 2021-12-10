const {
  supplementaryDocumentList,
} = require('../PageObjects/SupplementaryAddDocumentsPageObjects');
export const verifySupplementaryDocumentList = (documentName) => {
  supplementaryDocumentList()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(documentName);
    });
};
