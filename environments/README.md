# Environments

These describe the environments that exist in the Azure infrastructure

## Terraform Variable Files

> New environments will need to be added to the `jobs.provision.strategy.matrix` 
> in the `.github/workflows/infra-environments.yml` file.

These are Terraform variable files (`<environment>.tfvars`) that work with the
environment infrastructure in `/infrastructure/environments`. These are designed
to represent one environment per file - nominally, we're expecting to have 
`dev.tfvars`, `staging.tfvars` and `prod.tfvars` but there are no constraints on 
naming convention.

Variables in these files should be defined as key/value pairs, eg:
```hcl
location = "eastus"
```

> **NB** JSON is not (currently) supported for variables files - this can be
> added if required.
