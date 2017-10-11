FROM ubuntu:trusty
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

ARG APT_FLAGS_COMMON="-qq -y"

ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8 DEBIAN_FRONTEND=noninteractive TERM=xterm

RUN DISTRIB_CODENAME=$(/bin/bash -c 'source /etc/lsb-release && echo $DISTRIB_CODENAME') && \
    locale-gen $LC_ALL && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    echo "deb http://us.archive.ubuntu.com/ubuntu/ $DISTRIB_CODENAME multiverse" >> /etc/apt/sources.list && \
    apt-get ${APT_FLAGS_COMMON} update && \
    apt-get ${APT_FLAGS_COMMON} install \
        curl \
		jq \
        iptables \
        libapparmor1 \
        libltdl7 \
        libsystemd-journal0 

WORKDIR /

RUN curl -fL -o docker.deb "https://download.docker.com/linux/ubuntu/dists/trusty/pool/stable/amd64/docker-ce_17.09.0~ce-0~ubuntu_amd64.deb" && \
    dpkg -i docker.deb && \
    rm docker.deb

CMD ["/bin/bash"]
