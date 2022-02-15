import { selectNo, selectYes } from './page-objects/own-the-land-po';
import { getSaveAndContinueButton } from '../../common-page-objects/common-po';

export const selectRadioButton = (option) => {
  switch (option) {
    case 'Yes':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'No':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
}
