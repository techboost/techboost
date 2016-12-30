FROM node:7.3.0

MAINTAINER docker_user billwang1990@gmail.com

# Install Ember CLI and Bower
RUN npm install -g ember-cli@2.10.0
RUN npm install -g bower@1.8.0

RUN mkdir /app
WORKDIR /app
ADD . /app

RUN npm install --verbose
RUN bower install --allow-root --verbose

EXPOSE 4200 49152
CMD ember server