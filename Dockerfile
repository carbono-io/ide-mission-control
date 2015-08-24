FROM node:0.10.39

RUN mkdir /src
WORKDIR /src
ADD . /src
RUN npm install
EXPOSE 8000 3000 3001
ENTRYPOINT node .