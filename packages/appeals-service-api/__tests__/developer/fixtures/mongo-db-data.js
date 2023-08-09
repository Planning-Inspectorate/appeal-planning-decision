const { ObjectId } = require('mongodb');

const fakeDocuments = () => {
	return [
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a65'),
			username: 'ekrabappel',
			name: 'Edna Krabappel',
			address: '1600 12th Avenue\nSpringfield, OR 80085',
			birthdate: new Date('226117231000'),
			email: 'ekrabappel@example.com',
			active: true,
			accounts: [371138, 324287, 276528, 332179, 422649, 387979],
			tier_and_details: {
				'0df078f33aa74a2e9696e0520c1a828a': {
					tier: 'Bronze',
					id: '0df078f33aa74a2e9696e0520c1a828a',
					active: true,
					benefits: ['sports tickets']
				},
				'699456451cc24f028d2aa99d7534c219': {
					tier: 'Bronze',
					benefits: ['24 hour dedicated line', 'concierge services'],
					active: true,
					id: '699456451cc24f028d2aa99d7534c219'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a66'),
			username: 'ekrabappel',
			name: 'Edna Krabappel',
			address: '1600 12th Avenue\nSpringfield, OR 80085',
			birthdate: new Date('226117231000'),
			email: 'ekrabappel@example.com',
			active: true,
			accounts: [371138, 324287, 276528, 332179, 422649, 387979],
			tier_and_details: {
				'0df078f33aa74a2e9696e0520c1a828a': {
					tier: 'Bronze',
					id: '0df078f33aa74a2e9696e0520c1a828a',
					active: true,
					benefits: ['sports tickets']
				},
				'699456451cc24f028d2aa99d7534c219': {
					tier: 'Bronze',
					benefits: ['24 hour dedicated line', 'concierge services'],
					active: true,
					id: '699456451cc24f028d2aa99d7534c219'
				}
			},
			version: 2
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a67'),
			username: 'ekrabappel',
			name: 'Edna Krabappel',
			address: '1600 12th Avenue\nSpringfield, OR 80085',
			birthdate: new Date('226117231000'),
			email: 'ekrabappel@example.com',
			active: true,
			accounts: [371138, 324287, 276528, 332179, 422649, 387979],
			tier_and_details: {
				'0df078f33aa74a2e9696e0520c1a828a': {
					tier: 'Bronze',
					id: '0df078f33aa74a2e9696e0520c1a828a',
					active: true,
					benefits: ['sports tickets']
				},
				'699456451cc24f028d2aa99d7534c219': {
					tier: 'Bronze',
					benefits: ['24 hour dedicated line', 'concierge services'],
					active: true,
					id: '699456451cc24f028d2aa99d7534c219'
				}
			},
			version: 3
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a69'),
			username: 'eabernathy',
			name: 'Eleanor Abernathy',
			address: '1601 12th Avenue\nSpringfield, OR 80085',
			birthdate: new Date('761701587000'),
			email: 'eabernathy@example.com',
			accounts: [116508],
			tier_and_details: {
				c06d340a4bad42c59e3b6665571d2907: {
					tier: 'Platinum',
					benefits: ['dedicated account representative'],
					active: true,
					id: 'c06d340a4bad42c59e3b6665571d2907'
				},
				'5d6a79083c26402bbef823a55d2f4208': {
					tier: 'Bronze',
					benefits: ['car rental insurance', 'concierge services'],
					active: true,
					id: '5d6a79083c26402bbef823a55d2f4208'
				},
				b754ec2d455143bcb0f0d7bd46de6e06: {
					tier: 'Gold',
					benefits: ['airline lounge access'],
					active: true,
					id: 'b754ec2d455143bcb0f0d7bd46de6e06',
					version: 1
				}
			}
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6a'),
			username: 'avenderbuckle',
			name: 'Amelia Venderbuckle',
			address: '13 Elm Street\nSpringfield, OR 80085',
			birthdate: new Date('582848134000'),
			email: 'avanderbuckle@example.com',
			accounts: [462501, 228290, 968786, 515844, 377292],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6b'),
			username: 'anahasapeemapetilon',
			name: 'Apu Nahasapeemapetilon',
			address: 'Kwik-e-mart\nSpringfield, OR 80085',
			birthdate: new Date('154708220000'),
			email: 'anahasapeemapetilon@example.com',
			accounts: [170945, 951849],
			tier_and_details: {
				a15baf69a759423297f11ce6c7b0bc9a: {
					tier: 'Platinum',
					benefits: ['airline lounge access'],
					active: true,
					id: 'a15baf69a759423297f11ce6c7b0bc9a'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6c'),
			username: 'cwiggum',
			name: 'Clancy Wiggum',
			address: '1301 257th Street\nSpringfield, OR 80085',
			birthdate: new Date('231803855000'),
			email: 'cwiggum@example.com',
			accounts: [721914, 817222, 973067, 260799, 87389],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6d'),
			username: 'kbrockman',
			name: 'Kent Brockman',
			address: '164 Main Street\nSpringfield, OR 80085',
			birthdate: new Date('842634867000'),
			email: 'kbrockman@example.com',
			accounts: [904260, 565468],
			tier_and_details: {
				'69f8b6a3c39c42edb540499ee2651b75': {
					tier: 'Bronze',
					benefits: ['dedicated account representative', 'airline lounge access'],
					active: true,
					id: '69f8b6a3c39c42edb540499ee2651b75'
				},
				c85df12c2e394afb82725b16e1cc6789: {
					tier: 'Bronze',
					benefits: ['airline lounge access'],
					active: true,
					id: 'c85df12c2e394afb82725b16e1cc6789'
				},
				'07d516cfd7fc4ec6acf175bb78cb98a2': {
					tier: 'Gold',
					benefits: ['dedicated account representative'],
					active: true,
					id: '07d516cfd7fc4ec6acf175bb78cb98a2'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6e'),
			username: 'mszyslak',
			name: 'Moe Szyslak',
			address: 'Moes Tavern\nSpringfield, OR 80085',
			birthdate: new Date('-16752040000'),
			email: 'mszyslak@example.com',
			accounts: [627629, 55958, 771641],
			tier_and_details: {
				'4c207e65857742f89d8155139b24c0f0': {
					tier: 'Silver',
					benefits: ['car rental insurance', 'travel insurance'],
					active: true,
					id: '4c207e65857742f89d8155139b24c0f0'
				},
				c04ee1d7093449148a3cc3bbca398529: {
					tier: 'Platinum',
					benefits: ['24 hour dedicated line', 'dedicated account representative'],
					active: true,
					id: 'c04ee1d7093449148a3cc3bbca398529'
				},
				'1e64a51089c54d08911baf77be6b3713': {
					tier: 'Gold',
					benefits: ['concert tickets', 'dedicated account representative'],
					active: true,
					id: '1e64a51089c54d08911baf77be6b3713'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6f'),
			username: 'nflanders',
			name: 'Ned Flanders',
			address: '744 Evergreen Terrace\nSpringfield, OR 80085',
			birthdate: new Date('730661849000'),
			email: 'nflanders@example.com',
			accounts: [385397, 337979, 325377, 440243, 586395, 86702],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a70'),
			username: 'pbouvier',
			name: 'Patty Bouvier',
			address: '38456 Peanut Street\nSpringfield, OR 80085',
			birthdate: new Date('732022654000'),
			email: 'pbouvier@example.com',
			accounts: [702610, 240640],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a71'),
			username: 'sbouvier',
			name: 'Selma Bouvier',
			address: '38457 Peanut Street\nSpringfield, OR 80085',
			birthdate: new Date('90241268000'),
			email: 'sbouvier@example.com',
			accounts: [344885, 839927, 853542],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a72'),
			username: 'sskinner',
			name: 'Seymour Skinner',
			address: '959 Sycamore Avenue\nSpringfield, OR 80085',
			birthdate: new Date('95789846000'),
			email: 'sskinner@example.com',
			accounts: [987709],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a73'),
			username: 'sbob',
			name: 'Sideshow Bob',
			address: 'Fast-food Boulevard\nSpringfield, OR 80085',
			birthdate: new Date('627927174000'),
			email: 'sbob@example.com',
			accounts: [662207, 816481],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a74'),
			username: 'jhibbert',
			name: 'Dr. Julius Hibbert',
			address: 'Rural Route 27\nSpringfield, OR 80085',
			birthdate: new Date('235600552000'),
			email: 'jhibbert@example.com',
			accounts: [571880],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a75'),
			username: 'nriviera',
			name: 'Dr Nick Riviera',
			address: 'Rural Route 27\nSpringfield, OR 80085',
			birthdate: new Date('432962538000'),
			email: 'nriviera@example.com',
			accounts: [88112, 567199, 436071, 226641],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a76'),
			username: 'ehoover',
			name: 'Elizabeth Hoover',
			address: '1944 Evergreen Terrace\nSpringfield, OR 80085',
			birthdate: new Date('341598359000'),
			email: 'ehoover@example.com',
			accounts: [883283, 980867, 164836, 200611, 528224, 931483],
			tier_and_details: {
				b0d8ebd346824edc890898b0b2ad6e2d: {
					tier: 'Silver',
					benefits: ['concert tickets', 'sports tickets'],
					active: true,
					id: 'b0d8ebd346824edc890898b0b2ad6e2d'
				},
				'7c20a340b924446fa00663f0a0c0c9f7': {
					tier: 'Silver',
					benefits: ['24 hour dedicated line', 'airline lounge access'],
					active: true,
					id: '7c20a340b924446fa00663f0a0c0c9f7'
				},
				f4ccc57442504cddbc5002e720e4a2e5: {
					tier: 'Platinum',
					benefits: ['shopping discounts', 'dedicated account representative'],
					active: true,
					id: 'f4ccc57442504cddbc5002e720e4a2e5'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a77'),
			username: 'hhermann',
			name: 'Herman Hermann',
			address: '47 West Oak Street\nSpringfield, OR 80085',
			birthdate: new Date('399712377000'),
			email: 'hhermann@example.com',
			accounts: [631901, 814687],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a78'),
			username: 'lhutz',
			name: 'Lionel Hutz',
			address: '2750 Main Street\nSpringfield, OR 80085',
			birthdate: new Date('286857767000'),
			email: 'lhutz@example.com',
			accounts: [550665, 321695],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a79'),
			username: 'tmcclure',
			name: 'Troy McClure',
			address: '2752 Main Street\nSpringfield, OR 80085',
			birthdate: new Date('156860840000'),
			email: 'tmcclure@example.com',
			accounts: [66698, 859246, 183400, 460192],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7a'),
			username: 'askinner',
			name: 'Agnes Skinner',
			address: '23 Matlock Expressway\nSpringfield, OR 80085',
			birthdate: new Date('648222432000'),
			email: 'askinner@example.com',
			accounts: [205563, 616602, 387877, 460069, 442724],
			tier_and_details: {
				'59ee9884093f41cc94b4b59e81655bf4': {
					tier: 'Platinum',
					benefits: ['sports tickets'],
					active: true,
					id: '59ee9884093f41cc94b4b59e81655bf4'
				},
				'9c2b892696094a588d2da74a76f2dc63': {
					tier: 'Gold',
					benefits: ['car rental insurance'],
					active: true,
					id: '9c2b892696094a588d2da74a76f2dc63'
				},
				f818540428174b89bc7060618facc97d: {
					tier: 'Platinum',
					benefits: ['24 hour dedicated line'],
					active: true,
					id: 'f818540428174b89bc7060618facc97d'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7b'),
			username: 'gwillie',
			name: 'Groundskeeper Willie',
			address: '1923 Main Street\nSpringfield, OR 80085',
			birthdate: new Date('363566100000'),
			email: 'gwillie@example.com',
			accounts: [700880, 376846, 271554],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7c'),
			username: 'hmoleman',
			name: 'Hans Moleman',
			address: '3456 D Street\nSpringfield, OR 80085',
			birthdate: new Date('630633481000'),
			email: 'hmoleman@example.com',
			accounts: [177069, 233104, 671035, 575454, 285919, 947160],
			tier_and_details: {
				'14540f8bc96947fdb620f52768acce16': {
					tier: 'Gold',
					benefits: ['sports tickets'],
					active: true,
					id: '14540f8bc96947fdb620f52768acce16'
				},
				'6f4836805a744592a2193a45e9801038': {
					tier: 'Silver',
					benefits: ['car rental insurance', 'concert tickets'],
					active: true,
					id: '6f4836805a744592a2193a45e9801038'
				}
			},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7d'),
			username: 'cspuckler',
			name: 'Cletus Spuckler',
			address: 'Fast-food Boulevard\nSpringfield, OR 80085',
			birthdate: new Date('125289227000'),
			email: 'cspuckler@example.com',
			accounts: [928230, 120548, 667833, 810947],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7e'),
			username: 'dstu',
			name: 'Disco Stu',
			address: '1 Main Street\nSpringfield, OR 80085',
			birthdate: new Date('643551800000'),
			email: 'dstu@example.com',
			accounts: [784245, 896066, 991412, 951840],
			tier_and_details: {},
			version: 1
		}
	];
};

module.exports = fakeDocuments;
