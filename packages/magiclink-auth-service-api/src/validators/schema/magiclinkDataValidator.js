const yup = require('yup');

const magicLinkObject = yup.object().shape({
  destinationEmail: yup.string().email().required(),
  redirectURL: yup.string().required(),
  expiredLinkRedirectURL: yup.string().required(),
});

const authObject = yup.object().shape({
  cookieName: yup.string().required(),
  userInformation: yup.object().required(),
  tokenValidity: yup.number().required(),
});

const magicLinkDataSchema = yup.object().shape({
  magicLink: magicLinkObject.required(),
  auth: authObject.required(),
});

async function validate(magicLinkData) {
  return magicLinkDataSchema.validate(magicLinkData, { abortEarly: false, allowUnknown: false });
}

module.exports = { validate };
