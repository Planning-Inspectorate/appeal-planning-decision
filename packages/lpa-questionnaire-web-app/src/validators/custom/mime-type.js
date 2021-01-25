module.exports = (givenMimeType, allowableMimeTypes, errorMessage) => {
  if (!allowableMimeTypes.includes(givenMimeType)) {
    throw new Error(errorMessage);
  }

  return true;
};
