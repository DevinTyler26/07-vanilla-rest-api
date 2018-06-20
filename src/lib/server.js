'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/time') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({
          date: new Date(),
        }));
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsayPage') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const cowsayText = cowsay.say({
          text: parsedRequest.url.query.text,
        });
        res.write(`<section><h3><a href="api/time">Click here for current time</a></h3><pre>${cowsayText}</pre></section>`);
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/api/echo') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(parsedRequest.body));
        res.end();
        return undefined;
      }

      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      console.log(err);
      res.write('BAD REQUEST');
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);
