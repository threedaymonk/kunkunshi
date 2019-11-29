AORS = $(wildcard music/*.aor)
TO_CONVERT = $(patsubst %.aor,%.ly,$(AORS))

.PHONY: test lint music

all: test lint

test: src/aor-parser.js
	yarn test

lint:
	yarn eslint .

%-parser.js: %.pegjs
	yarn pegjs -o $@ $<

%.ly: %.aor
	node ./aor2ly.js $< > $@

music: $(TO_CONVERT)
