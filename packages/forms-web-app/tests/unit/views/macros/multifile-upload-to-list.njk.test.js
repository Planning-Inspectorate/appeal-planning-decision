const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/multifile-upload-to-list', () => {
  describe('No files uploaded', () => {
    test(`nothing provided`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList() -}}
    `)
      ).toMatchSnapshot();
    });

    test(`when value has a length of less than one and attributes is empty`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [], attributes = { 'a': 'b', 'c': 'd' } ) -}}
    `)
      ).toMatchSnapshot();
    });

    test(`when value is not provided and attributes has data-cy tag`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(attributes = { 'a': 'b', 'c': 'd', 'data-cy': 'test-heading' } ) -}}
    `)
      ).toMatchSnapshot();
    });
  });

  describe('single file uploaded', () => {
    test(`no attributes given`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' } ] ) -}}
    `)
      ).toMatchSnapshot();
    });

    test(`attributes given, but no data-cy tag`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' } ], attributes = { 'a': 'b', 'c': 'd' } ) -}}
    `)
      ).toMatchSnapshot();
    });

    test(`attributes given with data-cy tag`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' } ], attributes = { 'a': 'b', 'c': 'd', 'data-cy': 'test-heading' } ) -}}
    `)
      ).toMatchSnapshot();
    });
  });

  describe('multiple files uploaded', () => {
    test(`no attributes given`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' }, { 'originalFileName': 'xyz-789.docx' } ] ) -}}
    `)
      ).toMatchSnapshot();
    });

    test(`attributes given, but no data-cy tag`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' }, { 'originalFileName': 'xyz-789.docx' } ], attributes = { 'a': 'b', 'c': 'd' } ) -}}
    `)
      ).toMatchSnapshot();
    });

    test(`attributes given with data-cy tag`, () => {
      expect(
        nunjucksTestRenderer.renderString(`
    {%- from 'macros/multifile-upload-to-list.njk' import multifileUploadToList with context -%}
    {{- multifileUploadToList(value = [ { 'originalFileName': 'abc-123.jpg' }, { 'originalFileName': 'xyz-789.docx' } ], attributes = { 'a': 'b', 'c': 'd', 'data-cy': 'test-heading' } ) -}}
    `)
      ).toMatchSnapshot();
    });
  });
});
