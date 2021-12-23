import { assertRadioButtonState } from '../../../common/assertRadioButtonState';

export const confirmUsageCookiesHaveNoExistingState = () => {
  assertRadioButtonState(['usage-cookies-yes', 'usage-cookies-no'], {
    isChecked: false,
  });
};
