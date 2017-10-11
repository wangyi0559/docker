FROM ubuntu:16.04
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

ARG APT_FLAGS_COMMON="-qq -y"

RUN apt-get ${APT_FLAGS_COMMON} update && \
    apt-get ${APT_FLAGS_COMMON} install \
        curl \
		jq \

WORKDIR /

RUN curl -sSL https://get.daocloud.io/docker | sh

CMD ["/bin/bash"]
