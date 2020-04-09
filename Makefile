.PHONY: all test

vendor += vendor/ckeditor.js
vendor += vendor/html-docx.js
vendor += vendor/stimulus.js
vendor += vendor/turbolinks.js

all: $(vendor)

test: all
	surge . draft-pamphlets.surge.sh

vendor/%.css: vendor/css/%.txt
	@echo 'Downloading $@'
	@curl -s -L "`cat $<`" > $@

vendor/%.js: vendor/js/%.txt
	@echo 'Downloading $@'
	@curl -s -L "`cat $<`" | terser -o $@
