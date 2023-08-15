const arraysEqual = (arr1, arr2) => {
	// For it to work, the arrays should not contain {objects}
	return JSON.stringify(arr1) == JSON.stringify(arr2);
};

module.exports = {
	arraysEqual
};
