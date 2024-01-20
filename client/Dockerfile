FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

### Prod pipeline commands ###

RUN npm run build

CMD ["npm", "start"]