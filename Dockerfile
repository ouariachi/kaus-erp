FROM node:23.8.0

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npx prisma db push --accept-data-loss

COPY . .

EXPOSE 3030
EXPOSE 5432

CMD ["npm", "run", "dev"]