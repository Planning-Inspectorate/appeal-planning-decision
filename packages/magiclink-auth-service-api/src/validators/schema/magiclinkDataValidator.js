const yup = require('yup');

let magicLinkObject = yup.object().shape({
  destinationEmail: yup.string().email().required(),
  redirectURL: yup.string().required(),
  expiredLinkRedirectURL: yup.string().required(),
});

let authObject = yup.object().shape({
  cookieName: yup.string().required(),
  userInformation: yup.object().required(),
  tokenValidity: yup.number().required(),
});

let magicLinkDataSchema = yup.object().shape({
  magicLink: magicLinkObject.required(),
  auth: authObject.required(),
});

module.exports = async (magicLinkData) => {
  return magicLinkDataSchema.validate(magicLinkData, { abortEarly: false, allowUnknown: false });
};
