import { getPageHeading } from '../page-objects/common-po';

export const verifyPageHeading = (pageHeading) => {
  getPageHeading()
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(pageHeading);
    });
};
