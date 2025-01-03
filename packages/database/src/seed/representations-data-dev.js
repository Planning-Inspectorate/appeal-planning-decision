const { pickRandom, datesNMonthsAgo } = require('./util');

const representationIds = {
	representationOne: '4f7bb373-faee-47ab-9ddd-cd430c56b23e',
	representationTwo: 'd24447a2-ad41-42b7-be86-7a222ae57439',
	representationThree: 'd24247a2-ad41-42b7-be86-7a222ae57437',
	representationFour: 'd24247a2-ad41-42b7-be86-7a222ae57421',
	representationFive: 'd24247a2-ad41-42b7-be86-7a222ae57422'
};

const caseReferences = {
	caseReferenceOne: '1010101',
	caseReferenceTwo: '1010102',
	caseReferenceThree: '1010103',
	caseReferenceFour: '1010104',
	caseReferenceFive: '1010105',
	caseReferenceSix: '1010106',
	caseReferenceSeven: '1010107',
	caseReferenceEight: '1010108',
	caseReferenceNine: '1010109'
};

/**
 * @type {import('@prisma/client').Prisma.RepresentationCreateInput[]}
 */
const representations = [
	// lpa statements
	{
		id: representationIds.representationOne,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471345',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'Statement Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'lpa',
		representationType: 'statement',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	{
		id: representationIds.representationTwo,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471346',
		AppealCase: {
			connect: {
				caseReference: caseReferences.caseReferenceOne
			}
		},
		status: 'published',
		originalRepresentation:
			'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'lpa',
		representationType: 'statement',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// lpa final comment
	{
		id: representationIds.representationThree,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471347',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'Comment Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'lpa',
		representationType: 'final_comment',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// interested party comments
	{
		id: representationIds.representationFour,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471348',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'IP Comment 1 Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		representationType: 'comment',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	{
		id: representationIds.representationFive,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471321',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'IP Comment 2 Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		representationType: 'comment',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	}
];

module.exports = {
	representations
};
