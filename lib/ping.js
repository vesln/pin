/**
 * Dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var request = require('request');
var inherits = require('util').inherits;

/**
 * HTTP success codes considered as success.
 */

var SUCCESS = [
  200,
  201,
  202,
  204,
  302,
  304
];

/**
 * Ping class.
 *
 * @param {String} url
 * @param {Object} driver
 * @constructor
 */

function Ping(url, driver) {
  if (!(this instanceof Ping)) {
    return new Ping(url, driver);
  }

  driver = driver || request;

  this.url = url;
  this.driver = driver;
  this.successCodes = SUCCESS;
  this.started = false;
  this.validators = [];
  var self = this;

  var textCheck = function(err, res, body) {
    if (!self._text) return true;
    return ~body.indexOf(self._text);
  };

  var errorCheck = function(err, res) {
    return !err;
  };

  var statusCheck = function(err, res, body) {
    // If there is no result from the server, assume site is down.
    if (!res){
      return false;
    } else {
      return ~self.successCodes.indexOf(res.statusCode);
    }
  };

  var perfCheck = function(err, res, body, info) {
    if (typeof self._maxDuration !== 'number') return true;
    return info.duration <= self._maxDuration;
  };

  this.register(errorCheck, statusCheck, textCheck, perfCheck);
}

/**
 * Inherit from `EventEmitter`.
 */

inherits(Ping, EventEmitter);

/**
 * Set ping interval.
 *
 * @param {Number} interval
 * @returns `this`
 * @api public
 */

Ping.prototype.interval = function(interval) {
  this._interval = interval;
  return this;
};

/**
 * Register a validator.
 *
 * @param {Function} validator
 * @returns {Object} `this`
 * @api public
 */

Ping.prototype.register = function() {
  var self = this;
  var args = [].slice.call(arguments);

  args.forEach(function(validator) {
    self.validators.push(validator);
  });

  return this;
};

/**
 * Set text to be checked if is present in the response body.
 *
 * @param {String} text
 * @returns {Object} `this`
 * @api public
 */

Ping.prototype.text = function(text) {
  this._text = text;
  return this;
};

/**
 * Set max duration in milliseconds.
 *
 * @param {Number} maxDuration
 * @returns {Object} `this`
 * @api public
 */

Ping.prototype.maxDuration = function(maxDuration) {
  this._maxDuration = maxDuration;
  return this;
};

/**
 * Register up callback.
 *
 * @param {Function} fn callback
 * @returns `this`
 * @api public
 */

Ping.prototype.up = function(fn) {
  this.on('up', fn);
  this.monitor();
  return this;
};

/**
 * Register down callback.
 *
 * @param {Function} fn callback
 * @returns `this`
 * @api public
 */

Ping.prototype.down = function(fn) {
  this.on('down', fn);
  this.monitor();
  return this;
};

/**
 * Start to monitor an url address.
 *
 * @api private
 */

Ping.prototype.monitor = function() {
  if (this.started) return;

  var self = this;
  this.started = true;

  setInterval(function() {
    self.check();
  }, this._interval);
};

/**
 * Check if site is up or down.
 *
 * @api private
 */

Ping.prototype.check = function() {
  var self = this;
  var start = Date.now();

  this.driver.get(this.url, function(err, res, body) {
    var duration = Date.now() - start
    var info = { duration: duration };

    self.isValid(err, res, body, info)
      ? self.emit('up', res, info)
      : self.emit('down', err, res, info);
  });
};

/**
 * Check if request is "valid" or not.
 *
 * @param {Object} err
 * @param {Object} res
 * @param {String} body
 * @param {Object} info additional info about the ping, e.g. duration
 * @returns {Boolean}
 * @api private
 */

Ping.prototype.isValid = function(err, res, body, info) {
  var ret = true;
  this.validators.forEach(function(validator) {
    if (!validator(err, res, body, info)) ret = false;
  });
  return ret;
};

/**
 * Primary export.
 */

module.exports = Ping;
