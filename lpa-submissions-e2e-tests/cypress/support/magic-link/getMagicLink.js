import getMagicLinkEmail from './getMagicLinkEmail';

module.exports = async () => {
  return getMagicLinkEmail().then((response) => {
    return response.body[0].personalisation.magicLinkURL;
  });
};
