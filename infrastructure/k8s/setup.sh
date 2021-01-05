#!/bin/bash

set -e

OPENFAAS_NAMESPACES="openfaas openfaas-fn"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

kubectl create namespace "${DEPLOY_NAMESPACE}" || true

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

configure_rbac() {
  echo "Configuring RBAC"

  roles="user"

  for role in $roles
  do
    echo "Applying role: ${role^}"

    envsubst < "${DIR}/../k8s/rbac/${role}.yaml" | kubectl apply -f -
  done
}

create_namespaces() {
  echo "Create namespaces"

  kubectl apply -f "${DIR}/openfaas/namespaces.yml"
}

install_azure_key_vault() {
  echo "Install Azure Key Vault (akv2k8s)"

  kubectl apply -f https://raw.githubusercontent.com/sparebankenvest/azure-key-vault-to-kubernetes/master/crds/AzureKeyVaultSecret.yaml
  kubectl create namespace akv2k8s || true

  kubectl label namespaces \
    "${DEPLOY_NAMESPACE}" \
    --overwrite \
    azure-key-vault-env-injection=enabled

  helm repo add spv-charts http://charts.spvapi.no
  helm repo update

  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace akv2k8s \
    akv2k8s \
    spv-charts/akv2k8s
}

install_nginx_ingress() {
  echo "Adding Nginx Ingress"

  touch "${DIR}/nginx-ingress/${CLUSTER}.yaml"

  kubectl create namespace nginx-ingress || true
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
    nginx-ingress \
    ingress-nginx/ingress-nginx

  # ConfigMap changes aren't picked up via Helm
  kubectl rollout restart -n nginx-ingress deployment nginx-ingress-ingress-nginx-controller
}

install_cert_manager() {
  echo "Adding Cert Manager v${CERT_MANAGER_VERSION}"

  kubectl create namespace cert-manager || true
  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace cert-manager \
    --version "${CERT_MANAGER_VERSION}" \
    --set installCRDs=true \
    --set ingressShim.defaultIssuerName=letsencrypt-staging \
    --set ingressShim.defaultIssuerKind=ClusterIssuer \
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
  echo "Adding GitOps"

  helm repo add fluxcd https://charts.fluxcd.io
  kubectl apply -f https://raw.githubusercontent.com/fluxcd/helm-operator/master/deploy/crds.yaml
  kubectl create namespace flux || true
  ssh-keyscan "${REPO_DOMAIN}" > ./known_hosts
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --set git.url="git@${REPO_DOMAIN}:${REPO_URL}.git" \
    --set git.path="clusters/${CLUSTER}" \
    --set git.branch="${RELEASE_BRANCH}" \
    --set git.label="${CLUSTER}-flux-sync" \
    --set git.ciSkip="true" \
    --namespace flux \
    flux \
    fluxcd/flux
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --set-file ssh.known_hosts=./known_hosts \
    --set git.ssh.secretName=flux-git-deploy \
    --set helm.versions=v3 \
    --set syncGarbageCollection.enabled=true \
    --values="${DIR}/helm-dependencies.yaml" \
    --namespace flux \
    helm-operator \
    fluxcd/helm-operator

  # Add Flux public key as GitHub deploy key
  PUBLIC_KEY=$(kubectl -n flux logs deployment/flux | grep identity.pub | cut -d '"' -f2)
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

  kubectl create namespace prometheus || true
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
configure_rbac
install_azure_key_vault
install_nginx_ingress
install_cert_manager
install_gitops
install_prometheus
