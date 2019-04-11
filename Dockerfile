FROM node:alpine
ADD . /node
WORKDIR /node
RUN npm install
CMD ["node index.js"]
