const LpaEntity = require('../models/entities/lpa-entity');

class LpaMapper {
	static #CSV_SEPARATOR = ';';

	csvJsonToLpaEntities(csvJson) {
		return JSON.stringify(csvJson)
			.replace('{', '')
			.replace('}', '')
			.replace(':""', '')
			.replace('OBJECTID,LPA19CD,LPA CODE,LPA19NM,EMAIL,DOMAIN,LPA ONBOARDED', '')
			.trim()
			.split(/\r?\\n/)
			.slice(1) // Removes CSV header line and leaves the value lines
			.filter((lpaRow) => lpaRow.trim().length > 6)
			.map((lpaRow) => {
				const lpaElements = lpaRow.trim().split(LpaMapper.#CSV_SEPARATOR);
				return new LpaEntity(
					null,
					lpaElements[0],
					lpaElements[1],
					lpaElements[2],
					lpaElements[3],
					lpaElements[4],
					lpaElements[5],
					lpaElements[6] && !!lpaElements[6].includes('TRUE')
				);
			});
	}
}

module.exports = LpaMapper;
