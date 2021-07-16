const { createValidationErrors } = require('../../../../src/validators/custom/date-input');

describe('createValidationErrors', () => {
  const date = {
    d: 'mock-ref-day',
    m: 'mock-ref-month',
    y: 'mock-ref-year',
  };

  const mockLabel = 'mock-label';

  const body = {
    'mock-ref-day': '',
    'mock-ref-month': '',
    'mock-ref-year': '',
  };

  const mockReq = { ...body };

  [
    {
      title: 'should return no data entered error message',
      given: {
        ...mockReq,
        body: { ...body, 'mock-ref-day': '1', 'mock-ref-month': '1', 'mock-ref-year': '1999' },
      },
      expected: ``,
    },
    {
      title: 'should return no data entered error message',
      given: { ...mockReq, body: { ...body } },
      expected: `Tell us the date the supplementary planning document was adopted`,
    },
    {
      title: 'should return must include a month and year',
      given: { ...mockReq, body: { ...body, 'mock-ref-day': '1' } },
      expected: `Mock-label must include a month and year`,
    },
    {
      title: 'should return must include a day and year',
      given: { ...mockReq, body: { ...body, 'mock-ref-month': '1' } },
      expected: `Mock-label must include a day and year`,
    },
    {
      title: 'should return must include a day and month',
      given: { ...mockReq, body: { ...body, 'mock-ref-year': '1999' } },
      expected: `Mock-label must include a day and month`,
    },
    {
      title: 'should return must include a day',
      given: { ...mockReq, body: { ...body, 'mock-ref-month': '1', 'mock-ref-year': '1999' } },
      expected: `Mock-label must include a day`,
    },
    {
      title: 'should return must include a month',
      given: { ...mockReq, body: { ...body, 'mock-ref-day': '1', 'mock-ref-year': '1999' } },
      expected: `Mock-label must include a month`,
    },
    {
      title: 'should return must include a year',
      given: { ...mockReq, body: { ...body, 'mock-ref-day': '1', 'mock-ref-month': '1' } },
      expected: `Mock-label must include a year`,
    },
    {
      title: 'should return correct error for a non long month',
      given: {
        ...mockReq,
        body: { ...body, 'mock-ref-day': '31', 'mock-ref-month': '5', 'mock-ref-year': '1999' },
      },
      expected: ``,
    },
    {
      title: 'should return correct error for a long month',
      given: {
        ...mockReq,
        body: { ...body, 'mock-ref-day': '31', 'mock-ref-month': '4', 'mock-ref-year': '1999' },
      },
      expected: `Mock-label must be a real date`,
    },
    {
      title: 'should return correct error for a leap year',
      given: {
        ...mockReq,
        body: { ...body, 'mock-ref-day': '29', 'mock-ref-month': '2', 'mock-ref-year': '2020' },
      },
      expected: ``,
    },
    {
      title: 'should return correct error for a non leap year',
      given: {
        ...mockReq,
        body: { ...body, 'mock-ref-day': '29', 'mock-ref-month': '2', 'mock-ref-year': '2019' },
      },
      expected: `Mock-label must be a real date`,
    },
    {
      title: 'should return correct error for incorrect input',
      given: { ...mockReq, body: { ...body, 'mock-ref-day': 'a' } },
      expected: `Mock-label must be a real date`,
    },
  ].forEach(({ title, given, expected }) => {
    it(title, () => {
      expect(createValidationErrors(date, given, mockLabel)).toEqual(expected);
    });
  });
});
