.PHONY: dev

dev: vendor
	surge . draft-pamphlets.surge.sh

vendor: vendor/ckeditor.js

vendor/ckeditor.js: Makefile
	mkdir -p $(dir $@)
	curl -L https://cdn.ckeditor.com/ckeditor5/18.0.0/inline/ckeditor.js > $@
