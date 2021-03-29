/**
 * openfaas
 */

/* Node modules */

/* Third-party modules */
import { Logger } from 'pino';
import axios, { AxiosInstance } from 'axios';

/* Files */
import { IOpenFaaS, IOpenFaaSConfig } from './interfaces';

export default class OpenFaaS implements IOpenFaaS {
  private http: AxiosInstance;

  constructor(private config: IOpenFaaSConfig, private logger: Logger) {
    const auth = this.config.username
      ? {
          username: this.config.username,
          password: this.config.password,
        }
      : undefined;

    const fnEndpoint = this.config.async ? 'async-function' : 'function';

    const headers: { [key: string]: any } = {};

    if (this.config.async && this.config.callbackUrl) {
      headers['X-Callback-Url'] = this.config.callbackUrl;
    }

    if (!this.config.gateway) {
      throw new Error('OpenFaaS gateway URL not configured');
    }

    if (!this.config.function) {
      throw new Error('OpenFaaS function not configured');
    }

    this.http = axios.create({
      auth,
      headers,
      baseURL: `${this.config.gateway}/${fnEndpoint}/`,
    });
  }

  async invoke(message: any): Promise<{ contentType: string; data: any }> {
    const fnName = this.config.function;
    this.logger.info({ function: fnName }, 'Calling OpenFaaS function');

    try {
      const { data, status: statusCode, headers } = await this.http.post(fnName, message);

      this.logger.info(
        {
          statusCode,
          headers,
        },
        'OpenFaaS function successfully called',
      );

      return {
        data,
        contentType: headers['content-type'],
      };
    } catch (err) {
      this.logger.error(
        {
          message: err.message,
          headers: err.response.headers,
          resp: err.response.status,
          body: err.response.data,
        },
        'OpenFaaS function errored',
      );

      /* Preserve the error */
      throw err;
    }
  }
}
