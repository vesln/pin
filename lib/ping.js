/*!
 * Pin(g) - Is my site up? Node.js edition.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Dependencies.
 */
var EventEmitter = require('events').EventEmitter;

/**
 * Ping class.
 *
 * @param {String} url
 * @param {Object} driver
 * @api public
 */
function Ping(url, driver) {
  this.url = url;
  this.driver = driver;
  this.successCodes = ['200', '302', '201', '202', '204', '304'];
  this.started = false;
  this.validators = [];
  var self = this;

  var textCheck = function(err, res, body) {
    if (!self._text) return true;
    return ~body.indexOf(self._text);
  };

  var errorCheck = function(err, res, body) {
    return !err;
  };

  var statusCheck = function(err, res, body) {
    return ~self.successCodes.indexOf(res.statusCode + '');
  };

  var perfCheck = function(err, res, body, info) {
    if (typeof self._maxDuration !== 'number') return true;
    return info.duration <= self._maxDuration;
  };

  this.register(errorCheck, statusCheck, textCheck, perfCheck);
}

/**
 * Ping inhertis from EventEmitter.
 */
Ping.prototype.__proto__ = EventEmitter.prototype;

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
  var args = Array.prototype.slice.call(arguments);

  args.forEach(function(validator) {
    self.validators.push(validator);
  });

  return this;
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
  var self = this,
    start = Date.now();

  this.driver.get(this.url, function(err, res, body) {
    var duration = Date.now() - start,
      info = {duration: duration},
      success = self.isValid(err, res, body, info);
    success ? self.emit('up', res, info) : self.emit('down', err, res, info);
  });
};

/**
 * Expose `Ping`.
 */
module.exports = Ping;
