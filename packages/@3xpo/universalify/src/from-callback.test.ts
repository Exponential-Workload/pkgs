// @ts-nocheck
'use strict';
import universalify from './index';

const fn = universalify.fromCallback(function (a, b, cb) {
  setTimeout(() => cb(null, [this, a, b]), 15);
});

const errFn = universalify.fromCallback(cb => {
  setTimeout(() => cb(new Error('test')), 15);
});

const falseyErrFn = universalify.fromCallback(cb => {
  setTimeout(() => cb(0, 15)); // eslint-disable-line standard/no-callback-literal
});

test('callback function works with callbacks', done => {
  expect.assertions(4);
  fn.call({ a: 'a' }, 1, 2, (err, arr) => {
    expect(err).toBeFalsy();
    expect(arr[0].a).toBe('a');
    expect(arr[1]).toBe(1);
    expect(arr[2]).toBe(2);
    done();
  });
});

test('callback function works with promises', done => {
  expect.assertions(3);
  fn.call({ a: 'a' }, 1, 2)
    .then(arr => {
      expect(arr[0].a).toBe('a');
      expect(arr[1]).toBe(1);
      expect(arr[2]).toBe(2);
      done();
    })
    .catch(done);
});

test('callbacks function works with promises without modify the original arg array', done => {
  expect.assertions(2);
  const array = [1, 2];
  fn.apply(this, array).then(arr => {
    expect(array.length).toBe(2);
    expect(arr.length).toBe(3);
    done();
  });
});

test('callback function error works with callbacks', done => {
  expect.assertions(2);
  errFn(err => {
    expect(err).toBeTruthy();
    expect(err.message).toBe('test');
    done();
  });
});

test('callback function error works with promises', done => {
  expect.assertions(2);
  errFn()
    .then(() => done('Promise should not resolve'))
    .catch(err => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('test');
      done();
    });
});

test('should correctly reject on falsey error values', done => {
  expect.assertions(2);
  falseyErrFn()
    .then(() => done('Promise should not resolve'))
    .catch(err => {
      expect(err != null).toBeTruthy();
      expect(err).toBe(0);
      done();
    });
});

test('fromCallback() sets correct .name', () => {
  expect.assertions(1);
  const res = universalify.fromCallback(function hello() {});
  expect(res.name).toBe('hello');
});
