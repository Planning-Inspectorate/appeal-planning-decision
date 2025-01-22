const { pickRandom, datesNMonthsAgo } = require('./util');

const representationIds = {
	representationOne: '4f7bb373-faee-47ab-9ddd-cd430c56b23e',
	representationTwo: 'd24447a2-ad41-42b7-be86-7a222ae57439',
	representationThree: 'd24247a2-ad41-42b7-be86-7a222ae57437',
	representationFour: 'd24247a2-ad41-42b7-be86-7a222ae57421',
	representationFive: 'd24247a2-ad41-42b7-be86-7a222ae57422',
	representationSix: 'd24247a2-ad41-42b7-be86-7a222ae57423',
	representationSeven: 'd24247a2-ad41-42b7-be86-7a222ae57424',
	representationEight: 'd24247a2-ad41-42b7-be86-7a222ae57425',
	representationNine: 'd24247a2-ad41-42b7-be86-7a222ae57426',
	representationTen: 'd24247a2-ad41-42b7-be86-7a222ae57427',
	representationEleven: 'd24247a2-ad41-42b7-be86-7a222ae57428',
	representationTwelve: 'd24247a2-ad41-42b7-be86-7a222ae57431',
	representationThirteen: 'd24247a2-ad41-42b7-be86-7a222ae57432'
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

const representationDocuments = [
	//lpa statement
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61556',
		Representation: {
			connect: {
				id: representationIds.representationOne
			}
		},
		Document: {
			connect: {
				id: '35880c82-7252-40a0-8dbd-30b740f22bce'
			}
		}
	},
	// rule 6 statement
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61540',
		Representation: {
			connect: {
				id: representationIds.representationEleven
			}
		},
		Document: {
			connect: {
				id: '0fc15038-7b19-4f36-92aa-bddc611f5bba'
			}
		}
	},
	// lpa final comments
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61541',
		Representation: {
			connect: {
				id: representationIds.representationThree
			}
		},
		Document: {
			connect: {
				id: '35cb4ad1-9ba3-43fb-b102-e845804ba2f7'
			}
		}
	},
	// appellant final comments
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61542',
		Representation: {
			connect: {
				id: representationIds.representationTen
			}
		},
		Document: {
			connect: {
				id: 'a1b60dc2-2253-48eb-aaea-4ec665f15fbd'
			}
		}
	},
	// lpa poe
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61543',
		Representation: {
			connect: {
				id: representationIds.representationSix
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf31'
			}
		}
	},
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61544',
		Representation: {
			connect: {
				id: representationIds.representationSix
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf32'
			}
		}
	},
	// appellant poe
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61545',
		Representation: {
			connect: {
				id: representationIds.representationSeven
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf33'
			}
		}
	},
	// r6 poes
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61546',
		Representation: {
			connect: {
				id: representationIds.representationEight
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf34'
			}
		}
	},
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61547',
		Representation: {
			connect: {
				id: representationIds.representationEight
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf35'
			}
		}
	},
	{
		id: '319612c2-9cad-48b3-bfde-faeffba61548',
		Representation: {
			connect: {
				id: representationIds.representationNine
			}
		},
		Document: {
			connect: {
				id: '5b51fcb3-54ad-4e12-974e-a59ee2abcf36'
			}
		}
	}
];

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
	},
	// proofs of evidence
	// lpa poe
	{
		id: representationIds.representationSix,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471322',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		source: 'lpa',
		representationType: 'proofs_evidence',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// appellant 1 poe
	{
		id: representationIds.representationSeven,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471323',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		source: 'citizen',
		serviceUserId: '123451',
		representationType: 'proofs_evidence',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// rule 6 poe
	{
		id: representationIds.representationEight,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471324',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		source: 'citizen',
		serviceUserId: '123998',
		representationType: 'proofs_evidence',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	{
		id: representationIds.representationNine,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471325',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		source: 'citizen',
		serviceUserId: '123999',
		representationType: 'proofs_evidence',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// appellant final comment
	{
		id: representationIds.representationTen,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471316',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'Appellant final comment Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		serviceUserId: '123451',
		representationType: 'final_comment',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	// rule 6 statements
	{
		id: representationIds.representationEleven,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471317',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'awaiting_review',
		originalRepresentation:
			'R6 Party 1 Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		serviceUserId: '123998',
		representationType: 'statement',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	{
		id: representationIds.representationTwelve,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471318',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'R6 Party 2 Statement Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		serviceUserId: '123999',
		representationType: 'statement',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	},
	{
		id: representationIds.representationThirteen,
		representationId: 'af82c699-c5ed-41dd-9b7f-172e41471366',
		AppealCase: {
			connect: {
				caseReference: '1000014'
			}
		},
		status: 'published',
		originalRepresentation:
			'R6 Party 3 Statement Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
		source: 'citizen',
		serviceUserId: '123997',
		representationType: 'statement',
		dateReceived: pickRandom(datesNMonthsAgo(0.5))
	}
];

module.exports = {
	representations,
	representationDocuments
};
