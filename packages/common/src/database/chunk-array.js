/**
 * Split an array into chunks of a given size.
 * @template T
 * @param {T[]} array
 * @param {number} chunk_size
 * @returns {T[][]}
 */
const chunkArray = (array, chunk_size) => {
	if (!Array.isArray(array)) {
		throw new Error('array must be an array');
	}

	if (typeof chunk_size !== 'number' || chunk_size <= 0) {
		throw new Error('chunk_size must be a positive number');
	}

	let index = 0;
	const arrayLength = array.length;
	const tempArray = [];

	for (index = 0; index < arrayLength; index += chunk_size) {
		const myChunk = array.slice(index, index + chunk_size);
		tempArray.push(myChunk);
	}

	return tempArray;
};

module.exports = {
	chunkArray
};
