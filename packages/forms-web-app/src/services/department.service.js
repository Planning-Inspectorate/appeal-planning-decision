const { getLPAList } = require('../lib/appeals-api-wrapper');

let departmentsById = {};
let departmentsByCode = {};
let departmentsByName = {};
let departments = [];
let eligibleDepartments = [];
let ineligibleDepartments = [];

async function initLPALists() {
	const lpaList = await getLPAList();
	const { data } = lpaList;
	eligibleDepartments = [];
	ineligibleDepartments = [];
	departments = data.map((department) => {
		departmentsById[department.id] = department;
		departmentsByCode[department.lpaCode] = department;
		departmentsByName[department.name] = department;
		if (department.inTrial) {
			eligibleDepartments.push(department.name);
		} else {
			ineligibleDepartments.push(department.name);
		}
		return department.name;
	});
}

const getRefreshedDepartmentData = async () => {
	await initLPALists();
	return { departments, eligibleDepartments, ineligibleDepartments };
};

const getDepartmentData = async () => {
	if (!departments.length) {
		await initLPALists();
	}
	return { departments, eligibleDepartments, ineligibleDepartments };
};

const getDepartmentFromId = async (id) => {
	if (!departments.length) {
		await initLPALists();
	}
	return departmentsById[id];
};

const getDepartmentFromCode = async (lpaCode) => {
	if (!departments.length) {
		await initLPALists();
	}
	return departmentsByCode[lpaCode];
};

const getDepartmentFromName = async (name) => {
	if (!departments.length) {
		await initLPALists();
	}
	return departmentsByName[name];
};

const resetDepartments = () => {
	departments = [];
	eligibleDepartments = [];
	ineligibleDepartments = [];
	departmentsById = {};
	departmentsByName = {};
};

module.exports = {
	getRefreshedDepartmentData,
	getDepartmentData,
	getDepartmentFromId,
	getDepartmentFromCode,
	getDepartmentFromName,
	resetDepartments
};
