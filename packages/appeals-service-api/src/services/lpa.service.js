const LPASchema = require('../schemas/lpa');
const logger = require('../lib/logger');
const mongodb = require('../db/db');

const getLpa = async (id) => {
	let lpa;

	try {
		lpa = await LPASchema.findOne({ id });
	} catch (err) {
		logger.error({ err, id }, `Unable to find LPA for code ${id}`);
	}

	logger.debug({ lpa }, 'LPA found');

	if (lpa && lpa.email && lpa.name) {
		logger.debug({ lpa }, 'LPA found');
		return lpa;
	}

	throw new Error(`Unable to find LPA email or name for code ${id}`);
};

function transformCSV(body) {
	const data = body.trim().split(/\r?\\n/);

	data.shift();
	for (let i in data) {
		data[i] = data[i].trim().split(',');
	}
	const lpas = [];
	for (let row in data) {
		lpas.push({
			objectId: data[row][0],
			lpa19CD: data[row][1],
			lpa19NM: data[row][2],
			email: data[row][3],
			domain: data[row][4],
			inTrial: data[row][5]
		});
	}

	return lpas;
}

const createLpaList = async (csv) => {
	const trimmed = JSON.stringify(csv).replace('{', '').replace('}', '').replace(':""', '');
	const trimmed1 = trimmed.replace('OBJECTID,LPA19CD,LPA19NM,EMAIL,DOMAIN', '');
	try {
		const lpaList = transformCSV(trimmed1);
		await mongodb.get().collection('lpa').remove({});
		const half = Math.ceil(lpaList.length / 2);

		const firstHalf = lpaList.slice(0, half);
		const secondHalf = lpaList.slice(half);
		await mongodb.get().collection('lpa').insertMany(firstHalf);
		await mongodb.get().collection('lpa').insertMany(secondHalf);
	} catch (err) {
		logger.debug(err);
	}
};

function compare(a, b) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
}

const getLpaList = async () => {
	const lpaList = [];
	try {
		const cursor = await mongodb.get().collection('lpa').find();
		if ((await cursor.count()) === 0) {
			console.log('No documents found!');
		}

		await cursor.forEach((doc) => {
			lpaList.push({
				name: doc.lpa19NM,
				inTrial: doc.inTrial
			});
		});
	} catch (err) {
		logger.error(err);
	}

	lpaList.sort(compare);

	return lpaList;
};

module.exports = {
	getLpa,
	createLpaList,
	getLpaList
};
