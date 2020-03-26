vendor: vendor/ckeditor.js

vendor/ckeditor.js: Makefile
	mkdir -p $(dir $@)
	curl -L https://cdn.ckeditor.com/ckeditor5/18.0.0/balloon-block/ckeditor.js > $@
