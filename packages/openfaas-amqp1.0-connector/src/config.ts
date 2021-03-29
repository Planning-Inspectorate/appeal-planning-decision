/**
 * config
 */

/* Node modules */

/* Third-party modules */
import { ConnectionOptions, ReceiverOptions } from 'rhea/typings/connection';

/* Files */
import { IReceiverFlow } from './interfaces';

const queueName = process.env.AMQP_QUEUE_NAME ?? 'openfaas';

export default {
  logger: {
    level: process.env.LOGGER_LEVEL ?? 'info',
    redact: ['config.amqp.connection.password', 'config.openfaas.password'],
  },
  amqp: {
    connection: {
      host: process.env.AMQP_HOST,
      hostname: process.env.AMQP_HOSTNAME,
      reconnect_limit: Number(process.env.AMQP_RECONNECT_LIMIT ?? 1),
      password: process.env.AMQP_PASSWORD,
      port: Number(process.env.AMQP_PORT ?? 5672),
      reconnect: process.env.AMQP_ATTEMPT_RECONNECTION !== 'false',
      transport: process.env.AMQP_TRANSPORT,
      username: process.env.AMQP_USERNAME,
    } as ConnectionOptions,
    delivery: {
      maxAttempts: Number(process.env.AMQP_DELIVERY_MAX_ATTEMPTS ?? 3),
    },
    receiver: {
      autoaccept: process.env.AMQP_RECEIVER_AUTO_ACCEPT === 'true', // Default to "false"
      source: queueName,
    } as ReceiverOptions,
    receiverFlow: {
      auto: process.env.AMQP_RECEIVER_FLOW_MANUAL !== 'true',
      concurrentItems: Number(process.env.AMQP_RECEIVER_FLOW_CONCURRENCY ?? 500), // Use same defaults as Rhea
      postProcessPause: Number(process.env.AMQP_RECEIVER_FLOW_POST_PROCESS_PAUSE ?? 0),
    } as IReceiverFlow,
    response: {
      replyQueue: process.env.AMQP_RESPONSE_REPLY_QUEUE ?? `${queueName}_reply`,
      sendReply: process.env.AMQP_RESPONSE_SEND_REPLY !== 'false',
    },
  },
  health: {
    port: Number(process.env.HEALTH_PORT ?? 3000),
  },
  openfaas: {
    async: process.env.OPENFAAS_ASYNC === 'true',
    callbackUrl: process.env.OPENFAAS_CALLBACK_URL,
    function: process.env.OPENFAAS_FUNCTION ?? queueName, // Default to same as exchange
    gateway: process.env.OPENFAAS_GATEWAY,
    password: process.env.OPENFAAS_PASSWORD,
    username: process.env.OPENFAAS_USERNAME,
  },
};
