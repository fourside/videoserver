FROM golang:1.12-alpine as builder
WORKDIR src/github.com/fourside/videoserver
RUN apk add --no-cache --virtual .build-deps \
        dep \
        gcc \
        git \
        libc-dev \
        make \
        && go get -u golang.org/x/lint/golint
COPY . .
RUN make

FROM alpine:3.9
WORKDIR /work
COPY --from=builder /go/src/github.com/fourside/videoserver/videoserver .
RUN apk add \
        python \
        tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl \
    && chmod a+rx /usr/local/bin/youtube-dl \
    && mkdir public
CMD ["./videoserver"]

