#!/bin/bash

set -e

FLUX_NAMESPACE="flux"
OPENFAAS_NAMESPACES="openfaas openfaas-fn"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if ! ( kubectl get ns ${DEPLOY_NAMESPACE} ) 2> /dev/null;
then
  kubectl create namespace "${DEPLOY_NAMESPACE}" || true
fi

add_registry_secret() {
  echo "Adding registry secret to ${DEPLOY_NAMESPACE}"

  for namespace in ${DEPLOY_NAMESPACE} ${OPENFAAS_NAMESPACES}
  do
    kubectl create secret docker-registry \
      -n "${namespace}" \
      azure-docker-registry \
      --docker-server="${DOCKER_SERVER}" \
      --docker-username="${DOCKER_USERNAME}" \
      --docker-password="${DOCKER_PASSWORD}" \
      --docker-email="${EMAIL_ADDRESS}" \
      -o yaml --dry-run=client | \
      kubectl replace -n "${namespace}" --force -f -
  done
}

configure_monitoring() {
  echo "Configuring Monitoring"

  kubectl apply -f "${DIR}/../k8s/monitoring/configMap.yaml"
}

configure_rbac() {
  echo "Configuring RBAC"

  mkdir -p "${DIR}/../k8s/rbac/${CLUSTER}"

  for namespace in ${DEPLOY_NAMESPACE} ${OPENFAAS_NAMESPACES} flux
  do
    # Handle spaces in path names
    OIFS="$IFS"
    IFS=$'\n'

    COMMON_RBAC=$(find "${DIR}/../k8s/rbac/common" -name "*.yaml" -type f -exec ls {} \;)
    CLUSTER_RBAC=$(find "${DIR}/../k8s/rbac/${CLUSTER}" -name "*.yaml" -type f -exec ls {} \;)

    for file in ${COMMON_RBAC} ${CLUSTER_RBAC}
    do
      echo "Applying file: ${file}"
      echo "Namespace: ${namespace}"

      export RBAC_NAMESPACE="${namespace}"

      envsubst < "${file}" | kubectl apply -f -
    done

    IFS="$OIFS"
  done
}

create_namespaces() {
  echo "Create namespaces"

  kubectl apply -f "${DIR}/openfaas/namespaces.yml"
}

install_azure_key_vault() {
  AKV2K8S_VERSION="${AKV2K8S_VERSION:-^2.0.0}"
  echo "Install Azure Key Vault (akv2k8s)@${AKV2K8S_VERSION}"

  kubectl apply -f https://raw.githubusercontent.com/sparebankenvest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
 if  ! ( kubectl get ns akv2k8s ) 2> /dev/null
then
     kubectl create namespace akv2k8s || true
fi
  kubectl label namespaces \
    "${DEPLOY_NAMESPACE}" \
    --overwrite \
    azure-key-vault-env-injection=enabled

  helm repo add spv-charts https://charts.spvapi.no
  helm repo update

  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace akv2k8s \
    --version="${AKV2K8S_VERSION}" \
    akv2k8s \
    spv-charts/akv2k8s
}

install_nginx_ingress() {
  NGINX_INGRESS_VERSION="${NGINX_INGRESS_VERSION:-^3.0.0}"
  echo "Adding Nginx Ingress@${NGINX_INGRESS_VERSION}"

  touch "${DIR}/nginx-ingress/${CLUSTER}.yaml"
if  ! ( kubectl get ns nginx-ingress ) 2> /dev/null
then
  kubectl create namespace nginx-ingress || true
fi
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  kubectl apply -n nginx-ingress -f "${DIR}/nginx-ingress/configMaps/response-headers.yaml"
  helm repo update
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace nginx-ingress \
    --set controller.service.loadBalancerIP="${CLUSTER_LB_IP_ADDRESS}" \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-resource-group"="${CLUSTER_LB_IP_RG}" \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"="${CLUSTER_LB_IP_NAME}" \
    --values "${DIR}/nginx-ingress/common.yaml" \
    --values "${DIR}/nginx-ingress/${CLUSTER}.yaml" \
    --version="${NGINX_INGRESS_VERSION}" \
    nginx-ingress \
    ingress-nginx/ingress-nginx

  # ConfigMap changes aren't picked up via Helm
  kubectl rollout restart -n nginx-ingress deployment nginx-ingress-ingress-nginx-controller
}

install_cert_manager() {
  CERT_MANAGER_VERSION="${CERT_MANAGER_VERSION:-^1.0.0}"
  echo "Adding Cert Manager@${CERT_MANAGER_VERSION}"
  if  ! ( kubectl get ns cert-manager ) 2> /dev/null
    then
    kubectl create namespace cert-manager || true
  fi
  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace cert-manager \
    --set installCRDs=true \
    --set ingressShim.defaultIssuerName=letsencrypt-staging \
    --set ingressShim.defaultIssuerKind=ClusterIssuer \
    --version "${CERT_MANAGER_VERSION}" \
    cert-manager \
    jetstack/cert-manager
   kubectl get pods --namespace cert-manager
   kubectl apply -f "${DIR}/cert-manager/test-resource.yaml"
   kubectl describe certificate -n cert-manager-test
   kubectl delete -f "${DIR}/cert-manager/test-resource.yaml"
   sed -i -e "s/email:.*/email: ${EMAIL_ADDRESS}/" "${DIR}/cert-manager/letsencrypt-clusterissuer.yaml"
   kubectl apply -n cert-manager -f "${DIR}/cert-manager/letsencrypt-clusterissuer.yaml"
}

install_gitops() {
  GITOPS_FLUX_VERSION="${GITOPS_FLUX_VERSION:-^1.0.0}"
  GITOPS_HELM_VERSION="${GITOPS_HELM_VERSION:-^1.0.0}"
  echo "Adding GitOps Flux@${GITOPS_FLUX_VERSION}"

  helm repo add fluxcd https://charts.fluxcd.io
  kubectl apply -f https://raw.githubusercontent.com/fluxcd/helm-operator/master/deploy/crds.yaml
  if  ! ( kubectl get ns ${FLUX_NAMESPACE} ) 2> /dev/null
     then
     kubectl create namespace "${FLUX_NAMESPACE}" || true
  fi
  ssh-keyscan "${REPO_DOMAIN}" > ./known_hosts
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --set git.url="git@${REPO_DOMAIN}:${REPO_URL}.git" \
    --set git.path="releases/${CLUSTER}" \
    --set git.branch="${RELEASE_BRANCH}" \
    --set git.label="${CLUSTER}-flux-sync" \
    --set git.timeout="1m" \
    --set git.ciSkip="true" \
    --namespace "${FLUX_NAMESPACE}" \
    --version "${GITOPS_FLUX_VERSION}" \
    flux \
    fluxcd/flux

  echo "Adding GitOps Helm@${GITOPS_HELM_VERSION}"

  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --set-file ssh.known_hosts=./known_hosts \
    --set git.ssh.secretName=flux-git-deploy \
    --set git.timeout="1m" \
    --set helm.versions=v3 \
    --set syncGarbageCollection.enabled=true \
    --values="${DIR}/helm-dependencies.yaml" \
    --namespace "${FLUX_NAMESPACE}" \
    --version "${GITOPS_HELM_VERSION}" \
    helm-operator \
    fluxcd/helm-operator

  # Add Flux public key as GitHub deploy key
  PUBLIC_KEY=$(kubectl -n "${FLUX_NAMESPACE}" logs deployment/flux | grep identity.pub | cut -d '"' -f2)
  KEY_NAME="${CLUSTER}_cluster_k8s_gitops"

  # Get list of existing keys
  echo "Getting existing deployment keys"
  EXISTING_KEYS=$(curl -LsSf \
    -H "Authorization: token ${REPO_TOKEN}" \
    "${REPO_API_URL}/repos/${REPO_URL}/keys" | \
    jq -r --arg KEY_NAME "$KEY_NAME" '.[] | select(.title==$KEY_NAME) | .id')

  # Delete existing key
  echo "Deleting duplicate deployment keys for ${KEY_NAME}"
  for key in ${EXISTING_KEYS}
    do
      curl -LSf \
        -H "Authorization: token ${REPO_TOKEN}" \
        --request DELETE \
        "${REPO_API_URL}/repos/${REPO_URL}/keys/${key}"
    done

  # Add new key
  echo "Adding new ${KEY_NAME} deploy key to GitHub"
  curl -LsSf \
    --request POST \
    -H "Content-Type: application/json" \
    -H "Authorization: token ${REPO_TOKEN}" \
    --data "{ \"title\": \"${KEY_NAME}\", \"key\": \"${PUBLIC_KEY}\", \"read_only\": false }" \
    "${REPO_API_URL}/repos/${REPO_URL}/keys"
}

install_prometheus() {
  echo "Installing Prometheus for monitoring"
  if  ! ( kubectl get ns prometheus ) 2> /dev/null
     then
     kubectl create namespace prometheus || true
  fi
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo add stable https://charts.helm.sh/stable
  helm repo update

  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace prometheus \
    prometheus \
    prometheus-community/prometheus
}

create_namespaces
add_registry_secret
install_azure_key_vault
install_nginx_ingress
# install_cert_manager
# install_gitops
# configure_rbac
# configure_monitoring
