#!/usr/bin/env mocha
var jsdom = require("jsdom").jsdom;
var fs = require("fs");
var assert = require("assert");

var toCssPath = require("../lib/to_css_path.js");
var toJSON = require("../lib/util/to_json.js");

var doc = jsdom(fs.readFileSync(__dirname + "/html_env/test_env.html")),
		window = doc.parentWindow,
		document = window.document;

toCssPath.install(window.HTMLElement, document, true);
toJSON.install(window.HTMLElement);

function elNametoCssPath(name){
	var el = document.querySelector("[data-el-name='"+ name +"']");
	if(!el){
		return undefined;
	}
	if(!el.toCssPath){
		throw new Error("elNameToElement: toCssPath not installed on given element");
	}

	return el.toCssPath();
}

function query(q){
	return document.querySelector(q);
}

describe("toCssPath", function(){
	var names = "abcdejklmn".split("");

	it("should give right css path", function(){
		assert.deepEqual(elNametoCssPath("a"), "fancyspan");
		assert.deepEqual(elNametoCssPath("b"), "span#foo");
		assert.deepEqual(elNametoCssPath("c"), "span.fee.faa");
		assert.deepEqual(elNametoCssPath("d"), "span.fee.foo:nth-child(1)");
		assert.deepEqual(elNametoCssPath("e"), "span.fit.fat:nth-child(1)");
		assert.deepEqual(elNametoCssPath("j"), "div.foo > div:nth-child(1) > span:nth-child(1)");
		assert.deepEqual(elNametoCssPath("k"), "p:nth-child(2)");
		assert.deepEqual(elNametoCssPath("l"), "ul:nth-child(1) > li:nth-child(3)");
		assert.deepEqual(elNametoCssPath("m"), "script:nth-child(14)");
		assert.deepEqual(elNametoCssPath("n"), "span#nee\\.fee");
	});

	it("should give valid css path to correct dom element", function(){
		for(var i = 0; i < names.length; i++){
			var n = names[i];
			assert.deepEqual(document.querySelector(elNametoCssPath(n)), document.querySelector("[data-el-name='"+ n +"']"));
		}
	})
});