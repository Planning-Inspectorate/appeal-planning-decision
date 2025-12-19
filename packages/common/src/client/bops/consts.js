exports.applicationTypes = {
	advertConsent: 'advertConsent', // Consent to display an advertisement
	amendment: 'amendment', // Consent to make small changes to a project with Planning Permission
	amendment_minorMaterial: 'amendment.minorMaterial', // Consent to make small (minor material) changes to a project with Planning Permission
	amendment_nonMaterial: 'amendment.nonMaterial', // Consent to make small (non-material) changes to a project with Planning Permission
	approval: 'approval', // Planning approval
	approval_conditions: 'approval.conditions', // Approval of details reserved by condition
	approval_reservedMatters: 'approval.reservedMatters', // Approval of reserved matters
	complianceConfirmation: 'complianceConfirmation', // Written confirmation of compliance with a planning condition
	environmentalImpact: 'environmentalImpact', // Environmental Impact Decision
	environmentalImpact_scoping: 'environmentalImpact.scoping', // Environmental Impact Decision - Scoping
	environmentalImpact_screening: 'environmentalImpact.screening', // Environmental Impact Decision - Screening
	hazardousSubstanceConsent: 'hazardousSubstanceConsent', // Consent to move and dispose of hazardous substances
	hedgerowRemovalNotice: 'hedgerowRemovalNotice', // Notice to remove a hedge
	landDrainageConsent: 'landDrainageConsent', // Consent to do works affecting ordinary watercourses or land drainage
	ldc: 'ldc', // Lawful Development Certificate
	ldc_breachOfCondition: 'ldc.breachOfCondition', // Lawful Development Certificate - Existing use lawful not to comply with a condition (S191C)
	ldc_existing: 'ldc.existing', // Lawful Development Certificate - Existing use
	ldc_listedBuildingWorks: 'ldc.listedBuildingWorks', // Lawful Development Certificate - Works to a Listed Building (S26H)
	ldc_proposed: 'ldc.proposed', // Lawful Development Certificate - Proposed use
	listed: 'listed', // Consent to do works to a Listed Building
	notifyCompletion: 'notifyCompletion', // Notification of completion
	obligation: 'obligation', // Planning obligation
	obligation_discharge: 'obligation.discharge', // Discharge a planning obligation
	obligation_modify: 'obligation.modify', // Modify a planning obligation
	onshoreExtractionOilAndGas: 'onshoreExtractionOilAndGas', // Onshore extraction of oil and gas
	onshoreExtractionOilAndGas_other: 'onshoreExtractionOilAndGas.other', // Onshore extraction of oil and gas - Other
	onshoreExtractionOilAndGas_pp_extension: 'onshoreExtractionOilAndGas.pp.extension', // Onshore extraction of oil and gas - Full planning permission for an extension to an existing site including associated development
	onshoreExtractionOilAndGas_pp_waste: 'onshoreExtractionOilAndGas.pp.waste', // Onshore extraction of oil and gas - Full planning permission for waste development
	onshoreExtractionOilAndGas_pp_working: 'onshoreExtractionOilAndGas.pp.working', // Onshore extraction of oil and gas - Full planning permission for oil and gas working including exploratory, appraisal and production phases
	onshoreExtractionOilAndGas_review: 'onshoreExtractionOilAndGas.review', // Onshore extraction of oil and gas - Review of conditions applying to Mineral Permissions (ROMPs)
	onshoreExtractionOilAndGas_variation: 'onshoreExtractionOilAndGas.variation', // Onshore extraction of oil and gas - Variation of conditions
	pa: 'pa', // Prior Approval
	pa_part1_classA: 'pa.part1.classA', // Prior Approval - Larger extension to a house
	pa_part1_classAA: 'pa.part1.classAA', // Prior Approval - Adding storeys to a house
	pa_part11_classB: 'pa.part11.classB', // Prior Approval - Demolish a building
	pa_part14_classA: 'pa.part14.classA', // Prior Approval - Install or change solar equipment on domestic premises
	pa_part14_classB: 'pa.part14.classB', // Prior Approval - Install or change stand-alone solar equipment on domestic premises
	pa_part14_classJ: 'pa.part14.classJ', // Prior Approval - Install or change solar panels
	pa_part14_classK: 'pa.part14.classK', // Prior Approval - Install or change stand-alone solar equipment on non-domestic premises
	pa_part14_classOA: 'pa.part14.classOA', // Prior Approval - Installation of a solar canopy on non-domestic, off-street parking
	pa_part16_classA: 'pa.part16.classA', // Prior Approval - Install telecommunications equipment
	pa_part17: 'pa.part17', // Prior Approval - Coal mining
	pa_part17_classB: 'pa.part17.classB', // Prior Approval - Other developments ancillary to mining operations
	pa_part17_classC: 'pa.part17.classC', // Prior Approval - Developments for maintenance or safety
	pa_part17_classG: 'pa.part17.classG', // Prior Approval - Coal mining development by the Coal Authority for maintenance or safety
	pa_part18_classA: 'pa.part18.classA', // Prior Approval - Development under private acts or orders
	pa_part19_classTA: 'pa.part19.classTA', // Prior Approval - Development on a closed defence site
	pa_part20_classA: 'pa.part20.classA', // Prior Approval - Build homes on a detached blocks of flats
	pa_part20_classAA: 'pa.part20.classAA', // Prior Approval - Build homes on a detached commercial building
	pa_part20_classAB: 'pa.part20.classAB', // Prior Approval - Build homes on an adjoining commercial or mixed use building
	pa_part20_classAC: 'pa.part20.classAC', // Prior Approval - Build homes on adjoining houses
	pa_part20_classAD: 'pa.part20.classAD', // Prior Approval - Build homes on detached houses
	pa_part20_classZA: 'pa.part20.classZA', // Prior Approval - Demolish buildings and build homes in their place
	pa_part3_classG: 'pa.part3.classG', // Prior Approval - Convert a commercial building to mixed use
	pa_part3_classM: 'pa.part3.classM', // Prior Approval - Convert a mixed use building into a home
	pa_part3_classMA: 'pa.part3.classMA', // Prior Approval - Convert a commercial building into a home or homes
	pa_part3_classN: 'pa.part3.classN', // Prior Approval - Convert a casino or amusement arcade into a home or homes
	pa_part3_classQ: 'pa.part3.classQ', // Prior Approval - Convert an agricultural building into a home
	pa_part3_classR: 'pa.part3.classR', // Prior Approval - Convert an agricultural building to a commercial use
	pa_part3_classS: 'pa.part3.classS', // Prior Approval - Convert an agricultural building to a school
	pa_part3_classT: 'pa.part3.classT', // Prior Approval - Convert a commercial building to a school
	pa_part3_classV: 'pa.part3.classV', // Prior Approval - Changes of use permitted under a permission granted on an application
	pa_part4_classBB: 'pa.part4.classBB', // Prior Approval - Put up a temporary structure
	pa_part4_classBC: 'pa.part4.classBC', // Prior Approval - Develop a temporary campsite
	pa_part4_classCA: 'pa.part4.classCA', // Prior Approval - Put temporary school buildings on vacant commercial land
	pa_part4_classE: 'pa.part4.classE', // Prior Approval - Use a building or land to shoot a film
	pa_part6: 'pa.part6', // Prior Approval - Alter or add new buildings to agricultural or forestry sites
	pa_part6_classA: 'pa.part6.classA', // Prior Approval - Build new agricultural buildings on a unit of 5 hectares or more
	pa_part6_classB: 'pa.part6.classB', // Prior Approval - Build new agricultural buildings on a unit of less than 5 hectares
	pa_part6_classE: 'pa.part6.classE', // Prior Approval - Build new forestry buildings
	pa_part7_classC: 'pa.part7.classC', // Prior Approval - Install click and collect facilities
	pa_part7_classM: 'pa.part7.classM', // Prior Approval - Extend a school, college, university, prison or hospital
	pa_part9_classD: 'pa.part9.classD', // Prior Approval - Development of toll facilities
	pp: 'pp', // Planning Permission
	pp_full: 'pp.full', // Planning Permission for development, including all householder, minor, and major applications
	pp_full_advertConsent: 'pp.full.advertConsent', // Full Planning Permission and consent to display an advert
	pp_full_demolition: 'pp.full.demolition', // Full Planning Permission including demolition in a Conservation Area
	pp_full_fastTrack_affordable: 'pp.full.fastTrack.affordable', // Full Planning Permission - Fast track for the purposes of Affordable Housing
	pp_full_householder: 'pp.full.householder', // Planning Permission - Full householder
	pp_full_householder_listed: 'pp.full.householder.listed', // Planning Permission - Full householder with consent to do works to a Listed Building
	pp_full_householder_retro: 'pp.full.householder.retro', // Planning Permission - Full householder retrospective
	pp_full_major: 'pp.full.major', // Planning Permission - Major application
	pp_full_major_technicalDetails: 'pp.full.major.technicalDetails', // Planning Permission - Technical details consent for major development
	pp_full_major_technicalDetails_waste: 'pp.full.major.technicalDetails.waste', // Planning Permission - Technical details consent for waste development
	pp_full_major_waste: 'pp.full.major.waste', // Planning Permission - Full planning permission for waste development
	pp_full_minor: 'pp.full.minor', // Planning Permission - Minor application
	pp_full_minor_listed: 'pp.full.minor.listed', // Planning Permission - Minor application and consent to do works to a Listed Building
	pp_full_minor_technicalDetails: 'pp.full.minor.technicalDetails', // Planning Permission - Technical details consent for minor development
	pp_mineralExtraction: 'pp.mineralExtraction', // Planning Permission - Consent to extract minerals and related development, such as temporary buildings and roads
	pp_outline: 'pp.outline', // Planning permission - Outline for proposed development
	pp_outline_all: 'pp.outline.all', // Outline Planning Permission - Consent for the principle of a project witholding all details
	pp_outline_major: 'pp.outline.major', // Planning permission - Outline for proposed development (major)
	pp_outline_major_all: 'pp.outline.major.all', // Outline Planning Permission - Consent for the principle of a project witholding all details (major)
	pp_outline_major_all_waste: 'pp.outline.major.all.waste', // Outline Planning Permission - Consent for the principle of waste development witholding all details
	pp_outline_major_some: 'pp.outline.major.some', // Outline Planning Permission - Consent for the principle of a project specifying some details (major)
	pp_outline_major_some_waste: 'pp.outline.major.some.waste', // Outline Planning Permission - Consent for the principle of waste development witholding some details
	pp_outline_minor: 'pp.outline.minor', // Planning permission - Outline for proposed development (minor)
	pp_outline_minor_all: 'pp.outline.minor.all', // Outline Planning Permission - Consent for the principle of a project witholding all details (minor)
	pp_outline_minor_some: 'pp.outline.minor.some', // Outline Planning Permission - Consent for the principle of a project specifying some details (minor)
	pp_outline_some: 'pp.outline.some', // Outline Planning Permission - Consent for the principle of a project specifying some details
	pp_pip: 'pp.pip', // Planning Permission in Principle - Consent for the principle of a project with less than 1,000 square metres floor area on a site of less than 1 hectare
	rightsOfWayOrder: 'rightsOfWayOrder', // Rights of Way Order - Apply to move or close a path
	wtt: 'wtt', // Works to trees
	wtt_consent: 'wtt.consent', // Works to trees - Consent to carry out works to a tree with a Tree Preservation Order
	wtt_notice: 'wtt.notice' // Works to trees - Notification of proposed works to a tree in a Conservation Area
};

exports.decisions = {
	granted: 'granted',
	refused: 'refused',
	not_required: 'not_required'
};

exports.statuses = {
	determined: 'determined',
	withdrawn: 'withdrawn',
	in_assessment: 'in_assessment',
	awaiting_determination: 'awaiting_determination'
	// appeal_started: 'Appeal started',
	// appeal_lodged: 'Appeal lodged',
	// appeal_allowed: 'Appeal allowed'
};
