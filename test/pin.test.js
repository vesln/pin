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
  it('supports custom validators', function(done) {
    var driver = fakeDriver(function(url, fn) {
      fn(null, {statusCode: '200'});
    });

    var end = false;

    var validator = function() {
      if (!end) (end = true) && done();
    };

    pin('http://google.com/', driver)
      .interval(5)
      .register(validator)
      .up(function(res) {});
  });

  describe('when monitoring', function() {
    it('is repeatable', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statusCode: '200'});
      });

      var i = 0;

      pin('http://google.com/', driver)
        .interval(5)
        .up(function(res) {
          if (++i == 2) done();
        });
    });

    it('notifies when site is down', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statusCode: 404});
      });

      var end = false;

      pin('http://google.com/', driver)
        .interval(5)
        .down(function(err, res) {
          if (!end) (end = true) && done();
        });
    });

    it('notifies when site is up', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(null, {statusCode: 200});
      });

      var end = false;

      pin('http://google.com/', driver)
        .interval(10)
        .up(function(err, res) {
          if (!end) (end = true) && done();
        });
    });

    it('notifies when an error occurs', function(done) {
      var driver = fakeDriver(function(url, fn) {
        fn(new Error('Test error'), {});
      });

      var end = false;

      pin('http://google.com/', driver)
        .interval(5)
        .down(function(err, res) {
          err.should.be.ok;
          if (!end) (end = true) && done();
        });
    });

    describe('when text to check is present', function() {
      it('emits up if the text exist', function(done) {
        var driver = fakeDriver(function(url, fn) {
          var body = 'This is Awesome';
          fn(null, {statusCode: 200}, body);
        });

        var end = false;

        pin('http://google.com/', driver)
          .text('Awesome')
          .interval(10)
          .up(function(err, res) {
            if (!end) (end = true) && done();
          });
      });

      it('emits down if the text is not present', function(done) {
        var driver = fakeDriver(function(url, fn) {
          var body = 'This is a problem';
          fn(null, {statusCode: 200}, body);
        });

        var end = false;

        pin('http://google.com/', driver)
          .text('Awesome')
          .interval(10)
          .down(function(err, res) {
            if (!end) (end = true) && done();
          });
      });
    });

    describe('when maxDuration to check is present', function () {
      it('emits up if duration is less than max', function (done) {
        var driver = fakeDriver(function (url, fn) {
          fn(null, {statusCode: 200});
        });

        var end = false;

        pin('http://google.com/', driver)
          .interval(10)
          .maxDuration(1000)
          .down(function () {
            throw Error('down should not be called');
          })
          .up(function (res, info) {
            info.duration.should.be.below(1000);
            if (!end) (end = true) && done();
          });
      });

      it('emits down if duration is more than max', function (done) {
        var driver = fakeDriver(function (url, fn) {
          setTimeout(function () {
            fn(null, {statusCode: 200});
          }, 20);
        });

        var end = false;

        pin('http://google.com/', driver)
          .interval(10)
          .maxDuration(10)
          .up(function () {
             throw Error('up should not be called');
          })
          .down(function (err, res, info) {
            info.duration.should.be.above(10);
            if (!end) (end = true) && done();
          });
      });
    });
  });
});
