import getMagicLinkEmail from './getMagicLinkEmail';

module.exports = async () => {
  return getMagicLinkEmail().then((response) => {
    // TODO get magic link url from email body
    return undefined;
  });
};
