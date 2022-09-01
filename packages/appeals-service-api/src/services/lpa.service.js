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
			lpaCode: data[row][2],
			lpa19NM: data[row][3],
			email: data[row][4],
			domain: data[row][5],
			inTrial: data[row][6] && !!data[row][6].includes('TRUE')
		});
	}
	return lpas;
}

function chunkArray(myArray, chunk_size) {
	let index = 0;
	const arrayLength = myArray.length;
	const tempArray = [];

	for (index = 0; index < arrayLength; index += chunk_size) {
		const myChunk = myArray.slice(index, index + chunk_size);
		tempArray.push(myChunk);
	}

	return tempArray;
}

const createLpaList = async (csv) => {
	const trimmed = JSON.stringify(csv).replace('{', '').replace('}', '').replace(':""', '');
	const trimmed1 = trimmed.replace(
		'OBJECTID,LPA19CD,LPA CODE,LPA19NM,EMAIL,DOMAIN,LPA ONBOARDED',
		''
	);
	let lpaList;

	try {
		lpaList = transformCSV(trimmed1);
		console.log(lpaList);
		await mongodb.get().collection('lpa').remove({});
		const lpaChunks = chunkArray(lpaList, 10);

		for (let chunk in lpaChunks) {
			await new Promise((res) => setTimeout(res, 1000));
			await mongodb.get().collection('lpa').insertMany(lpaChunks[chunk]);
		}
	} catch (err) {
		logger.debug(err);
	}
	return lpaList;
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
			logger.info('No documents found!');
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
