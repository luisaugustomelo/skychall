#FROM node:10

# Create app directory
#WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
#COPY package*.json ./

#RUN npm install yarn -g
#RUN npm install --no-optional

# Bundle app source
#COPY . .

#EXPOSE 8080 9229

#CMD npm run dev:server
