FROM node:18-alpine

LABEL details.version="1.0.0" \
      multi.name="Plyr" \
      multi.description="Plyr nodejs image " \ 
      multi.maintainer="goxless16@gmail.com"

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

COPY .env ./

RUN npm install

RUN npx prisma generate

COPY . .


EXPOSE 8000

CMD ["npm", "run", "dev"]


