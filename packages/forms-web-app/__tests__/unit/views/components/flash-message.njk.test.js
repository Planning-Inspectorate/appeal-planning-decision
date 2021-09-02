const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/components/flash-message', () => {
  let flashMessage1;
  let flashMessage2;
  let flashMessage3;

  beforeEach(() => {
    flashMessage1 = {
      type: 'anything',
      html: 'a/path/to/a/template.njk',
    };
    flashMessage2 = {
      type: 'success',
      html: 'success.njk',
    };
    flashMessage3 = {
      type: 'error',
      html: 'some/error.njk',
    };
  });

  it(`should render nothing if flashMessages.length <= 0`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- include 'components/flash-message.njk' -%}
    `)
    ).toMatchSnapshot();
  });

  it(`should render one flash message`, () => {
    expect(
      nunjucksTestRenderer.renderString(
        `
    {%- include 'components/flash-message.njk' -%}
    `,
        {
          flashMessages: [flashMessage1],
        }
      )
    ).toMatchSnapshot();
  });

  it(`should render multiple flash message`, () => {
    expect(
      nunjucksTestRenderer.renderString(
        `
    {%- include 'components/flash-message.njk' -%}
    `,
        {
          flashMessages: [flashMessage1, flashMessage2, flashMessage3],
        }
      )
    ).toMatchSnapshot();
  });
});
