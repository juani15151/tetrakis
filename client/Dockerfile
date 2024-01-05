FROM node AS builder

ENV NODE_ENV=production
# Node 17 moved to OpenSSL v3.
ENV NODE_OPTIONS="--openssl-legacy-provider"

ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL
ARG REACT_APP_SERVER_API_URL
ENV REACT_APP_SERVER_API_URL $REACT_APP_SERVER_API_URL

WORKDIR /usr/app
COPY ./public ./public
COPY ./src ./src
COPY package.json ./package.json

RUN npm install
RUN npm run build


FROM nginx

COPY --from=builder /usr/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# CMD is inherited from nginx image.