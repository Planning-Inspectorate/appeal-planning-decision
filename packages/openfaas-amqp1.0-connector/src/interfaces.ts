/**
 * interfaces
 */

/* Node modules */

/* Third-party modules */
import { ConnectionOptions, ReceiverOptions } from 'rhea/typings/connection';

/* Files */

export interface IAMQPHealth {
  receiver: boolean;
  sender: boolean;
}

export interface IAMQP {
  connectionStatus(): IAMQPHealth;
}

export interface IAMQPConfig {
  connection: ConnectionOptions;
  delivery: {
    maxAttempts: number;
  };
  receiver: ReceiverOptions;
  receiverFlow: IReceiverFlow;
  response: {
    replyQueue: string;
    sendReply: boolean;
  };
}

export interface IHealthConfig {
  port: number;
}

export interface IOpenFaaSInvokeResult {
  contentType: string;
  data: any;
}

export interface IOpenFaaS {
  invoke(message: any): Promise<IOpenFaaSInvokeResult>;
}

export interface IOpenFaaSConfig {
  async: boolean;
  callbackUrl?: string;
  function: string;
  gateway: string;
  password?: string;
  username?: string;
}

export interface IReceiverFlow {
  auto: boolean;
  concurrentItems: number;
  postProcessPause: number;
}
