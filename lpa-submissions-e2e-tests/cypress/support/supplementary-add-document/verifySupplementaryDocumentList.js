const {
  supplementaryDocumentList,
} = require('../PageObjects/SupplementaryAddDocumentsPageObjects');
module.exports = (documentName) => {
  supplementaryDocumentList()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(documentName);
    });
};
