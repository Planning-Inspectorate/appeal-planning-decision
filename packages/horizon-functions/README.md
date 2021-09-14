# Horizon Householder Appeal Publisher

Publishes a Householder Appeal to Horizon. This uses
[OpenFaaS](https://docs.openfaas.com) as a serverless function. This is 
invoked via sending a message to an Azure Service Bus queue.

## Configuration

| Variable | Description | Default |
| --- | --- | --- |
| `HORIZON_URL` | The URL for the Horizon RESTful API wrapper | `undefined` |
