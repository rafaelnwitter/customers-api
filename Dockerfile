FROM node:16.17.0-alpine

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json /app/

# Then install the NPM module
RUN npm install -g npm@8.19.1
RUN npm install

# Copy current directory to APP folder
COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
