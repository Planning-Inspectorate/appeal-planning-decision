import OIDC from 'oidc-provider';
import consts from '@pins/common/src/constants.js';
import oidcConfig from './index.js';
import { subscribe } from '../lib/oidc-logging.js';
import * as otp from '../grants/otp-grant-handler.js';
import * as ropc from '../grants/ropc-grant-handler.js';
import Adapter from '../adapter/prisma-adapter.js';
import Account from '../account/account.js';
import config from '../configuration/config.js';

/**
 * @param {import('../dependencies.js').lifetimeDependencies} lifetimeDependencies
 * @returns {import('oidc-provider').Provider}
 */
const setupOidc = (lifetimeDependencies) => {
	const { primsaClient, logger } = lifetimeDependencies;
	Adapter.setDependencies(primsaClient, logger);

	oidcConfig.configuration.findAccount = Account.findAccount;
	oidcConfig.configuration.adapter = Adapter;

	const oidc = new OIDC(`${oidcConfig.host}:${config.server.port}`, oidcConfig.configuration);
	oidc.proxy = config.server.proxy;
	oidc.registerGrantType(
		consts.AUTH.GRANT_TYPE.OTP,
		otp.handler(lifetimeDependencies),
		otp.parameters,
		[]
	);
	oidc.registerGrantType(
		consts.AUTH.GRANT_TYPE.ROPC,
		ropc.handler(lifetimeDependencies),
		ropc.parameters,
		[]
	);
	subscribe(oidc, logger);

	return oidc;
};

export default setupOidc;
