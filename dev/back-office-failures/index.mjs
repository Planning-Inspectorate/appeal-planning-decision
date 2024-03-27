import { join } from 'path';
import { readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dataFilename = '2024-03-20.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = join(__dirname, 'data');

/**
 * @param {string} filePath
 * @returns {Promise<Array<Object>>}
 */
const readAndSanitizeMongoJson = async (filePath) => {
	return new Promise((resolve, reject) => {
		readFile(filePath, { encoding: 'utf8' }, (error, fileContents) => {
			if (error) return reject(error);
			try {
				// Replace ObjectId with a quoted string
				const fixedContents = fileContents.replace(/ObjectId\(([^)]+)\)/g, '$1');
				resolve(JSON.parse(fixedContents));
			} catch (error) {
				return reject(error);
			}
		});
	});
};

const getMostRecentFailure = (failuresArray) => {
	let currentFailure = { date: null, message: null };

	failuresArray.forEach((item) => {
		if (item.failures && item.failures.length > 0) {
			const latestFailure = item.failures[item.failures.length - 1];
			if (!currentFailure.date || latestFailure.datetime.$date > currentFailure.date) {
				currentFailure = {
					date: latestFailure.datetime.$date,
					message: latestFailure.reason
				};
			}
		}
	});

	return currentFailure;
};

/**
 *
 * @param {Array<Object>} array
 * @returns {Array<Object>}
 */
const getLastFailure = (array) => {
	const failures = [];

	array.forEach((obj) => {
		const id = obj.appeal.id;

		let currentFailure = getMostRecentFailure(obj.organisations);

		if (!currentFailure.date) {
			currentFailure = getMostRecentFailure(obj.contacts);
		}

		if (!currentFailure.date) {
			currentFailure = getMostRecentFailure(obj.documents);
		}

		if (!currentFailure.date && obj.appeal && obj.appeal.failures) {
			const latestFailure = obj.appeal.failures[obj.appeal.failures.length - 1];
			currentFailure = {
				date: latestFailure.datetime.$date,
				message: latestFailure.reason
			};
		}

		failures.push({
			id,
			horizonId: obj.appeal.horizon_id,
			currentFailure
		});
	});

	return failures;
};

/**
 *
 * @param {Object} result
 * @returns {Object}
 */
const mapResultToReadable = (result) => {
	return result.map((entry) => ({
		date: new Date(entry.currentFailure.date).toISOString(),
		id: entry.id,
		message: entry.currentFailure.message,
		horizonId: entry.horizonId,
		resubmitted: '',
		notes: ''
	}));
};

/**
 *
 * @param {Object} data
 * @param {string} separator
 * @returns {string}
 */
const arrayToCSV = (data, separator = ';') => {
	const body = data
		.map((entry) => {
			let row = '';
			for (const key in entry) {
				if (key === 'currentFailure') {
					// Escape message string and convert date to ISO string
					row += `"${entry[key]?.message?.replace(/"/g, '""')}"${separator}${
						entry[key].date
					}${separator}`;
				} else {
					row += `"${entry[key]}"${separator}`;
				}
			}
			return row.slice(0, -1) + '\n';
		})
		.join('');

	return body;
};

const run = async () => {
	const filePath = join(dataDir, dataFilename);

	const failures = await readAndSanitizeMongoJson(filePath);
	const result = getLastFailure(failures);

	// Sort result
	result.sort((a, b) => {
		return b.currentFailure.date - a.currentFailure.date;
	});

	// map to readable
	const readableResult = mapResultToReadable(result);

	// Log sorted result
	console.log(arrayToCSV(readableResult));
	console.log(`failures: ${result.length}`);
};

run().catch(console.error);
