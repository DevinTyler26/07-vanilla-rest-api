'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

const apiUrl = 'http://localhost:5000/api';

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('Valid request to the API', () => {
  describe('GET /api/time', () => {
    test('should respond with a status of 200', (done) => {
      superagent.get(`${apiUrl}/time`)
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.body).toHaveProperty('date');
          done();
        });
    });
  });
});

describe('GET /cowsayPage', () => {
  const mockCow = cowsay.say({ text: 'Hey Devin' });
  const mockHTML = `<section><h3><a href="api/time">Click here for current time</a></h3><pre>${mockCow}</pre></section>`;
  test('should respond with status 200 and return cow HTML', () => {
    return superagent.get(`${apiUrl}/cowsayPage`)
      .query({ text: 'Hey Devin' })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.text).toEqual(mockHTML);
      });
  });
});

describe('POST /echo', () => {
  test('should return status 200 for successful post', () => {
    return superagent.post(`${apiUrl}/echo`)
      .send({ name: 'devin' })
      .then((res) => {
        expect(res.body.name).toEqual('devin');
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

describe('INVALID req to API', () => {
  describe('GET /cowsPage', () => {
    test('should err with 400 status', () => {
      return superagent.get(`${apiUrl}/cowsayPage`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});
