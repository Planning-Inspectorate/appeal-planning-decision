import type { Handler } from 'express';

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

export type Middleware = [Handler[], { [key: HttpMethods]: Handler[] }];

export interface RouterModule {
	[method: HttpMethods]: Handler;
	middleware?: Middleware;
}
