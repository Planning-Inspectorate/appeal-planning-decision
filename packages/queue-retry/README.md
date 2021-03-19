# Queue Retry

This is for use when an alert is received that a message has been sent to a queue's dead letter queue

> This is only configured to work with Azure Service Bus. As such, this will not work locally with RabbitMQ

## Authentication

Authentication is handled via Kubernetes and Azure Active Directory. Only users with valid Active Directory credentials
will be able to access the service.

Although deployed to every cluster, it is not designed to be accessed by non-developers.

## Accessing

> **NB.** This worked example is on `prod`. You will need to adjust your namespace from `app-prod` to `app-dev` or
> `app-preprod` depending on which instance you are accessing.
> 
> Also, the pod names are randomly generated with each deployment.

You will need to access this via [port forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).
In order to do this, you will need to set up your local machine to [access the Kubernetes infrastructure](https://github.com/Planning-Inspectorate/appeal-planning-decision#connecting-to-kubernetes)

```shell
# Get a list of pods
kubectl get pods -n app-prod
```

This will output a list like:

```shell
NAME                                             READY   STATUS    RESTARTS   AGE
amqp-connector-56d4959458-swlx2                  1/1     Running   1          3d3h
app-appeal-reply-service-api-6cb67b449b-cszjr    1/1     Running   0          3d3h
app-appeals-service-api-57b58f946d-b2khr         1/1     Running   0          3d3h
app-document-service-api-99d4b7f98-jjzbj         1/1     Running   0          16m
app-form-web-app-7798d78b96-dx7wd                1/1     Running   0          16m
app-gotenberg-7ffd694d9c-64ngn                   1/1     Running   0          3d3h
app-lpa-questionnaire-web-app-797c49484d-vb75m   1/1     Running   0          16m
app-pdf-service-api-649d6fdd77-c44fm             1/1     Running   0          3d3h
app-queue-retry-6647cd57b5-vqnnt                 1/1     Running   0          12m
```

Simply run:

```shell
kubectl port-forward -n app-prod app-queue-retry-6647cd57b5-vqnnt 3000:3000
```

You can now access the service via [localhost:3000](http://localhost:3000)
