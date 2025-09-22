import resources from './resources.js';
import consts from '@pins/common/src/constants.js';
import config from '../configuration/config.js';

describe('oidc resources', () => {
	it('useGrantedResource is false', () => {
		expect(resources.enabled).toBe(true);
		expect(resources.useGrantedResource()).toBe(false);
	});

	it('defaultResource resolves to AUTH.RESOURCE', async () => {
		const def = await resources.defaultResource();
		expect(def).toBe(consts.AUTH.RESOURCE);
	});

	it('getResourceServerInfo returns expected shape', async () => {
		const info = await resources.getResourceServerInfo(null, consts.AUTH.RESOURCE, {});
		expect(info).toMatchObject({
			accessTokenFormat: config.oidc.accessTokenFormat,
			jwt: { sign: { alg: config.oidc.jwtSigningAlg } },
			audience: consts.AUTH.RESOURCE
		});
		expect(typeof info.scope).toBe('string');
		expect(info.scope.length).toBeGreaterThan(0);
	});
});
