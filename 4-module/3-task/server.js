const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const Utils = require('../1-task/utils');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (Utils.isNestedPath(pathname)) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('Not Found');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        }
        res.statusCode = 200;
        res.end('OK');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
