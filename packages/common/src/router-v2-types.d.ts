const { Handler } = require('express');

export type HttpMethods =
	| 'connect'
	| 'delete'
	| 'get'
	| 'head'
	| 'options'
	| 'patch'
	| 'post'
	| 'put'
	| 'trace';

export interface RouterModule {
	[method: HttpMethods]: Handler;
}
