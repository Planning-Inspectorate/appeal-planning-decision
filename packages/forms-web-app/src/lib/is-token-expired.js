const isTokenExpired = (minutes, timeCreated, timeNow = new Date()) => {
	return Math.ceil((timeNow - timeCreated) / 60000) > minutes;
};

module.exports = { isTokenExpired };
