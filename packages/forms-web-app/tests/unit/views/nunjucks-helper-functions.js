const nunjucksTestRenderer = require('./nunjucks-render-helper');

const deleteGlobalVars = (vars) =>
  vars.forEach((key) => {
    delete nunjucksTestRenderer.globals[key];
    expect(() => nunjucksTestRenderer.getGlobal(key)).toThrow(`global not found: ${key}`);
  });

const matchesSnapshot = (includePath) =>
  expect(nunjucksTestRenderer.renderString(includePath)).toMatchSnapshot();

module.exports = {
  deleteGlobalVars,
  matchesSnapshot,
};
