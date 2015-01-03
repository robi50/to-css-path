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

	var CssPath = require("../lib/css_path.js");

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

	describe("CssPath", function(){
		describe("#constructor()", function(){
			it("should correctly initalized by given parameters", function(){
				var cp = new CssPath("a", "b");

				assert.deepEqual(cp.document, "a");
				assert.deepEqual(cp.path, "b");
				assert.deepEqual(cp.type, Selector.TYPE_PATH);
			});
		});

		describe("#add()", function(){
			it("should add a new value to path", function(){
				var cp = new CssPath(null);

				assert.deepEqual(cp.path.length, 0);

				cp.add("a");
				assert.deepEqual(cp.path.length, 1);
				cp.add("b");
				assert.deepEqual(cp.path.length, 2);
			});
		});

		describe("#flush()", function(){
			it("should remove the all selectors from path and reset the instance", function(){
				var cp = new CssPath(null);

				cp.add("a");
				cp.flush();
				assert.deepEqual(cp.path.length, 0);
			});
		});

		describe("#remove()", function(){
			it("should remove the given selector and returns true if its removed", function(){
				var cp = new CssPath(null);

				var aS = new IdSelector("a"),
						bS = new ClassSelector("b");
				cp.add(aS);
				cp.add(bS);

				var isRemoved = cp.remove(bS);
				assert.deepEqual(cp.path.length, 1);
				assert.deepEqual(cp.path[0], aS);
				assert.ok(isRemoved);

				var isRemoved = cp.remove(bS);
				assert.ok(!isRemoved);
			});
		});

		describe("#count()", function(){
			it("should return the count of selectors with matched given type", function(){
				var cp = new CssPath(null);

				cp.add(new IdSelector("a"));
				cp.add(new ClassSelector("b"));
				assert.deepEqual(cp.count(Selector.TYPE_ID), 1);

				cp.add(new IdSelector("c"));
				cp.add(new IdSelector("d"));
				assert.deepEqual(cp.count(Selector.TYPE_ID), 3);

				var idS = new IdSelector("e");
				cp.add(idS);
				assert.deepEqual(cp.count(Selector.TYPE_ID), 4);
				cp.remove(idS);
				assert.deepEqual(cp.count(Selector.TYPE_ID), 3);
			});
		});

		describe("#removeByType()", function(){
			it("should remove one selector from path that matched with given type and returns the removed", function(){
				var cp = new CssPath(null);

				var idS = new IdSelector("a"),
						classS = new ClassSelector("b");
				cp.add(idS);
				cp.add(classS);

				var removed = cp.removeByType(Selector.TYPE_ID);
				assert.deepEqual(cp.path.length, 1);
				assert.deepEqual(cp.path[0], classS);
				assert.deepEqual(removed, idS);
			});
		});

		describe("#removeAllByType()", function(){
			it("should remove all selectors from path that matched with given type and returns the removeds", function(){
				var cp = new CssPath();

				var idS1 = new IdSelector("a"),
						idS2 = new IdSelector("b"),
						classS = new ClassSelector("b");
				cp.add(idS1);
				cp.add(idS2);
				cp.add(classS);

				var removed = cp.removeAllByType(Selector.TYPE_ID);
				assert.deepEqual(cp.path.length, 1);
				assert.deepEqual(cp.path[0], classS);
				assert.deepEqual(removed, [idS1, idS2]);
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