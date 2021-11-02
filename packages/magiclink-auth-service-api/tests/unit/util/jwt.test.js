const jwt = require('../../../src/util/jwt');

const payload = {
  attribute: 'mockValue',
  exp: 12344,
};

describe('util.jwt', () => {
  describe('sign', () => {
    it('should create a signed jwt token', () => {
      const jwtToken = jwt.sign(payload);

      const jwtComponents = jwtToken.split('.');
      expect(jwtComponents.length).toEqual(3);

      const header = Buffer.from(jwtComponents[0], 'base64').toString();
      const payloadObject = Buffer.from(jwtComponents[1], 'base64').toString();
      expect(JSON.parse(header)).toEqual({ alg: 'HS256', typ: 'JWT' });
      expect(JSON.parse(payloadObject).attribute).toEqual(payload.attribute);
    });
  });
});
