import { assertLink } from '../../../common/assertLink';

export const assertHasLinkToViewYourAppealDetails = () => {
  const text = 'View your appeal details';

  assertLink({
    cyTag: 'view-your-appeal-details-link',
    href: '/your-planning-appeal/your-appeal-details',
    title: text,
    text: new RegExp(`^${text}$`),
  });
};
