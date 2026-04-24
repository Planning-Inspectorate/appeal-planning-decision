/**
 * @template T
 * @param {T[]} myArray
 * @param {number} chunk_size
 * @returns {T[][]}
 */
const chunkArray = (myArray, chunk_size) => {
	let index = 0;
	const arrayLength = myArray.length;
	const tempArray = [];

	for (index = 0; index < arrayLength; index += chunk_size) {
		const myChunk = myArray.slice(index, index + chunk_size);
		tempArray.push(myChunk);
	}

	return tempArray;
};

/**
 * @template T
 * @param {T[][]} batch
 * @param {number} concurrencyLimit
 * @param {function(T[]): Promise<any>} fn
 * @returns {Promise<any[]>}
 */
const runBatchWithPromise = async (batch, concurrencyLimit, fn) => {
	/**@type {any[]} */
	const results = [];

	for (let i = 0; i < batch.length; i += concurrencyLimit) {
		const concurrentBatches = batch.slice(i, i + concurrencyLimit);
		const batchResults = await Promise.all(concurrentBatches.map(fn));
		results.push(...batchResults.flat());
	}

	return results;
};

module.exports = {
	chunkArray,
	runBatchWithPromise
};
