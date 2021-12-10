import { sectionName } from '../householder-planning/lpa-questionnaire/PageObjects/common-page-objects';

export const verifySectionName = (section) => {
  sectionName()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(section);
    });
};
