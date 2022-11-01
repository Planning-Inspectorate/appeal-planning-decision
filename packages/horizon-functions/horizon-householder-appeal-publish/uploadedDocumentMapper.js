const _findKey = (obj, keys, array) => {
	for (let [k, v] of Object.entries(obj)) {
		if (keys.includes(k)) {
			if (Array.isArray(v)) {
				v.map((value) => array.push({ id: value.id }));
			} else {
				array.push({ id: v.id });
			}
		}

		if (typeof v === 'object' && v !== null) {
			let found = _findKey(v, keys, array);
			if (found) return found;
		}
	}
};

const uploadedDocumentMapper = (event) => {
	let documents = [];
	_findKey(event, ['uploadedFile', 'uploadedFiles'], documents);
	documents = documents.filter((document) => document.id !== null);
	return documents;
};

module.exports = uploadedDocumentMapper;
