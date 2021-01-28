module.exports = (multifileUploadsArray) =>
  multifileUploadsArray.reduce((acc, file) => {
    if (!file.originalFileName) {
      return acc;
    }

    return [...acc, file.originalFileName];
  }, []);
