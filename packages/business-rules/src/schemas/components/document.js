const pinsYup = require('../../lib/pins-yup');

const document = () => {
  return pinsYup.object().shape({
    name: pinsYup.string().max(255).ensure().required(),
    originalFileName: pinsYup.string().max(255).ensure().required(),
    id: pinsYup
      .string()
      .uuid()
      .transform((value) => (!value ? null : value))
      .required(),
  });
};

module.exports = document;
