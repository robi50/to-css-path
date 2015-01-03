#!/usr/bin/env mocha
var jsdom = require("jsdom");
var assert = require("assert");

var Selector = require("../lib/selectors/selector.js");
var IdSelector = require("../lib/selectors/id_selector.js");
var ClassSelector = require("../lib/selectors/class_selector.js");
var TagSelector = require("../lib/selectors/tag_selector.js");
var NthSelector = require("../lib/selectors/nth_selector.js");
var ParentSelector = require("../lib/selectors/parent_selector.js");

var CssPath = require("../lib/css_path.js");

describe("Selectors", function(){
	describe("All of them", function(){
		it("should initalize with correct type and value", function(){
			var s1 = new IdSelector("a");
			assert.deepEqual(Selector.TYPE_ID, s1.type);
			assert.deepEqual(s1.value, "a");

			var s2 = new ClassSelector("b");
			assert.deepEqual(Selector.TYPE_CLASS, s2.type);
			assert.deepEqual(s2.value, "b");

			var s3 = new TagSelector("c");
			assert.deepEqual(Selector.TYPE_TAG, s3.type);
			assert.deepEqual(s3.value, "c");

			var s4 = new NthSelector("d");
			assert.deepEqual(Selector.TYPE_NTH, s4.type);
			assert.deepEqual(s4.value, "d");
		});

		it("should give correct string when 'toString' method called", function(){
			var s1 = new IdSelector("aa");
			assert.deepEqual(s1.toString(), "#aa");

			var s2 = new ClassSelector(["a"]);
			assert.deepEqual(s2.toString(), ".a");
			var s3 = new ClassSelector(["a", "b"]);
			assert.deepEqual(s3.toString(), ".a.b");

			var s4 = new TagSelector("cc");
			assert.deepEqual(s4.toString(), "cc");

			var s5 = new NthSelector("dd");
			assert.deepEqual(s5.toString(), ":nth-child(dd)");
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

	describe("ParentSelector", function(){
		describe("#constructor()", function(){
			it("should initalize correctly by given parameters", function(){
				var parentS = new ParentSelector("a", "b");

				assert.deepEqual(parentS.type, Selector.TYPE_PATH);
				assert.deepEqual(parentS.document, "a");
				assert.deepEqual(parentS.path, "b");
			});
		});
	});
});