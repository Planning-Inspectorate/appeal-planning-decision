const visibleWithoutText = (textToFind, node) => {
  node.invoke('text').then((text) => {
    expect(text).not.to.contain(textToFind);
  });
};
