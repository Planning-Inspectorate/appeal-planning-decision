import getMagicLinkEmail from './getMagicLinkEmail';

module.exports = () => {
  return getMagicLinkEmail().then((email) => {
    if (email) {
      return email?.personalisation?.magicLinkURL;
    }

    return null;
  });
};
