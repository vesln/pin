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

Check if response is back under maximum duration:

```js
var pin = require('pin');

pin('http://google.com/')
  .interval(10000) // in ms
  .maxDuration(800) // in ms
  .up(function(response, info) {
      console.log(response, info.duration);
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

Register custom headers:

```js
var pin = require('pin');

pin('http://google.com/')
  .interval(10000) // in ms
  .header('My-header', 'Foo')
  .header('Other-header', 'Bar')
  .up(function(response) {
      console.log(response);
   })
```

## Features

- Super minimalistic api
- Custom validators
- Check if text is present in the body
- Check response time
- Custom headers

## Tests
	
```
$ npm install
$ make test
```

## License

MIT License
