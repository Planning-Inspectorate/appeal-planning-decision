# OpenFaaS AMQP 1.0 Connector

> Forked from [OpenFaas AMQP 1.0 Connector](https://gitlab.com/MrSimonEmms/openfaas-amqp1.0-connector/)

An OpenFaaS connector for working with AMQP 1.0

## AMQP Services Supported

This has been tested with the following services, but should work with any message queue that follows the 
[AMQP v1.0](https://www.amqp.org/resources/specifications) standard. 

 - [RabbitMQ](https://www.rabbitmq.com/) (with the [rabbitmq_amqp1_0](https://github.com/rabbitmq/rabbitmq-server/tree/master/deps/rabbitmq_amqp1_0) plugin enabled)
 - [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview)

## Kubernetes 

See the [Helm chart](/chart/openfaas-amqp1.0-connector) for details

## Configuration

Configuration is achieved via environment variables:

| Variable | Description | Default |
|---|---|---|
| AMQP_ATTEMPT_RECONNECTION | Attempt reconnection if AMQP server disconnects | `true` |
| AMQP_DELIVERY_MAX_ATTEMPTS | Number of times to attempt delivery of a message in the event of failure | 3 |
| AMQP_HOST | Host of the AMQP server | `undefined` |
| AMQP_HOSTNAME | Hostname of the AMQP server (Azure Service Bus requires this to be same as `AMQP_HOST`) | `undefined` |
| AMQP_PASSWORD | Password for the AMQP server | `undefined` |
| AMQP_PORT | Port for the AMQP server | `5672` |
| AMQP_QUEUE_NAME | The name of the queue to subscribe to | `undefined` |
| AMQP_RECEIVER_AUTO_ACCEPT | Should messages be auto-accepted - this will prevent redelivery of messages on failure | `false` |
| AMQP_RECONNECT_LIMIT | Number of times to attempt reconnection | `1` |
| AMQP_RESPONSE_REPLY_QUEUE | The name of the queue to publish replies to | `${AMQP_QUEUE_NAME}_reply` |
| AMQP_RESPONSE_SEND_REPLY | Should replies be sent | `true` |
| AMQP_RECEIVER_FLOW_MANUAL | Should the receiver flow be manually controlled | `false` |
| AMQP_RECEIVER_FLOW_CONCURRENCY | The maximum number of items that can be processed at once. Will be ignored if `AMQP_RECEIVER_FLOW_MANUAL` if `false` | `500` |
| AMQP_RECEIVER_FLOW_POST_PROCESS_PAUSE | Pause after each item is processed. In milliseconds. | `0` |
| AMQP_TRANSPORT | Transport method - can be `tls`, `ssl` or `tcp` | `undefined` |
| AMQP_USERNAME | Username for the AMQP server | `undefined` |
| HEALTH_PORT | Port to run health checks on | `3000` |
| LOGGER_LEVEL | Reporting level for logs | `info` |
| OPENFAAS_ASYNC | The function is asynchronous - this will prevent replies being sent to a queue | `false` |
| OPENFAAS_CALLBACK_URL | The callback URL to send to an asynchronous function | `undefined` |
| OPENFAAS_FUNCTION | The OpenFaaS function to target | `undefined` |
| OPENFAAS_GATEWAY | The OpenFaaS gateway URL to target | `undefined` |
| OPENFAAS_PASSWORD | Password for the OpenFaaS gateway | `undefined` |
| OPENFAAS_USERNAME | Username for the OpenFaaS gateway | `undefined` |

## Worked Examples

These examples use the Docker image for simplicity. If you have NodeJS installed, you can build the package yourself:

```shell
npm run build
node .
```

### RabbitMQ

```shell
docker run -it --rm \
  -e OPENFAAS_FUNCTION=fn-name \
  -e OPENFAAS_GATEWAY=https://openfaas.example.domain \
  -e OPENFAAS_USERNAME=admin \
  -e OPENFAAS_PASSWORD=password \
  -e AMQP_HOST=rabbitmq-service \
  -e AMQP_USERNAME=admin \
  -e AMQP_PASSWORD=admin \
  -e AMQP_PORT=5672 \
  -e AMQP_QUEUE_NAME=example \
  registry.gitlab.com/mrsimonemms/openfaas-amqp1.0-connector
```

### Azure Service Bus

Azure Service Bus requires the `AMQP_HOST` and `AMQP_HOSTNAME` to be set to the same value.

```shell
docker run -it --rm \
  -e OPENFAAS_FUNCTION=fn-name \
  -e OPENFAAS_GATEWAY=https://openfaas.example.domain \
  -e OPENFAAS_USERNAME=admin \
  -e OPENFAAS_PASSWORD=password \
  -e AMQP_HOST=hostname.servicebus.windows.net \
  -e AMQP_HOSTNAME=hostname.servicebus.windows.net \
  -e AMQP_USERNAME=RootManageSharedAccessKey \
  -e AMQP_PASSWORD=my-password \
  -e AMQP_PORT=5671 \
  -e AMQP_TRANSPORT=tls \
  -e AMQP_QUEUE_NAME=example \
  registry.gitlab.com/mrsimonemms/openfaas-amqp1.0-connector
```

## Logging

Application logging is done using [Pino](https://getpino.io) and publishes to the console. To make the logs more readable,
pipe through [Pino Pretty](https://github.com/pinojs/pino-pretty) - `node . | pino-pretty -tlc`
