# Nginx Ingress

This folder exists to provide environment-specific configuration for the
Nginx Ingress controller.

By default, these files are empty. Typically, this might be used to specify
an IP for the load balancer to use.

```yaml
controller:
  service:
    loadBalancerIP: 10.20.30.40
```
