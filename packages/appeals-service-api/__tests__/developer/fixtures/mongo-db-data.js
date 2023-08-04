const { ObjectId } = require('mongodb');

const fakeDocuments = () => {
	return [
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a65'),
			username: 'fmiller',
			name: 'Elizabeth Ray',
			address: '9286 Bethany Glens\nVasqueztown, CO 22939',
			birthdate: new Date('226117231000'),
			email: 'arroyocolton@gmail.com',
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
					id: '699456451cc24f028d2aa99d7534c219',
					version: 1
				}
			}
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a66'),
			username: 'fmiller',
			name: 'Elizabeth Ray',
			address: '9286 Bethany Glens\nVasqueztown, CO 22939',
			birthdate: new Date('226117231000'),
			email: 'arroyocolton@gmail.com',
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
					id: '699456451cc24f028d2aa99d7534c219',
					version: 2
				}
			}
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a67'),
			username: 'fmiller',
			name: 'Elizabeth Ray',
			address: '9286 Bethany Glens\nVasqueztown, CO 22939',
			birthdate: new Date('226117231000'),
			email: 'arroyocolton@gmail.com',
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
					id: '699456451cc24f028d2aa99d7534c219',
					version: 3
				}
			}
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a69'),
			username: 'valenciajennifer',
			name: 'Lindsay Cowan',
			address: 'Unit 1047 Box 4089\nDPO AA 57348',
			birthdate: new Date('761701587000'),
			email: 'cooperalexis@hotmail.com',
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
			username: 'hillrachel',
			name: 'Katherine David',
			address: '55711 Janet Plaza Apt. 865\nChristinachester, CT 62716',
			birthdate: new Date('582848134000'),
			email: 'timothy78@hotmail.com',
			accounts: [462501, 228290, 968786, 515844, 377292],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6b'),
			username: 'serranobrian',
			name: 'Leslie Martinez',
			address: 'Unit 2676 Box 9352\nDPO AA 38560',
			birthdate: new Date('154708220000'),
			email: 'tcrawford@gmail.com',
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
			username: 'charleshudson',
			name: 'Brad Cardenas',
			address: '2765 Powers Meadow\nHeatherfurt, CT 53165',
			birthdate: new Date('231803855000'),
			email: 'dustin37@yahoo.com',
			accounts: [721914, 817222, 973067, 260799, 87389],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a6d'),
			username: 'gregoryharrison',
			name: 'Natalie Ford',
			address: '17677 Mark Crest\nWalterberg, IA 39017',
			birthdate: new Date('842634867000'),
			email: 'amyholland@yahoo.com',
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
			username: 'hmyers',
			name: 'Dana Clarke',
			address: '50047 Smith Point Suite 162\nWilkinsstad, PA 04106',
			birthdate: new Date('-16752040000'),
			email: 'vcarter@hotmail.com',
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
			username: 'andrewhamilton',
			name: 'Gary Nichols',
			address: '633 Miller Turnpike\nJonathanland, OR 62874',
			birthdate: new Date('730661849000'),
			email: 'laura34@yahoo.com',
			accounts: [385397, 337979, 325377, 440243, 586395, 86702],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a70'),
			username: 'matthewray',
			name: 'John Parks',
			address: '38456 Rachael Causeway Apt. 735\nEvanfort, AR 33893',
			birthdate: new Date('732022654000'),
			email: 'zmelton@gmail.com',
			accounts: [702610, 240640],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a71'),
			username: 'glopez',
			name: 'Jennifer Lawrence',
			address: '4140 Pamela Hollow Apt. 849\nEast Elizabeth, TN 29566',
			birthdate: new Date('90241268000'),
			email: 'scott50@yahoo.com',
			accounts: [344885, 839927, 853542],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a72'),
			username: 'wesley20',
			name: 'James Sanchez',
			address: '8681 Karen Roads Apt. 096\nLowehaven, IA 19798',
			birthdate: new Date('95789846000'),
			email: 'josephmacias@hotmail.com',
			accounts: [987709],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a73'),
			username: 'thomasdavid',
			name: 'Ashley Lopez',
			address: '18637 Jessica Ridge Apt. 157\nGrossberg, ME 84127',
			birthdate: new Date('627927174000'),
			email: 'michael16@hotmail.com',
			accounts: [662207, 816481],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a74'),
			username: 'patricia44',
			name: 'Dr. Angela Brown',
			address: '2129 Joel Rapids\nLisahaven, NE 08609',
			birthdate: new Date('235600552000'),
			email: 'michaelespinoza@gmail.com',
			accounts: [571880],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a75'),
			username: 'nelsonmaria',
			name: 'John Vega',
			address: '86636 Maria Viaduct\nKennethhaven, SD 21876',
			birthdate: new Date('432962538000'),
			email: 'ryanpena@yahoo.com',
			accounts: [88112, 567199, 436071, 226641],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a76'),
			username: 'portermichael',
			name: 'Lauren Clark',
			address: '1579 Young Trail\nJessechester, OH 88328',
			birthdate: new Date('341598359000'),
			email: 'briannafrost@yahoo.com',
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
			username: 'johnsonshelly',
			name: 'Jacqueline Haynes',
			address: 'USNS Howard\nFPO AP 30863',
			birthdate: new Date('399712377000'),
			email: 'virginia36@hotmail.com',
			accounts: [631901, 814687],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a78'),
			username: 'hunterdaniel',
			name: 'Brian Flores',
			address: '70092 Adams Prairie\nTurnerborough, TX 38603',
			birthdate: new Date('286857767000'),
			email: 'april04@gmail.com',
			accounts: [550665, 321695],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a79'),
			username: 'james75',
			name: 'Christopher Gomez',
			address: '7322 Owens Inlet Apt. 688\nPort Leslie, OR 81893',
			birthdate: new Date('156860840000'),
			email: 'omolina@gmail.com',
			accounts: [66698, 859246, 183400, 460192],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7a'),
			username: 'eric10',
			name: 'Robert Burns',
			address: '86176 Katherine Common\nWebbhaven, WA 51980',
			birthdate: new Date('648222432000'),
			email: 'barbaraduncan@gmail.com',
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
			username: 'millerrenee',
			name: 'Joshua Parker',
			address: '932 Jeremy Springs Suite 144\nJohnmouth, NM 02561',
			birthdate: new Date('363566100000'),
			email: 'nicoleanderson@hotmail.com',
			accounts: [700880, 376846, 271554],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7c'),
			username: 'michael58',
			name: 'Christine Douglas',
			address: 'USNV Chavez\nFPO AP 78727',
			birthdate: new Date('630633481000'),
			email: 'aaron99@yahoo.com',
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
			username: 'zsanders',
			name: 'Derek Curtis',
			address: '565 Hodge Motorway Suite 101\nWendyberg, FL 57099',
			birthdate: new Date('125289227000'),
			email: 'qgibson@hotmail.com',
			accounts: [928230, 120548, 667833, 810947],
			tier_and_details: {},
			version: 1
		},
		{
			_id: ObjectId('5ca4bbcea2dd94ee58162a7e'),
			username: 'taylorbullock',
			name: 'Shirley Rodriguez',
			address: '7637 Johnson Circles\nNew Laurahaven, KY 21914',
			birthdate: new Date('643551800000'),
			email: 'jonathan95@yahoo.com',
			accounts: [784245, 896066, 991412, 951840],
			tier_and_details: {},
			version: 1
		}
	];
};

module.exports = fakeDocuments;
