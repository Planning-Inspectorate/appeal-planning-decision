#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

kubectl create namespace "${DEPLOY_NAMESPACE}" || true

add_registry_secret() {
  echo "Adding registry secret to ${DEPLOY_NAMESPACE}"

  kubectl create secret docker-registry \
    -n "${DEPLOY_NAMESPACE}" \
    azure-docker-registry \
    --docker-server="${DOCKER_SERVER}" \
    --docker-username="${DOCKER_USERNAME}" \
    --docker-password="${DOCKER_PASSWORD}" \
    --docker-email="${EMAIL_ADDRESS}" \
    -o yaml --dry-run=client | \
    kubectl replace -n "${DEPLOY_NAMESPACE}" --force -f -
}

install_nginx_ingress() {
  echo "Adding Nginx Ingress"

  touch "${DIR}/nginx-ingress/${CLUSTER}.yaml"

  kubectl create namespace nginx-ingress || true
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm repo update
#    --set "controller.service.annotations.service\.beta\.kubernetes\.io\/azure-load-balancer-resource-group=$(get_tf_output "kube_load_balancer_rg")" \
#    --set "controller.service.loadBalancerIP=$(get_tf_output "kube_load_balancer_ip")" \
  helm upgrade \
    --reset-values \
    --install \
    --wait \
    --atomic \
    --cleanup-on-fail \
    --namespace nginx-ingress \
    --values "${DIR}/nginx-ingress/common.yaml" \
    --values "${DIR}/nginx-ingress/${CLUSTER}.yaml" \
    nginx-ingress \
    ingress-nginx/ingress-nginx
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
    --set git.path="releases/${CLUSTER}" \
    --set git.branch="${DEFAULT_BRANCH}" \
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

add_registry_secret
install_nginx_ingress
install_cert_manager
install_gitops
