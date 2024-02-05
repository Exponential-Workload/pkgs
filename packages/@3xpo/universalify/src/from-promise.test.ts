// @ts-nocheck
'use strict';
import universalify from './index';

const fn = universalify.fromPromise(function (a, b) {
  return new Promise(resolve => {
    setTimeout(() => resolve([this, a, b]), 15);
  });
});

const errFn = universalify.fromPromise(
  () =>
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('test')), 15),
    ),
);

test('promise function works with callbacks', done => {
  expect.assertions(4);
  fn.call({ a: 'a' }, 1, 2, (err, arr) => {
    expect(err).toBeFalsy();
    expect(arr[0].a).toBe('a');
    expect(arr[1]).toBe(1);
    expect(arr[2]).toBe(2);
    done();
  });
});

test('promise function works with promises', done => {
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

test('promise function optional param works with callbacks', done => {
  expect.assertions(4);
  fn.call({ a: 'a' }, 1, (err, arr) => {
    expect(err).toBeFalsy();
    expect(arr[0].a).toBe('a');
    expect(arr[1]).toBe(1);
    expect(arr[2]).toBe(undefined);
    done();
  });
});

test('promise function optional param works with promises', async () => {
  const arr = await fn.call({ a: 'a' }, 1);
  expect(arr[0].a).toBe('a');
  expect(arr[1]).toBe(1);
  expect(arr[2]).toBe(undefined);
});

test('promise function error works with callbacks', done => {
  expect.assertions(2);
  errFn(err => {
    expect(err).toBeTruthy();
    expect(err.message).toBe('test');
    done();
  });
});

test('promise function error works with promises', done => {
  expect.assertions(2);
  errFn()
    .then(() => done('Promise should not resolve'))
    .catch(err => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('test');
      done();
    });
});

test('fromPromise() sets correct .name', () => {
  expect.assertions(1);
  const res = universalify.fromPromise(function hello() {});
  expect(res.name).toBe('hello');
});
