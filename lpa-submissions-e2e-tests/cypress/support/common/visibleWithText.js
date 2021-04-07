module.exports = (textToFind, node) => {
  node.invoke('text').then((text) => {
    expect(text).to.contain(textToFind);
  });
};
