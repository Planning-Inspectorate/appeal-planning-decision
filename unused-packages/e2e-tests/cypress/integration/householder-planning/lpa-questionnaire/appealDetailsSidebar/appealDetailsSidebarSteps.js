import { Given } from 'cypress-cucumber-preprocessor/steps';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';

Given('A subsection page is presented', () => {
	goToLPAPage('other-appeals');
});
