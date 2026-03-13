const config = require('./config');

describe('config - feedback URL functions', () => {
	describe('generateBetaBannerFeedbackLink', () => {
		it('should generate the correct HTML string for the beta banner', () => {
			const mockUrl = 'https://example.com/feedback';
			const result = config.generateBetaBannerFeedbackLink(mockUrl);

			expect(result).toBe(
				` – your <a class="govuk-link" data-cy="Feedback" href="https://example.com/feedback">feedback</a> will help us to improve it.`
			);
		});
	});

	describe('getAppealTypeFeedbackUrl', () => {
		it.each([
			[
				'S78',
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UQzg1SlNPQjA3V0FDNUFJTldHMlEzMDdMRS4u&route=shorturl'
			],
			[
				'S20',
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UQjI0R09ONVRVNVJZVk9XMzBYTFo2RDlQUy4u&route=shorturl'
			],
			[
				'HAS',
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UQ0wyTE9UVDIyWlVaQlBBTEM0TFYyU01YVC4u&route=shorturl'
			],
			[
				'CAS_PLANNING',
				'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5URE1RMzFNSVQzUjBWRlQ2VFFPUTI3TkVSVC4u'
			],
			[
				'CAS_ADVERTS',
				'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOVZRWTJSOUdWUDk3T0owQTVFNExTUzlVSC4u'
			],
			[
				'ADVERTS',
				'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UREdSMUZXUFhUMUdBUERBUFFGVkRQVEFBTS4u'
			],
			[
				'LDC',
				'https://forms.cloud.microsoft/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UNldFVDNBWVQ4UTFGMzNFNEQ2UjNITlMyOC4u'
			],
			[
				'ENFORCEMENT',
				'https://forms.cloud.microsoft/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UQVRSQlBKOUJVR05TOE1URElSSUVZUjVDMS4u&route=shorturl'
			],
			[
				'ENFORCEMENT_LISTED',
				'https://forms.cloud.microsoft/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UNDJFTjBCRTlFV1pYVjVWRkhKQVBYTVRKUC4u&route=shorturl'
			],
			[
				'UNKNOWN_TYPE',
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOUlNRkhaQjNXTDQyNEhSRExNOFVGSkNJTS4u&route=shorturl'
			],
			[
				undefined,
				'https://forms.office.com/pages/responsepage.aspx?id=mN94WIhvq0iTIpmM5VcIjYt1ax_BPvtOqhVjfvzyJN5UOUlNRkhaQjNXTDQyNEhSRExNOFVGSkNJTS4u&route=shorturl'
			]
		])(
			'should return the correct feedback URL for appeal type "%s"',
			(appealTypeCode, expectedUrl) => {
				const result = config.getAppealTypeFeedbackUrl(appealTypeCode);
				expect(result).toBe(expectedUrl);
			}
		);
	});
});
