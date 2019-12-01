AORS = $(wildcard music/*.aor)
TO_CONVERT = $(patsubst %.aor,%.pdf,$(AORS))

.PHONY: test lint music clean

all: test lint

test: src/aor-parser.js
	yarn test

lint:
	yarn eslint .

%-parser.js: %.pegjs
	yarn pegjs -o $@ $<

%.kks: %.aor
	node ./aor2kks.js $< > $@

%.ly: %.kks
	node ./kks2ly.js $< > $@

%.pdf: %.ly music/kunkunshi.ly
	lilypond --pdf --output $* $<

music: $(TO_CONVERT)

clean:
	rm -f $(patsubst %.aor,%.ly,$(AORS))
	rm -f $(patsubst %.aor,%.midi,$(AORS))
	rm -f $(patsubst %.aor,%.pdf,$(AORS))
