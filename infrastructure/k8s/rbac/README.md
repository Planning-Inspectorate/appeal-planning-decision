# RBAC

Defines RBAC roles for the Kubernetes cluster

- [Azure Docs](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac)
- [Kubernetes Docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac)

There should be one file per group defined. The `admin` group doesn't need
one as it's set as the Kubernetes admin user, which gives it full access to
the cluster. 
