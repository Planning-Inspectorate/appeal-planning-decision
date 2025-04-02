// Hosts
process.env.APP_APPEALS_BASE_URL = 'http://localhost:9003';
process.env.OIDC_HOST = 'http://localhost';

// Logging
process.env.LOGGER_LEVEL = 'warn';

// Server
process.env.FEATURE_FLAGS_SETTING = 'ALL_ON';
process.env.NODE_ENV = 'test';
process.env.ALLOW_TESTING_OVERRIDES = 'true';
process.env.COOKIE_KEYS = '["secret-value"]';
process.env.JWKS =
	'[{"kty":"RSA","n":"rlIVVOCURwZtIxt05AbAX2GGG62nrlAVwler50J8ebckXl-HOKWV1948ZuK1-QcJWM0KHQM4M21PD-WqIYtHdz4Ynzy8xY9pJw9w-SA5Zebo149rIJvSSZF-5CiZnaBRIT9QXdbmE8hZoH_0LKvnkcy-RbjqZCr6FBtxCNSXj5X1vcqYyix1VgdpncaYk-nIg-mMaJ3nxfWx_oBbXb0o0H-LBdP2JowbsTzr9efGzpGZuf67Z0ZRttvJ9wjUapZ0WV_DTsg7YRZ2eqP2huABUawSaxQncR_laoD2joEntP06qK314J9Lf_9Ix9_KJhJ1X_QbMXEciQQkbEkahp7Vlw","e":"AQAB","d":"UuujzwSnM-PoLU-FumRFxPlIiEkCHuZke1Yl5PNY77MA_01UrssBbLZ_p_dG1YcV2KJsIaHi7X-dILRASgWNQLkOkEydhSJzRAvR0weTlhgRgVxs-o10qd8ma5Suge79OKH78i9jsVxX2gOTnF5HYLDyf4r3IB_bZo4pJiiuUbObusD8SNOLUTQ_hznfJ_NykiSr338KTx_4ucTrvyI83MyUxtxinhQa-m-EfRWT_V-JeycDDRALocElfrRzjlhqfR0Xn_TzlT4yZVI2rjFSfD4HINaNaJsQIOfhmTnuHzbPEx_WK0JvJ9qn1tVOoKyW6TE57wlH8qyyz3l5POgq5Q","p":"4wdco8coGY5ynMCIuO6dYRtpDACR87AYV_O6nWI9ESuKCGE0Tfd52fbAnLj5l_Xc_0-xvy2xdRhyC45s0ZsdPaJN8qnU_0tPGgSV1gKQ3HWIO0E7KcqNAUlbEY-b_vaHRCK7ADD87PpwoGty8ftcX08stZ1K1WLSJT77Z8cYm2U","q":"xJDWivHyLjCGH7BlzPDJ_uIQXmh1P0zm9wSDiLY2jR9l5JDMh97eWWgutVB_qMOUjsPjSftzLejReUQjEJqZAdnlNNMDifsiFZ4SEZWZYsGSC2AdNF1oEprKOLseVdipRsHv8Yz1e2E98BM7WhpZ_FCkKKP-FML_yisJ774Yo0s","dp":"uVhJSWxOUI77Av4soM4trhmyqRnODiS1uxhAQjzxnhLtnem9yelAkbHhjhF1s5oF0mo9stabCf3rHYQpUvZP6QGYoYQFYGcbLSKRMSbnHRTXI4kdxACZHXPF5ZBYys55oCa6hG16D_5l9JHERcnwn98DoUHI1mzXI5FHrnHcpQ","dq":"Hh57YUr1avJwesaSsrZqnS2SiITFAnAMK-l7JiWVckZPXJh7Xo5dz6FRFuNAzGE7kCyf1SQ8X9p-znAMV2z46Pm0T0XOEwRyEpHn_t3HZQR4Floh33Y4jjE9rzeszEaomXj6BS8uJjueO_0WaRYEl87beIa4VgITI604lo2wRMU","qi":"pQjwIT7mY5oaukTpkYc46xm3bKpatEc77BqHONNpqPq3r-PqKxPKtEX8vuTr4a0UWoM0HkR2OBR5F-j3GpOxrfrHd-VhNQIvMYEWKjmJk0qKLHJQjlO3AqM6en8pYqbBQ4KxcdMBExCeWniB70ZPa8XZMmE_OLte9XTo6ousnwk"}]';

// Notify
process.env.SRV_NOTIFY_SERVICE_ID = 'dummy-service-id-for-notify';
process.env.SRV_NOTIFY_API_KEY = 'dummy-api-key-for-notify';
process.env.SRV_NOTIFY_APPELLANT_LOGIN_CONFIRM_REGISTRATION_TEMPLATE_ID =
	'f0781589-8df5-4717-ab87-1dc5c2d5a9de';
process.env.SRV_NOTIFY_SAVE_AND_RETURN_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID =
	'e509eee7-f0bd-4d63-9203-d598ddd5b31e';
process.env.SRV_NOTIFY_FRONT_OFFICE_GENERIC_TEMPLATE_ID = '5427c45f-4c2a-4730-8f5b-ebd8484aa6b6';

// Clients
process.env.FORMS_WEB_APP_CLIENT_ID = '4dbd45cb-f591-414f-a6d9-34f1103b63fd';
process.env.FORMS_WEB_APP_CLIENT_SECRET = 'forms-web-app-local-secret';
process.env.FORMS_WEB_APP_REDIRECT_URI = 'http://localhost:9003/oidc';

process.env.FUNCTIONS_CLIENT_ID = '2f20d0bb-2f07-4797-9a4d-34b11b8f9936';
process.env.FUNCTIONS_CLIENT_SECRET = 'functions-local-secret';
process.env.FUNCTIONS_REDIRECT_URI = 'http://localhost:9999/oidc';
