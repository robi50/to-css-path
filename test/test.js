#!/usr/bin/env mocha
var jsdom = require("jsdom").jsdom;
var fs = require("fs");
var assert = require("assert");

var toSelector = require("../lib/to_selector.js");
var toJSON = require("../lib/util/to_json.js");

var doc = jsdom(fs.readFileSync(__dirname + "/html_env/test_env.html")),
		window = doc.parentWindow,
		document = window.document;

toSelector.install(window.HTMLElement, document, true);
toJSON.install(window.HTMLElement);

function elNameToSelector(name){
	var el = document.querySelector("[data-el-name='"+ name +"']");
	if(!el){
		return undefined;
	}
	if(!el.toSelector){
		throw new Error("elNameToElement: toSelector not installed on given element");
	}

	return el.toSelector();
}

function query(q){
	return document.querySelector(q);
}

describe("toSelector", function(){
	var names = "abcdejklmn".split("");

	it("should give right css path", function(){
		assert.deepEqual(elNameToSelector("a"), "fancyspan");
		assert.deepEqual(elNameToSelector("b"), "span#foo");
		assert.deepEqual(elNameToSelector("c"), "span.fee.faa");
		assert.deepEqual(elNameToSelector("d"), "span.fee.foo:nth-child(1)");
		assert.deepEqual(elNameToSelector("e"), "span.fit.fat:nth-child(1)");
		assert.deepEqual(elNameToSelector("j"), "div.foo > div:nth-child(1) > span:nth-child(1)");
		assert.deepEqual(elNameToSelector("k"), "p:nth-child(2)");
		assert.deepEqual(elNameToSelector("l"), "ul:nth-child(1) > li:nth-child(3)");
		assert.deepEqual(elNameToSelector("m"), "script:nth-child(14)");
		assert.deepEqual(elNameToSelector("n"), "span#nee\\.fee");
	});

	it("should give valid css path to correct dom element", function(){
		for(var i = 0; i < names.length; i++){
			var n = names[i];
			assert.deepEqual(document.querySelector(elNameToSelector(n)), document.querySelector("[data-el-name='"+ n +"']"));
		}
	})
});