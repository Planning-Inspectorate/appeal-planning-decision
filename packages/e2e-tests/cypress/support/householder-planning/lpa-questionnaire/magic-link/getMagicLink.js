import getMagicLinkEmail from './getMagicLinkEmail';

export const getMagicLink = () => {
  return getMagicLinkEmail().then((email) => {
    if (email) {
      return email?.personalisation?.['magic link'];
    }

    return null;
  });
};
