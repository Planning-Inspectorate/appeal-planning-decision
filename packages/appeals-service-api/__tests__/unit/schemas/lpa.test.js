/* Not auto-mocking the promises */
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
jest.mock('../../../src/lib/config', () => ({
  data: {
    lpa: {
      listPath: 'listPath',
      trialistPath: 'trialistPath',
    },
  },
  logger: {
    level: 'silent',
  },
}));

const fs = require('fs');
const { when } = require('jest-when');
const csvParser = require('neat-csv');
const LPA = require('.../../../src/schemas/lpa');
const config = require('../../../src/lib/config');

describe('LPA schema test', () => {
  describe('methods', () => {
    describe('#constructor', () => {
      it('should create an instance with the properties set', () => {
        const obj = {
          id: 'some-id',
          name: 'some-name',
          horizonId: 'some-hid',
          inTrial: true,
          email: 'some-email',
          domain: 'some-domain',
          england: true,
          wales: true,
        };

        const lpa = new LPA(obj);

        expect(lpa.id).toBe(obj.id);
        expect(lpa.name).toBe(obj.name);
        expect(lpa.inTrial).toBe(obj.inTrial);
        expect(lpa.domain).toBe(obj.domain);
        expect(lpa.email).toBe(obj.email);
        expect(lpa.england).toBe(obj.england);
        expect(lpa.wales).toBe(obj.wales);
        expect(lpa.horizonId).toBe(obj.horizonId);
      });
    });
  });

  describe('static methods', () => {
    describe('#find', () => {
      beforeEach(() => {
        jest.spyOn(LPA, 'loadData');
      });

      afterEach(() => {
        LPA.loadData.mockRestore();
      });

      it('should do no filtering and return all data with nothing input', async () => {
        const data = [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        expect(await LPA.find()).toEqual(data);

        expect(LPA.loadData).toBeCalledWith();
      });

      it('should do no filtering if empty filter object used', async () => {
        const data = [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        expect(await LPA.find({})).toEqual(data);

        expect(LPA.loadData).toBeCalledWith();
      });

      it('should do no filtering if null filter used', async () => {
        const data = [
          {
            id: 1,
          },
          {
            id: 2,
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        expect(await LPA.find(null)).toEqual(data);

        expect(LPA.loadData).toBeCalledWith();
      });

      it('should apply filtering with a single regex', async () => {
        const data = [
          {
            name: 'valid',
          },
          {
            name: 'OTHER-VALID',
          },
          {
            name: 'missing',
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        const re = /valid/i;
        expect(
          await LPA.find({
            name: re,
          })
        ).toEqual(data.filter(({ name }) => re.test(name)));

        expect(LPA.loadData).toBeCalledWith();
      });

      it('should apply filtering with a single non-regex', async () => {
        const data = [
          {
            valid: 'true',
          },
          {
            valid: 'false',
          },
          {
            valid: true,
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        expect(
          await LPA.find({
            valid: true,
          })
        ).toEqual(data.filter(({ valid }) => valid === true));

        expect(LPA.loadData).toBeCalledWith();
      });

      it('should apply filtering with a regex and non-regex', async () => {
        const data = [
          {
            inTrial: true,
            name: 'Telford',
          },
          {
            inTrial: false,
            name: 'Belfast',
          },
          {
            inTrial: true,
            name: 'Elford',
          },
        ];

        LPA.loadData.mockResolvedValue(data);

        const re = /elf/i;
        expect(
          await LPA.find({
            inTrial: true,
            name: re,
          })
        ).toEqual(data.filter(({ inTrial, name }) => inTrial === true && re.test(name)));

        expect(LPA.loadData).toBeCalledWith();
      });
    });

    describe('#findOne', () => {
      beforeEach(() => {
        LPA.find = jest.fn();
      });

      it('should return the item if single object returned', async () => {
        const data = [
          {
            id: 1,
          },
        ];
        const filter = 'some-filter';

        LPA.find.mockResolvedValue(data);

        expect(await LPA.findOne(filter)).toEqual(data[0]);
        expect(LPA.find).toBeCalledWith(filter);
      });

      it('should return the first item if multiple objects returned', async () => {
        const data = [
          {
            id: 2,
          },
          {
            id: 1,
          },
        ];
        const filter = 'some-other-filter';

        LPA.find.mockResolvedValue(data);

        expect(await LPA.findOne(filter)).toEqual(data[0]);
        expect(LPA.find).toBeCalledWith(filter);
      });

      it('should return empty array if nothing returned', async () => {
        const data = [];
        const filter = 'some-filter2';

        LPA.find.mockResolvedValue(data);

        expect(await LPA.findOne(filter)).toEqual(data[0]);
        expect(LPA.find).toBeCalledWith(filter);
      });
    });

    describe('#loadData', () => {
      it('should load the data from the files', async () => {
        const lpaExample = `OBJECTID,LPA19CD,LPA19NM,email,domain
1,E60000001,County Durham LPA,,
390,W43000018,Cardiff LPA,,
2,E60000002,Darlington LPA,,
331,N13000004,Belfast LPA,,
343,S44000005,City of Edinburgh LPA,,`;

        const trialistExample = [
          {
            id: 'E60000001',
            inTrial: true,
          },
          {
            id: 'W43000018',
            inTrial: false,
            horizonId: 'ABC123',
          },
        ];

        /* This is simplified duplication of the parse method to check it works */
        const parsedCSV = (await csvParser(lpaExample))
          .filter(
            ({ LPA19CD }) =>
              LPA19CD.startsWith('S') === false &&
              LPA19CD.startsWith('N') === false &&
              LPA19CD.startsWith('W') === false
          )
          .map(({ LPA19CD: id, LPA19NM: name, EMAIL: email, DOMAIN: domain }) => {
            const { inTrial = false, horizonId = null } =
              trialistExample.find(({ id: trialistId }) => trialistId === id) || {};
            return {
              name,
              horizonId,
              inTrial,
              id: id.toUpperCase(),
              email,
              domain,
              england: id.startsWith('E'),
              wales: id.startsWith('W'),
            };
          })
          .sort((a, b) => {
            /* Put into order */
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });

        when(fs.promises.readFile)
          .calledWith(config.data.lpa.listPath, 'utf8')
          .mockResolvedValue(lpaExample);
        when(fs.promises.readFile)
          .calledWith(config.data.lpa.trialistPath, 'utf8')
          .mockResolvedValue(JSON.stringify(trialistExample));

        expect(await LPA.loadData()).toEqual(parsedCSV);
      });
    });
  });
});
