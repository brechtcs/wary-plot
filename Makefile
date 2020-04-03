.PHONY: all test

vendor += vendor/alertify.css
vendor += vendor/alertify.js
vendor += vendor/ckeditor.js
vendor += vendor/html-docx.js
vendor += vendor/stimulus.js

all: $(vendor)

test: all
	surge . draft-pamphlets.surge.sh

vendor/%.css: vendor/css/%.txt
	curl -L "`cat $<`" > $@

vendor/%.js: vendor/js/%.txt
	curl -L "`cat $<`" > $@
