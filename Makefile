.PHONY: test lint

all: test lint

test: src/aor-parser.js
	yarn test

lint:
	yarn eslint .

%-parser.js: %.pegjs
	yarn pegjs -o $@ $<
