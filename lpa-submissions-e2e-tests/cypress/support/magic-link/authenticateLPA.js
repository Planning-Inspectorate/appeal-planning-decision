import goToPage from '../common/goToPage';
import inputEmailAddress from './inputEmailAddress';
import clickSubmit from '../common/clickSubmitButton';
import getMagicLink from './getMagicLink';

module.exports = () => {
  goToPage('authentication/your-email');
  inputEmailAddress();
  clickSubmit();
  getMagicLink().then((magicLink) => goToPage(magicLink));
};
