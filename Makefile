.PHONY: all test

alertify := vendor/alertify.css vendor/alertify.js
ckeditor := vendor/ckeditor.js
html-docx := vendor/html-docx.js

all: $(alertify) $(ckeditor) $(html-docx)

test: all
	surge . draft-pamphlets.surge.sh

vendor/%.css: vendor/css/%.txt
	curl -L "`cat $<`" > $@

vendor/%.js: vendor/js/%.txt
	curl -L "`cat $<`" > $@
