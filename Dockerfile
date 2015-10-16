FROM node:4.1.2
COPY . /ide-mission-control
WORKDIR /ide-mission-control
RUN npm install

EXPOSE 7890 7891 7892

CMD ["/bin/sh", "-c", "node ."]


