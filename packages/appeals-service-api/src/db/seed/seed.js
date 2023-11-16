const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const users = [
		{
			email: 'user1@planninginspectorate.gov.uk',
			isLpaAdmin: false,
			lpaCode: 'Q9999',
			lpaStatus: 'added'
		},
		{
			email: 'admin1@planninginspectorate.gov.uk',
			isLpaAdmin: true,
			lpaCode: 'Q9999',
			lpaStatus: 'confirmed'
		}
	];
	for (const user of users) {
		await prisma.appealUser.upsert({
			create: user,
			update: user,
			where: { email: user.email }
		});
	}
	// todo: seed more data needed for local dev
	console.log('dev seed complete');
}

main().catch(console.error);
