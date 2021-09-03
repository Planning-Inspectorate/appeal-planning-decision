const appealSidebarDetails = require('../../../src/lib/appeal-sidebar-details');
const mockAppeal = require('../mockAppeal');

describe('lib/appeals-sidebar-details', () => {
  it('should return null if no appeal is passed', () => {
    expect(appealSidebarDetails()).toBeNull();
  });
  it('should return formatted details if appeal is passed', () => {
    expect(appealSidebarDetails(mockAppeal)).toEqual({
      number: 'ABC/123',
      address: '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
      appellant: 'Bob Smith',
    });
  });
});
