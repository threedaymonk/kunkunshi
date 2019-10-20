aor-parser.js: aor.pegjs
	pegjs -o $@ $<
