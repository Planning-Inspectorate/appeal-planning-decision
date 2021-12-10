import { confirmationMessage } from '../PageObjects/SupplementaryAddDocumentsPageObjects';

module.exports = () => {
  confirmationMessage()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Yes, I want to delete this supplementary planning document');
    });
};
