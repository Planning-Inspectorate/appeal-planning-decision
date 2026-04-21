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

module.exports = {
	chunkArray
};
