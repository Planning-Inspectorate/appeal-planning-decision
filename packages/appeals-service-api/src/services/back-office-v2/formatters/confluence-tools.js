/* eslint-disable */

// We can ditch these when the model settles down,
// they just make it easier to get the info you need
// out of the table on Confluence

// Use this, with some edits, to get the model out of the confluence table
const extractDataFromConfluence = (table) => {
	const data = { HAS: [], S78: [] };
	for (let ii = 68; ii < 156; ii++) {
		const tds = table.children[ii].children;
		if (tds.length < 5) continue;
		const questionnaireType = tds[3].innerText;
		if (!questionnaireType.trim()) continue;
		const description = tds[5].innerText;
		const dataType = tds[7].innerText;
		const fieldName = tds[8].innerText;
		data[questionnaireType].push({ questionnaireType, description, dataType, fieldName });
	}
	return data;
};

// roughly makes a ts interface from a model
const typeMap = {
	Boolean: 'boolean',
	Numeric: 'number',
	'Select multiple': 'string[]',
	' ': 'string',
	String: 'string',
	'Free text': 'string'
};
const makeTypes = (model, interfaceName) =>
	model
		.filter(({ fieldName }) => !/^documentType/.exec(fieldName))
		.reduce(
			(acc, cur) => acc + `${cur.fieldName}: ${typeMap[cur.dataType]};\n`,
			`interface ${interfaceName} {`
		) + '}';
fs.writeFileSync('./s78.d.ts', makeTypes(model.S78, 'S78BO'));
