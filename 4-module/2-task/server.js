const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');
const Utils = require('../1-task/utils');

const server = new http.Server();
const KILO = 1024;
const UPLOAD_FILE_MAX_SIZE_MB = 1;
const bytesLimit = UPLOAD_FILE_MAX_SIZE_MB * KILO ** 2;

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (Utils.isNestedPath(pathname)) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const limitStream = new LimitSizeStream({limit: bytesLimit});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitStream).pipe(writeStream);

      writeStream
          .on('error', (err) => {
            if (err.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('already exists');
            } else {
              res.statusCode = 500;
              res.end('internal error');
            }
          })
          .on('close', () => {
            res.statusCode = 201;
            res.end('ok');
          });

      limitStream
          .on('error', (err) => {
            if (err instanceof LimitExceededError) {
              res.statusCode = 413;
              res.end('Payload Too Large');
              fs.unlink(filepath, () => {});
              limitStream.destroy();
            } else {
              res.statusCode = 500;
              res.end('internal error');
            }
          });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('close', () => {
    if (!res.finished) {
      fs.unlink(filepath, () => {});
    }
  });
});

module.exports = server;
