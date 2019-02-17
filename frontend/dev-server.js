const proxy = require('http-proxy-middleware');
const Bundler = require('parcel-bundler');
const express = require('express');

const bundler = new Bundler('src/index.html');
const app = express();

app.use(
  ['/api', '/public'],
  proxy({
    //target: 'http://192.168.99.100' // docker toolbox
    target: 'http://localhost:8080'
  })
);

app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));
