import joi from 'joi';

export default joi
	.object({
		gitSha: joi.string().optional(),
		apps: joi.object({
			appeals: joi.object({
				baseUrl: joi.string().uri()
			})
		}),
		db: joi.object({
			sql: joi.object({
				connectionString: joi.string()
			})
		}),
		featureFlagging: joi.object({
			endpoint: joi.string().optional(),
			timeToLiveInMinutes: joi.number().positive()
		}),
		logger: joi.object({
			level: joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'),
			prettyPrint: joi.boolean(),
			redact: joi.array().items(joi.string())
		}),
		oidc: joi.object({
			accessTokenFormat: joi.string().valid('jwt'), // opaque will require testing
			clients: joi.object({
				formsWebApp: joi.object({
					clientId: joi.string().uuid(),
					clientSecret: joi.string(),
					redirectUris: joi.array().items(joi.string())
				}),
				functions: joi.object({
					clientId: joi.string().uuid(),
					clientSecret: joi.string(),
					redirectUris: joi.array().items(joi.string())
				})
			}),
			cookie_keys: joi.array().items(joi.string()),
			host: joi.string(),
			jwks: joi.array().items(joi.object()),
			jwtSigningAlg: joi
				.string()
				.valid(
					'PS256',
					'PS384',
					'PS512',
					'ES256',
					'ES256K',
					'ES384',
					'ES512',
					'EdDSA',
					'RS256',
					'RS384',
					'RS512'
				),
			ttl: joi.object({
				AccessToken: joi.number().positive(),
				ClientCredentials: joi.number().positive(),
				IdToken: joi.number().positive(),
				Grant: joi.number().positive(),
				Interaction: joi.number().positive(),
				RefreshToken: joi.number().positive(),
				Session: joi.number().positive()
			})
		}),
		server: joi.object({
			allowTestingOverrides: joi.boolean(),
			port: joi.number().positive(),
			proxy: joi.boolean(),
			showErrors: joi.boolean(),
			tokenExpiry: joi.number().positive()
		}),
		services: joi.object({
			notify: {
				baseUrl: joi.string().uri(),
				serviceId: joi.string(),
				apiKey: joi.string(),
				templates: joi.object({
					APPELLANT_LOGIN: joi.object({
						confirmRegistrationEmailToAppellant: joi.string()
					}),
					SAVE_AND_RETURN: joi.object({
						enterCodeIntoServiceEmail: joi.string()
					})
				})
			}
		})
	})
	.options({ presence: 'required' }); // required by default
