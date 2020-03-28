.PHONY: all test

test: all
	surge . draft-pamphlets.surge.sh

all: vendor/ckeditor.js

vendor/%.js: vendor/%.txt
	mkdir -p $(dir $@)
	curl -L "`cat $<`" > $@
