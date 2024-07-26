# docker build -t with_ignore -f Dockerfile . 
# docker run --rm with_ignore git
FROM node:20 as base

# COPY package*.json ./

COPY . .

RUN npm install npm@10.8.1
RUN npm install -g http-server
RUN npm install -g serve
# CMD ["npm run build"]
EXPOSE 8080
