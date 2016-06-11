[![Build Status](https://secure.travis-ci.org/vesln/pin.png)](http://travis-ci.org/vesln/pin)

# Important Notice

I'm no longer actively maintaining this project. If you are interested supporting it - [ping me on twitter](https://twitter.com/vesln).
The only thing that I will ask you is to not change the API drastically. If you are planning on doing that - better start a brand new project.

If you want me to transfer you only the name on npm, I'd be happy to only if the project **does not have any downloads on npm lately**. In case it's being
downloaded, there are people that depend on it and might step up and start maintaining, so I will not transfer it to you, regardless if you want to release
a new major version etc.

If you have any other questions, let me know.

Thanks!

Veselin

# Pin

Is my site up? Node.js edition.

## Features

- Minimalistic API
- Custom validators
- Check if text is present in the body
- Check response time
- Custom headers

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

## Installation

```
$ npm install pin
```

## License

MIT License
