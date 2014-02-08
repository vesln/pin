tests    := test/*.test.js
reporter := dot

all: clean node_modules test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(reporter) \
		$(tests)

node_modules: package.json
	@npm install

clean:
	@rm -rf node_modules

.PHONY: test clean
