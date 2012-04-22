/*!
 * Pin(g) - Is my site up? Node.js edition.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var pin = require('../');

pin('http://google.com/')
  .interval(500)
  .up(function(res) {
    console.log(res);
    process.exit(1);
  });
