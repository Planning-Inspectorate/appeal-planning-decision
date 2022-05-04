function capitalise(text) {
  const words = text.match(/[a-zA-Z][^\-+\s_]*[a-zA-Z]/g);
  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
}

module.exports = { capitalise };
