FROM node:10.15-alpine as builder
WORKDIR work
COPY . .
RUN npm install -g yarn \
    && yarn install \
    && yarn run build

FROM nginx:1.15.8-alpine
RUN apk add --no-cache --virtual .build-deps \
        tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && mkdir /public \
    && apk del .build-deps
COPY nginx/nginx.conf /etc/nginx/
COPY --from=builder /work/dist/* /public/

