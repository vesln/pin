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

## Features

- Super minimalistic api
- Custom drivers, switch between superagent, request or your awesome driver

## Todo

- Check if the response contains supplied text
- Custom headers

## Tests
	
```
$ npm install
$ make test
```

## License

MIT License
