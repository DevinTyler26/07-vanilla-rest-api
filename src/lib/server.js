'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');
const faker = require('faker');

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

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const firstName = faker.fake('{{name.firstName}}');
        const cowsayText = cowsay.say({
          text: parsedRequest.url.query.text || firstName,
        });
        
        res.write(`<section><h3><a href="/api/time">Click here for current time</a></h3><pre>${cowsayText}</pre></section>`);
        res.end();
        return undefined;
      }
      
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const cowsayText = cowsay.say({
          text: parsedRequest.url.query.text,
        });
        res.write(JSON.stringify({
          text: cowsayText,
        }));
        res.end();
        return undefined;
      }
      
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        console.log(faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}'));
        res.write(`<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title></head>
          <body>
           <header>
           <nav><ul><li><a href="/cowsay?text=Devin">cowsay</a></li></ul></nav><header><main>
           <p>For this assignment you will be building a HTTP server.</p>
           <p>Server Module</p>
           <p>The server module is responsible for creating an http server defining all route behavior and exporting an interface for starting and stoping the server. It should export an object with start and stop methods. The start and stop methods should each return a promise that resolves on success and rejects on error.</p><main></body></html>`);
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
