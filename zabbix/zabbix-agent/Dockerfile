FROM ubuntu:16.04
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

ARG APT_FLAGS_COMMON="-qq -y"
ARG APT_FLAGS_PERSISTANT="${APT_FLAGS_COMMON} --no-install-recommends"
ARG APT_FLAGS_DEV="${APT_FLAGS_COMMON} --no-install-recommends"
 
RUN addgroup --system --quiet zabbix && \
    adduser --quiet \
            --system --disabled-login \
            --ingroup zabbix \
            --home /var/lib/zabbix/ \
        zabbix && \
    mkdir -p /etc/zabbix && \
    mkdir -p /etc/zabbix/zabbix_agentd.d && \
    mkdir -p /var/lib/zabbix && \
    mkdir -p /var/lib/zabbix/enc && \
    mkdir -p /var/lib/zabbix/modules && \
    chown --quiet -R zabbix:root /var/lib/zabbix && \
    apt-get ${APT_FLAGS_COMMON} update && \
    apt-get ${APT_FLAGS_PERSISTANT} install \
        supervisor \
        libpcre3 \
        libssl1.0.0 1>/dev/null && \
    apt-get ${APT_FLAGS_COMMON} autoremove && \
    apt-get ${APT_FLAGS_COMMON} clean && \
    rm -rf /var/lib/apt/lists/*

ARG MAJOR_VERSION=3.4
ARG ZBX_VERSION=${MAJOR_VERSION}.1
ARG ZBX_SOURCES=svn://svn.zabbix.com/tags/${ZBX_VERSION}/
ENV ZBX_VERSION=${ZBX_VERSION} ZBX_SOURCES=${ZBX_SOURCES}

RUN apt-get ${APT_FLAGS_COMMON} update && \
    apt-get ${APT_FLAGS_DEV} install \
            gcc \
            make \
            automake \
            libc6-dev \
            pkg-config \
            libssl-dev \
            libpcre3-dev \
            sudo \
            subversion 1>/dev/null && \
    cd /tmp/ && \
    svn --quiet export ${ZBX_SOURCES} zabbix-${ZBX_VERSION} && \
    cd /tmp/zabbix-${ZBX_VERSION} && \
    zabbix_revision=`svn info ${ZBX_SOURCES} |grep "Last Changed Rev"|awk '{print $4;}'` && \
    sed -i "s/{ZABBIX_REVISION}/$zabbix_revision/g" include/version.h && \
    ./bootstrap.sh 1>/dev/null && \
    export CFLAGS="-fPIC -pie -Wl,-z,relro -Wl,-z,now" && \
    ./configure \
            --prefix=/usr \
            --silent \
            --sysconfdir=/etc/zabbix \
            --libdir=/usr/lib/zabbix \
            --datadir=/usr/lib \
            --enable-agent \
            --enable-ipv6 \
            --with-openssl && \
    make -j"$(nproc)" -s 1>/dev/null && \
    cp src/zabbix_agent/zabbix_agentd /usr/sbin/zabbix_agentd && \
    cp conf/zabbix_agentd.conf /etc/zabbix/ && \
    chown --quiet -R zabbix:root /etc/zabbix && \
    cd /tmp/ && \
    rm -rf /tmp/zabbix-${ZBX_VERSION}/ && \
    apt-get ${APT_FLAGS_COMMON} purge \
            gcc \
            make \
            automake \
            libc6-dev \
            pkg-config \
            libssl-dev \
            libpcre3-dev \
            subversion 1>/dev/null && \
    apt-get ${APT_FLAGS_COMMON} autoremove && \
    apt-get ${APT_FLAGS_COMMON} clean && \
    rm -rf /var/lib/apt/lists/*

RUN rm -rf /etc/sudoers && \
    touch /etc/sudoers && \
    echo "Defaults        env_reset" >> /etc/sudoers && \
    echo "Defaults        mail_badpass" >> /etc/sudoers && \
    echo "Defaults        secure_path=\"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin\"" >> /etc/sudoers && \
    echo "root    ALL=(ALL:ALL)	ALL" >> /etc/sudoers && \
    echo "zabbix  ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers && \
    echo "%admin ALL=(ALL) ALL" >> /etc/sudoers && \
    echo "%sudo   ALL=(ALL:ALL) ALL" >> /etc/sudoers && \
    chmod 400 /etc/sudoers && \
    apt-get ${APT_FLAGS_COMMON} update && \
    apt-get ${APT_FLAGS_COMMON} install curl jq bc git wget tcpdump net-tools tzdata 
RUN echo "Asia/Shanghai" > /etc/timezone && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime 
RUN echo 0 > /now && \
    echo -2 > /height && \
    echo 0 > /status && \
    echo "UserParameter=chain.height,sudo /bin/bash /getHeight.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    echo "UserParameter=chain.TaskStatus,sudo /bin/bash /getStatus.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    echo "UserParameter=chain.block,sudo /bin/bash /getBlock.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    echo "UserParameter=chain.net,sudo /bin/bash /getNet.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    echo "UserParameter=chain.logs,sudo /bin/bash /getLogs.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    echo "UserParameter=chain.disk,sudo /bin/bash /getDisk.sh" >> /etc/zabbix/zabbix_agentd.d/zabbix_fabric.conf && \
    mkdir /chain && \
    echo '#!/bin/bash' > /chain/create.sh && \
    echo 'echo 000' >> /chain/create.sh && \
    echo '#!/bin/bash' > /chain/init.sh && \
    echo 'echo 000' >> /chain/init.sh && \
    echo '#!/bin/bash' > /chain/sendTransaction.sh && \
    echo 'echo 000' >> /chain/sendTransaction.sh && \
    echo '#!/bin/bash' > /chain/changeStatus.sh && \
    echo 'echo $1 > /status' >> /chain/changeStatus.sh && \
    echo 'echo $1' >> /chain/changeStatus.sh 

RUN curl -sSL https://get.daocloud.io/docker | sh

EXPOSE 10050/TCP

WORKDIR /var/lib/zabbix

VOLUME ["/etc/zabbix/zabbix_agentd.d", "/var/lib/zabbix/enc", "/var/lib/zabbix/modules"]

ADD conf/etc/supervisor/ /etc/supervisor/
ADD run_zabbix_component.sh /
ADD getHeight.sh /
ADD getStatus.sh /
ADD getBlock.sh /
ADD getNet.sh /
ADD getLogs.sh /
ADD getDisk.sh /

ENTRYPOINT ["/bin/bash"]

CMD ["/run_zabbix_component.sh", "agentd", "none"]
