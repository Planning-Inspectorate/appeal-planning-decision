const { validate: validateUuid } = require('uuid');
const passportWrapper = require('../auth/passportWrapper');
const { getAppeal } = require('../lib/appeals-api-wrapper');
const logger = require('../lib/logger');
const ExpiredJWTError = require('../auth/error/ExpiredJWTError');
const { COOKIE_JWT } = require('../auth/config').strategyName;

async function getLPACode(appealId) {
  if (!appealId || !validateUuid(appealId)) {
    logger.error('AppealId is undefined.');
    return undefined;
  }

  let lpaCode;
  try {
    logger.debug({ appealId }, 'Get appeal by id');
    const appeal = await getAppeal(appealId);
    if (appeal.errors) {
      logger.error(`Get appeal by id returned error response. ${JSON.stringify(appeal)}`);
    } else {
      lpaCode = appeal.lpaCode;
    }
  } catch (err) {
    logger.error({ err }, 'Error retrieving appeal');
  }

  return lpaCode;
}

function getUserData(req, res, jwtToken) {
  if (!jwtToken.userData) {
    req.log.error('JWT Cookie does not contain mandatory user data object.');
    return undefined;
  }

  return jwtToken.userData;
}

function handleJWTExpired(req, res, err) {
  req.log.debug('Cookie JWT token is expired. User will be redirected to login page.');
  const userData = getUserData(req, res, err.jwtPayload);
  if (!userData) {
    return res.status(404).send();
  }

  return res.redirect(`/${userData.lpaCode}/authentication/your-email/session-expired`);
}

async function handleJWTError(req, res, err) {
  req.log.debug({ err }, 'User is not authenticated and will be redirected to login page.');

  const lpaCode = await getLPACode(req.params?.id);
  if (!lpaCode) {
    req.log.error(
      `Failure occurred while trying to redirect user to /authentication/your-email page. Appeal does not exist, we can't get lpaCode.`
    );
    return res.status(404).send();
  }

  return res.redirect(`/${lpaCode}/authentication/your-email`);
}

module.exports = async (req, res, next) => {
  return passportWrapper
    .authenticate(COOKIE_JWT, req, res)
    .then((jwtPayload) => {
      const userData = getUserData(req, res, jwtPayload);
      if (!userData) {
        return res.status(404).send();
      }

      req.userData = userData;
      req.log.debug('User is authenticated.');
      return next();
    })
    .catch((err) => {
      if (err instanceof ExpiredJWTError) {
        return handleJWTExpired(req, res, err);
      }
      return handleJWTError(req, res, err);
    });
};
