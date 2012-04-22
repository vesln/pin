/*!
 * Pin(g) - Is my site up? Node edition.
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
};

/**
 * Ping inhertis from EventEmitter.
 */
Ping.prototype.__proto__ = EventEmitter.prototype;

/**
 * Set ping interval.
 *
 * @param {Number} ms
 * @returns `this`
 * @api public
 */
Ping.prototype.interval = function(time) {
  this.time = time;
  return this;
};

/**
 * Register up callback.
 *
 * @param {Function} callback
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
 * @param {Function} callback
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
  }, this.time);
};

/**
 * Check if site is up or down.
 *
 * @api private
 */
Ping.prototype.check = function() {
  var self = this;
  var successCodes = this.successCodes;

  var success = function(res) {
    self.emit('up', res);
  };

  var error = function(err, res) {
    self.emit('down', err, res);
  };

  var fn = function(err, res, body) {
    if (!err || ~successCodes.indexOf(res.statusCode)) {
      success(res);
    } else {
      error(err, res);
    }
  };

  this.driver.get(this.url, fn);
};

/**
 * Expose `Ping`.
 */
module.exports = Ping;
