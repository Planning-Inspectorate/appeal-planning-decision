// No types in package - https://github.com/alphagov/notifications-node-client/issues/175
declare module 'notifications-node-client' {
	interface Response {
		id: string;
		reference: string | null;
		content: {
			subject: string;
			body: string;
			from_email: string;
		};
		uri: string;
		template: {
			id: string;
			version: number;
			uri: string;
		};
	}
	interface Options {
		personalisation:
			| {
					[key: string]: string;
			  }
			| undefined;
		reference: string;
		emailReplyToId?: string;
	}
	class NotifyClient {
		constructor(...args: [string, string?, string?]);
		sendEmail(templateId: string, emailAddress: string, options: Options): Promise<Response>;
	}
}
