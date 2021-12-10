import { confirmationMessage } from '../PageObjects/SupplementaryAddDocumentsPageObjects';

export const verifyDeleteConfirmationText = () => {
  confirmationMessage()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Yes, I want to delete this supplementary planning document');
    });
};
