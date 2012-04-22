/*!
 * Pin(g) - Is my site up? Node.js edition.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Support.
 */
var should = require('chai').should();

/**
 * Subject.
 */
var pin = require('../lib/pin');

/**
 * Return a fake driver object
 *
 * @param {Function} the desired get function
 * @retrns {Object}
 */
function fakeDriver(fn) {
  return { get: fn }
};

describe('pin', function() {
  describe('when monitoring', function() {
    it('is repeatable', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statuscode: 200});
      });

      var i = 0;

      pin('http://google.com/', driver)
       .interval(5)
       .up(function(res) {
          if (++i == 2) done();
        });
    });

    it('notifies when site is down', function() {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statuscode: 404});
      });

      pin('http://google.com/', driver)
       .interval(5)
       .down(function(err, res) {
          done();
        });
    });

    it('notifies when site is up', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statuscode: 200});
      });

      pin('http://google.com/', driver)
       .interval(10)
       .up(function(err, res) {
          done();
        });
    });

    it('notifies when an error occurs', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(new Error('Test error'), {});
      });

      pin('http://google.com/', driver)
       .interval(5)
       .down(function(err, res) {
         err.should.be.ok;
         done();
        });
    });
  });
});
