import {selectNo, selectSomeOf, selectYes} from "./page-objects/own-the-land-po";
import {getSaveAndContinueButton} from "../../common-page-objects/common-po";

export const selectTheOwners = (option) =>{
  switch (option) {
    case 'Yes':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'No':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'Yes, I know who owns all the land':
      selectYes().click();
      getSaveAndContinueButton().click();
      break;
    case 'I know who owns some of the land':
      selectSomeOf().click();
      getSaveAndContinueButton().click();
      break;
    case 'No, I do not know who owns any of the land':
      selectNo().click();
      getSaveAndContinueButton().click();
      break;
    case 'None of the options':
      getSaveAndContinueButton().click();
      break;
  }
}
