# OpenFaaS AMQP1.0 Connector chart

## Installation

```shell
helm repo add simonemms https://helm.simonemms.com
helm repo update

helm upgrade \
  --atomic \
  --cleanup-on-fail \
  --reset-values \
  --install \
  --wait \
  --namespace openfaas \
  amqp-connector \
  simonemms/openfaas-amqp1-0-connector
```

You can watch the Connector logs to see it invoke your functions:

```
kubectl logs -n openfaas deploy/amqp-connector -f
```

## Configuration

Configure via `values.yaml`.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `amqp.connection.existingPasswordSecret` | Use existing secret with the AMQP credentials (must contain a value for `password` key) | `<nil>` |
| `amqp.connection.existingUsernameSecret` | Use existing secret with the AMQP credentials (must contain a value for `username` key) | `<nil>` |
| `amqp.connection.host` | Host of the AMQP server | `<nil>` |
| `amqp.connection.hostname` | Hostname of the AMQP server (Azure Service Bus requires this to be same as `amqp.connection.hostname`) | `<nil>` |
| `amqp.connection.reconnectLimit` | Number of times to attempt reconnection | `5` |
| `amqp.connection.password` | Password for the AMQP server | `<nil>` |
| `amqp.connection.port` | Port for the AMQP server | `5672` |
| `amqp.connection.reconnect` | Should connection be reattempted on disconnection | `true` |
| `amqp.connection.transport` | Transport method - can be `tls`, `ssl` or `tcp` | `<nil>` |
| `amqp.connection.username` | Username for the AMQP server | `<nil>` |
| `amqp.delivery.maxAttempts` | Number of times to requeue the message if delivery fails | `3` |
| `amqp.receiver.autoAccept` | Should messages be auto-accepted - this will prevent redelivery of messages on failure | `false` |
| `amqp.receiver.source` | The name of the queue to subscribe to | `openfaas` |
| `amqp.response.replyQueue` | The name of the queue to publish replies to | `openfaas_reply` |
| `amqp.response.sendReply` | Should replies be sent | `true` |
| `amqp.receiverFlow.manual` | Should the receiver flow be manually controlled | `false` |
| `amqp.receiverFlow.concurrentItems` | The maximum number of items that can be processed at once. Will be ignored if `amqp.receiverFlow.manual` if `false` | `500` |
| `amqp.receiverFlow.postProcessPause` | Pause after each item is processed. In milliseconds. | `0` |
| `openfaas.async` | The function is asynchronous - this will prevent replies being sent to a queue | `false` |
| `openfaas.callbackUrl` | The callback URL to send to an asynchronous function | `<nil>` |
| `openfaas.existingPasswordSecret` | Use existing secret with the OpenFaaS credentials (must contain a value for `password` key) | `<nil>` |
| `openfaas.existingUsernameSecret` | Use existing secret with the OpenFaaS credentials (must contain a value for `username` key) | `<nil>` |
| `openfaas.function` | The OpenFaaS function to target | `<nil>` |
| `openfaas.gateway` | The OpenFaaS gateway URL to target | `<nil>` |
| `openfaas.password` | Password for the OpenFaaS gateway | `<nil>` |
| `openfaas.username` | Username for the OpenFaaS gateway | `<nil>` |
| `health.port` | Port to run health checks on | `3000` |
| `logger.level` | Reporting level for logs | `trace` |
