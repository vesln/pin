[![Build Status](https://secure.travis-ci.org/vesln/pin.png)](http://travis-ci.org/vesln/pin)

# Pin

Is my site up? Node.js edition.

## Install

```	
$ npm install pin
```

## Usage

```js
var pin = require('pin');

pin('http://google.com/')
  .interval(10000) // in ms
  .up(function(response) {
      console.log(response);
   })
  .down(function(error, response) {
    console.log(error, response);
  });
```

Both "up" and "down" are optional.

Check if text is present in the body:

```js
var pin = require('pin');

pin('http://google.com/')
  .interval(10000) // in ms
  .text('Google')
  .up(function(response) {
      console.log(response);
   })
```

Register custom validator:

```js
var pin = require('pin');

var validator = function(err, response, body) {
  // your custom checks here
  // it must return bool

  return true;
};

pin('http://google.com/')
  .interval(10000) // in ms
  .register(validator)
  .up(function(response) {
      console.log(response);
   })
```

## Features

- Super minimalistic api
- Custom drivers, switch between superagent, request or your awesome driver
- Custom validators
- Check if text is present in the body

## Todo

- Custom headers

## Tests
	
```
$ npm install
$ make test
```

## License

MIT License
