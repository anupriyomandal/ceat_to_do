# Railway backend only - frontend deployed to Vercel
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
EXPOSE 3000
CMD ["node", "server/index.js"]
