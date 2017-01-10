FROM node:6.9.4

MAINTAINER docker_user billwang1990@gmail.com

ENV WORK_DIR=/prj/techboost
ENV WATCHMAN_DIR=/prj/techboost/config/watchman

WORKDIR ${WORK_DIR}
ADD . .

# fuck the GFW, use cnpm
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# install npm and bower package
RUN cnpm install -g ember-cli@2.10.0 \
    bower@1.8.0 \
    phantomjs-prebuilt \
    && cnpm install --verbose \
    && bower install --allow-root --verbose

WORKDIR ${WORK_DIR}

# ember server on port 4200
# livereload server on port 49152
EXPOSE 4200 49152

# specify mount point
VOLUME ["${WORK_DIR}"]

# run ember server on container start
CMD ["ember", "server"]
