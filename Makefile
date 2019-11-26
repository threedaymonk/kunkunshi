.PHONY: test

test: aor-parser.js
	yarn test

aor-parser.js: aor.pegjs
	yarn pegjs -o $@ $<
