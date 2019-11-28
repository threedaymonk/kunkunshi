.PHONY: test lint

all: test lint

test: aor-parser.js
	yarn test

lint:
	yarn eslint .

aor-parser.js: aor.pegjs
	yarn pegjs -o $@ $<
