/*!
 * Pin(g) - Is my site up? Node.js edition.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Dependencies.
 */
var request = require('request');

/**
 * Ping class.
 *
 * @type {Function}
 */
var Ping = require('./ping');

/**
 * The wrapper function.
 *
 * @returns {Ping} ping object
 */
var pin = function(url, driver) {
  driver || (driver = request);
  return new Ping(url, driver);
};

/**
 * Expose pin.
 */
module.exports = pin;
