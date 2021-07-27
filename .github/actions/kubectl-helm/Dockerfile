FROM alpine:latest as builder
ARG KUBE_VERSION=1.18.2
ARG HELM_VERSION=3.2.0
ARG OS_TYPE=linux
ARG ARCH=amd64
WORKDIR /opt/app
RUN apk --no-cache add curl \
  && curl -LO https://storage.googleapis.com/kubernetes-release/release/v${KUBE_VERSION}/bin/${OS_TYPE}/${ARCH}/kubectl \
  && chmod +x ./kubectl \
  && curl -LO https://get.helm.sh/helm-v${HELM_VERSION}-${OS_TYPE}-${ARCH}.tar.gz \
  && tar -zxvf helm* \
  && mv ${OS_TYPE}-${ARCH}/* ./ \
  && ./kubectl version --client \
  && ./helm version --client

FROM alpine:latest
ENV KUBECONFIG=/opt/kubeconfig
COPY --from=builder /opt/app/kubectl /usr/local/bin
COPY --from=builder /opt/app/helm /usr/local/bin
COPY entrypoint.sh .
RUN apk add --no-cache bash curl gettext git jq openssh \
  && chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
