const createToken = () => {
	const token = [];
	for (let i = 0; i < 5; i += 1) {
		const num = Math.floor(Math.random() * 9 + 1);
		token.push(num);
	}
	return token.join('');
};

module.exports = {
	createToken
};
