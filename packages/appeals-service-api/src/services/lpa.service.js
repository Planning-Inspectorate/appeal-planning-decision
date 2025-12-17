const logger = require('../lib/logger.js');
const mongodb = require('../db/db');
const LpaMapper = require('../mappers/lpa-mapper');
const LpaEntity = require('../models/entities/lpa-entity');
const ApiError = require('../errors/apiError');

class LpaService {
	#lpaMapper;

	constructor() {
		this.#lpaMapper = new LpaMapper();
	}

	getLpaById = async (id) => {
		logger.debug(`Getting LPA with id: ${id}`);
		let lpa;

		try {
			let doc = await mongodb.get().collection('lpa').findOne({ lpa19CD: id }); // todo: stop using this due to duplicates?
			if (!doc) {
				throw ApiError.lpaNotFound();
			}
			lpa = LpaEntity.createFromJson(doc);
		} catch (err) {
			logger.error({ err, id }, `Unable to find LPA for id ${id}`);
			throw err;
		}

		logger.debug(lpa, `Appeal LPA retrieved`);
		return lpa;
	};

	getLpaByCode = async (code) => {
		logger.debug(`Getting LPA with code: ${code}`);
		let lpa;

		try {
			let doc = await mongodb.get().collection('lpa').findOne({ lpaCode: code });
			if (!doc) {
				throw ApiError.lpaNotFound();
			}
			lpa = LpaEntity.createFromJson(doc);
		} catch (err) {
			logger.error({ err, code }, `Unable to find LPA for code ${code}`);
			throw err;
		}

		logger.debug(lpa, `Appeal LPA retrieved`);
		return lpa;
	};

	createLpaList = async (csv) => {
		const lpaEntitiesAsJson = this.#lpaMapper
			.csvJsonToLpaEntities(csv)
			.map((lpaEntity) => lpaEntity.toJson());
		logger.debug(lpaEntitiesAsJson, 'LPA entities as JSON');

		try {
			await mongodb.get().collection('lpa').remove({}); // Deletes all LPAs from database
			const lpaChunks = this.#chunkArray(lpaEntitiesAsJson, 10);

			for (let chunk in lpaChunks) {
				await new Promise((res) => setTimeout(res, 1000));
				await mongodb.get().collection('lpa').insertMany(lpaChunks[chunk]);
			}
		} catch (err) {
			logger.debug(err);
		}

		return lpaEntitiesAsJson;
	};

	getLpaList = async () => {
		const lpaList = [];
		try {
			const cursor = await mongodb.get().collection('lpa').find();
			if ((await cursor.count()) === 0) {
				logger.info('No documents found!');
			}

			await cursor.forEach((doc) => {
				lpaList.push({
					id: doc.lpa19CD,
					lpaCode: doc.lpaCode,
					name: doc.name,
					inTrial: doc.inTrial,
					email: doc.email,
					domain: doc.domain
				});
			});
		} catch (err) {
			logger.error(err);
		}

		lpaList.sort(this.#compare);

		return lpaList;
	};

	#compare(a, b) {
		if (a.name < b.name) {
			return -1;
		}
		if (a.name > b.name) {
			return 1;
		}
		return 0;
	}

	#chunkArray(myArray, chunk_size) {
		let index = 0;
		const arrayLength = myArray.length;
		const tempArray = [];

		for (index = 0; index < arrayLength; index += chunk_size) {
			const myChunk = myArray.slice(index, index + chunk_size);
			tempArray.push(myChunk);
		}

		return tempArray;
	}
}

module.exports = LpaService;
