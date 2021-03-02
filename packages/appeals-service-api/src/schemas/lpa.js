/**
 * LPA
 *
 * This emulates a Mongoose Schema to find and
 * organise the data. This is so we can replace
 * it with a Mongoose schema if we ever need to.
 * It also allows for the data to be retrieved
 * independent of a controller
 */

const { promises: fs } = require('fs');
const csvParser = require('neat-csv');
const config = require('../lib/config');
const logger = require('../lib/logger');

module.exports = class LPA {
  constructor({ id, name, inTrial, england, wales, horizonId }) {
    this.id = id;
    this.name = name;
    this.inTrial = inTrial;

    /* Can be in multiple regions */
    this.england = england;
    this.wales = wales;
    this.horizonId = horizonId;
  }

  static async find(filter = {}) {
    const data = await LPA.loadData();

    if (filter) {
      return data.filter((item) =>
        Object.keys(filter).every((key) => {
          const value = item[key];
          const filterValue = filter[key];

          if (filterValue.test) {
            /* Regex */
            return filterValue.test(value);
          }
          /* Value matcher */
          return value === filterValue;
        })
      );
    }

    return data;
  }

  static async findOne(filter) {
    const items = await LPA.find(filter);

    if (items.length > 0) {
      return items[0];
    }

    return undefined;
  }

  /**
   * @private
   * @return {Promise<LPA[]>}
   */
  static async loadData() {
    const { listPath, trialistPath } = config.data.lpa;

    logger.debug({ listPath, trialistPath }, 'Retrieving LPA data from file');

    const lpaList = await fs.readFile(listPath, 'utf8');
    const trialists = JSON.parse(await fs.readFile(trialistPath, 'utf8'));

    logger.trace({ lpaList, trialists }, 'Retrieved LPA data');

    return (await csvParser(lpaList))
      .filter(({ LPA19CD }) => {
        /* Filter out Scotland and Northern Ireland LPAs */
        const include = LPA19CD.startsWith('S') === false && LPA19CD.startsWith('N') === false;
        logger.trace({ include, id: LPA19CD }, 'Filtering out Scottish and Northern Irish LPAs');
        return include;
      })
      .map(({ LPA19CD: id, LPA19NM: name }) => {
        /* Use our own data model format */
        const trialist = trialists.find(({ id: trialistId }) => trialistId === id);

        const { inTrial = false, horizonId = null } = trialist || {};

        logger.trace({ inTrial, id }, 'Adding in trialist status');

        return new LPA({
          name,
          horizonId,
          inTrial,
          id: id.toUpperCase(),
          /* A merger may happen of an English and Welsh LPA */
          england: id.startsWith('E'),
          wales: id.startsWith('W'),
        });
      })
      .sort(
        /* istanbul ignore next */ (a, b) => {
          /* Put into order */
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        }
      );
  }
};
