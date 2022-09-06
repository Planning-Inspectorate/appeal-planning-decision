const logger = require('../lib/logger');
const mongodb = require('../db/db');

const getLpaById = async (id) => {
	let lpa;
	await mongodb
		.get()
		.collection('lpa')
		.findOne({ lpa19CD: id })
		.then((doc) => {
			logger.debug(doc);
			lpa = doc;
		})
		.catch((err) => {
			logger.error({ err, id }, `Unable to find LPA for code ${id}`);
			throw new Error(err);
		});
	return { ...lpa, name: lpa.lpa19NM, horizonId: lpa.lpaCode };
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
			inTrial: data[row][6] && !!data[row][6].includes('TRUE'),
			england: data[row][1].startsWith('E'),
			wales: data[row][1].startsWith('W')
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
				id: doc.lpa19CD,
				name: doc.lpa19NM,
				inTrial: doc.inTrial,
				email: doc.email,
				domain: doc.domain
			});
		});
	} catch (err) {
		logger.error(err);
	}

	lpaList.sort(compare);

	return lpaList;
};

module.exports = {
	getLpaById,
	createLpaList,
	getLpaList
};
