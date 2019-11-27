.PHONY: test lint

all: lint test

test: aor-parser.js
	yarn test

lint:
	yarn eslint .

aor-parser.js: aor.pegjs
	yarn pegjs -o $@ $<
