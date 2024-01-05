FROM node

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install

# Single Player modes
EXPOSE 3080
# WebSocket (MultiPlayer mode)
EXPOSE 3081

CMD "npm" "start"