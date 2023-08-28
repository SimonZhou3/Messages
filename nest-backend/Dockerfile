FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./


#RUN yarn install
RUN npm install

RUN npm rebuild argon2
#Build application
COPY . .

# Creates a "dist" folder with the production build
#RUN yarn build
RUN npm run build