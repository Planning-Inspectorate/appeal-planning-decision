import { assertRadioButtonState } from '../../../common/assertRadioButtonState';

export const confirmUsageCookieRadioButtonIsMarkedAsInactive = () => {
  assertRadioButtonState(['usage-cookies-no'], {
    isChecked: true,
  });

  assertRadioButtonState(['usage-cookies-yes'], {
    isChecked: false,
  });
};
