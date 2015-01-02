#!/usr/bin/env mocha
var jsdom = require("jsdom").jsdom;
var fs = require("fs");
var assert = require("assert");

// var toCssPath = require("../lib/to_css_path.js");
// var toJSON = require("../lib/util/to_json.js");

// var doc = jsdom(fs.readFileSync(__dirname + "/html_env/test_env.html")),
// 		window = doc.parentWindow,
// 		document = window.document;

// toCssPath.install(window.HTMLElement, document, true);
// toJSON.install(window.HTMLElement);

describe("Selectors", function(){
	var Selector = require("../lib/selectors/selector.js");
	var IdSelector = require("../lib/selectors/id_selector.js");
	var ClassSelector = require("../lib/selectors/class_selector.js");
	var TagSelector = require("../lib/selectors/tag_selector.js");
	var NthSelector = require("../lib/selectors/nth_selector.js");
	var ParentSelector = require("../lib/selectors/parent_selector.js");

	describe("All of them", function(){
		it("should initalize with correct type and value", function(){
			var idS = new IdSelector("a");
			assert.deepEqual(Selector.TYPE_ID, idS.type);
			assert.deepEqual(idS.value, "a");

			var classS = new ClassSelector("b");
			assert.deepEqual(Selector.TYPE_CLASS, classS.type);
			assert.deepEqual(classS.value, "b");

			var tagS = new TagSelector("c");
			assert.deepEqual(Selector.TYPE_TAG, tagS.type);
			assert.deepEqual(tagS.value, "c");

			var nthS = new NthSelector("d");
			assert.deepEqual(Selector.TYPE_NTH, nthS.type);
			assert.deepEqual(nthS.value, "d");
		});

		it("should give correct string when 'toString' method called", function(){
			var idS = new IdSelector("aa");
			assert.deepEqual(idS.toString(), "#aa");

			// TODO: ClassSelector

			var tagS = new TagSelector("cc");
			assert.deepEqual(tagS.toString(), "cc");

			var nthS = new NthSelector("dd");
			assert.deepEqual(nthS.toString(), ":nth-child(dd)");
		});
	});

	describe("Selector", function(){
		describe("#constructor()", function(){
			it("should initialize the own properties by given paramaters", function(){
				var s = new Selector(0, "a");

				assert.deepEqual(s.type, 0);
				assert.deepEqual(s.value, "a");
			});

			it("should give every instance a unique id", function(){
				var selectorIdPool = [];

				for(var i = 0; i < 10; i++){
					var s = new Selector(i, new String(i * 2));
					
					assert.ok(selectorIdPool.indexOf(s.id) === -1);

					selectorIdPool.push(s.id);
				}
			});
		});

		describe("#toString()", function(){
			it("should throw a error if its not implemented/overrided", function(){
				var s = new Selector();
				assert.throws(function(){
					s.toString();
				});
			});
		});
	});
});