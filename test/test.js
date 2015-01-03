#!/usr/bin/env mocha
var jsdom = require("jsdom");
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

	describe("CssPath", function(){
		describe("#constructor()", function(){
			it("should correctly initalized by given parameters", function(){
				var cp1 = new CssPath("a");

				assert.deepEqual(cp1.document, "a");
				assert.deepEqual(cp1.path, []);
				assert.deepEqual(cp1.type, Selector.TYPE_PATH);
				assert.deepEqual(cp1.changed, false);

				// now there should be 'changed' in path since there is uncompiled path
				var cp2 = new CssPath("b", "c");
				assert.deepEqual(cp2.document, "b");
				assert.deepEqual(cp2.path, "c");
				assert.deepEqual(cp2.changed, true);
			});
		});

		describe("#toString()", function(){
			it("should give correct output according to current path", function(done){
				jsdom.env("<html><head></head><body></body></html>", [], function(err, window){
					if(!err){
						var cp = new CssPath(window.document);

						cp.add(new IdSelector("a"));
						assert.deepEqual(cp.toString(), "#a");

						cp.add(new ClassSelector(["b", "c"]));
						assert.deepEqual(cp.toString(), "#a.b.c");

						var s1 = new TagSelector("d");
						cp.add(s1);
						assert.deepEqual(cp.toString(), "#a.b.cd");

						cp.add(new NthSelector("e"));
						assert.deepEqual(cp.toString(), "#a.b.cd:nth-child(e)");

						cp.moveToStart(s1);
						assert.deepEqual(cp.toString(), "d#a.b.c:nth-child(e)");

						var p1 = new ParentSelector(window.document);
						p1.add(new TagSelector("f"), new ClassSelector(["g"]), new NthSelector("h"));
						assert.deepEqual(p1.toString(), "f.g:nth-child(h)");

						cp.add(p1);
						assert.deepEqual(cp.toString(), "f.g:nth-child(h) > d#a.b.c:nth-child(e)");

						var p2 = new ParentSelector(window.document),
								p3 = new ParentSelector();
						p2.add(new TagSelector("div"));
						p3.add(new TagSelector("span"));
						p3.add(p2);
						assert.deepEqual(p3.toString(), "div > span");

						cp.add(p3);
						assert.deepEqual(cp.toString(), "div > span > f.g:nth-child(h) > d#a.b.c:nth-child(e)");

						window.close();
					}else{
						assert.ok(false, "jsdom env could not be created");
					}

					done();
				});
			});

			it("should give path string from cache when there is no change otherwise should compile", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.toString(), "");
				assert.deepEqual(cp.changed, false);
				cp.add(new IdSelector("a"));
				assert.deepEqual(cp.changed, true);
				cp.toString();
				assert.deepEqual(cp.changed, false);
			});
		});

		describe("#isValid()", function(){
			it("should return true if current path is a valid css path otherwise false", function(done){
				jsdom.env("<html><head></head><body></body></html>", [], function(err, window){
					if(!err){
						var cp = new CssPath(window.document);

						cp.add(new TagSelector("a"), new IdSelector("b"));
						assert.ok(cp.isValid());

						cp.add(new TagSelector("#!"));
						assert.ok(!cp.isValid());

						window.close();
					}else{
						assert.ok(false, "jsdom env could not be created");
					}

					done();
				});
			});
		});

		describe("#isUnique", function(){
			it("should return true if current path is unique in document otherwise false", function(done){
				jsdom.env("<html><head></head><body></body></html>", [], function(err, window){
					if(!err){
						var document = window.document, 
								cp = new CssPath(window.document);

						cp.add(new TagSelector("span"));
						assert.ok(!cp.isUnique());

						document.body.appendChild(document.createElement("span"));
						assert.ok(cp.isUnique());
						
						document.body.appendChild(document.createElement("span"));
						assert.ok(!cp.isUnique());

						window.close();
					}else{
						assert.ok(false, "jsdom env could not be created");
					}

					done();
				});
			});
		});

		describe("#add()", function(){
			it("should add a new value to path", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.length(), 0);

				cp.add("a");
				assert.deepEqual(cp.length(), 1);
				cp.add("b");
				assert.deepEqual(cp.length(), 2);

				cp.add("c", "d");
				assert.deepEqual(cp.length(), 4);
			});

			it("should give a info to path when there is change", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.changed, false);
				cp.add("3");
				assert.deepEqual(cp.changed, true);
			});
		});

		describe("#flush()", function(){
			it("should remove the all selectors from path and reset the instance", function(){
				var cp = new CssPath();

				cp.add("a");
				cp.flush();
				assert.deepEqual(cp.length(), 0);
				assert.deepEqual(cp.changed, false);
				assert.deepEqual(cp.toString(), "");
			});
		});

		describe("#remove()", function(){
			it("should remove the given selector and returns true if its removed", function(){
				var cp = new CssPath();

				var s1 = new IdSelector("a"),
						s2 = new ClassSelector("b");
				cp.add(s1, s2);

				var isRemoved = cp.remove(s2);
				assert.deepEqual(cp.length(), 1);
				assert.deepEqual(cp.at(0), s1);
				assert.ok(isRemoved);

				var isRemoved = cp.remove(s2);
				assert.ok(!isRemoved);
			});

			it("should give a info to path when there is change", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.changed, false);
				var s1 = new IdSelector("a");
				cp.add(s1);
				cp.toString();
				assert.deepEqual(cp.changed, false);
				cp.remove(s1);
				assert.deepEqual(cp.changed, true);
			});
		});

		describe("#count()", function(){
			it("should return the count of selectors with matched given type", function(){
				var cp = new CssPath();

				cp.add(new IdSelector("a"), new ClassSelector("b"));
				assert.deepEqual(cp.count(Selector.TYPE_ID), 1);

				cp.add(new IdSelector("c"), new IdSelector("d"));
				assert.deepEqual(cp.count(Selector.TYPE_ID), 3);

				var s1 = new IdSelector("e");
				cp.add(s1);
				assert.deepEqual(cp.count(Selector.TYPE_ID), 4);
				cp.remove(s1);
				assert.deepEqual(cp.count(Selector.TYPE_ID), 3);
			});
		});

		describe("#removeByType()", function(){
			it("should remove one selector from path that matched with given type and returns the removed", function(){
				var cp = new CssPath();

				var s1 = new IdSelector("a"),
						s2 = new ClassSelector("b");
				cp.add(s1, s2);

				var removed = cp.removeByType(Selector.TYPE_ID);
				assert.deepEqual(cp.length(), 1);
				assert.deepEqual(cp.at(0), s2);
				assert.deepEqual(removed, s1);
			});

			it("should give a info to path when there is change", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.changed, false);
				var s1 = new IdSelector("a");
				cp.add(s1);
				cp.toString();
				assert.deepEqual(cp.changed, false);
				cp.removeByType(Selector.TYPE_ID);
				assert.deepEqual(cp.changed, true);
				cp.toString();
				cp.removeByType(Selector.TYPE_ID);
				assert.deepEqual(cp.changed, false);
			});
		});

		describe("#removeAllByType()", function(){
			it("should remove all selectors from path that matched with given type and returns the removeds", function(){
				var cp = new CssPath();

				var s1 = new IdSelector("a"),
						s2 = new IdSelector("b"),
						s3 = new ClassSelector("b");
				cp.add(s1, s2, s3);

				var removed = cp.removeAllByType(Selector.TYPE_ID);
				assert.deepEqual(cp.length(), 1);
				assert.deepEqual(cp.at(0), s3);
				assert.deepEqual(removed, [s1, s2]);
			});

			it("should give a info to path when there is change", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.changed, false);
				
				var s1 = new IdSelector("a");
				
				cp.add(s1);
				cp.toString();
				assert.deepEqual(cp.changed, false);
				cp.removeAllByType(Selector.TYPE_ID);
				assert.deepEqual(cp.changed, true);

				cp.toString();
				cp.removeAllByType(Selector.TYPE_ID);
				assert.deepEqual(cp.changed, false);
			});
		});

		describe("#at()", function(){
			it("should return selector from current path by given indis", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.at(0), null);
				assert.deepEqual(cp.at(1), null);

				cp.add("a", "b", "c");

				assert.deepEqual(cp.at(0), "a");
				assert.deepEqual(cp.at(1), "b");
				assert.deepEqual(cp.at(2), "c");

				assert.deepEqual(cp.at(-1), "c");
				assert.deepEqual(cp.at(-2), "b");
				assert.deepEqual(cp.at(-3), "a");
				assert.deepEqual(cp.at(-4), null);
			});
		});

		describe("#length()", function(){
			it("should return selector count of current path", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.length(), 0);
				cp.add("a");
				assert.deepEqual(cp.length(), 1);
				
				cp.add("b", "c");
				assert.deepEqual(cp.length(), 3);

				cp.pop();
				assert.deepEqual(cp.length(), 2);
			});
		});

		describe("#pop()", function(){
			it("should remove last selector/selectors from current path according to given count", function(){
				var cp = new CssPath();

				cp.add(new IdSelector("a"));
				assert.deepEqual(cp.length(), 1);
				cp.pop();
				assert.deepEqual(cp.length(), 0);

				var s1 = new IdSelector("b");
				cp.add(s1);
				cp.add(new IdSelector("c"));
				cp.add(new IdSelector("d"));
				assert.deepEqual(cp.length(), 3);
				cp.pop(2);
				assert.deepEqual(cp.length(), 1);
				assert.deepEqual(cp.at(0), s1);
			});

			it("should give a info to path when there is change", function(){
				var cp = new CssPath();

				assert.deepEqual(cp.changed, false);
				var s1 = new IdSelector("a");
				cp.add(s1);
				cp.toString();
				assert.deepEqual(cp.changed, false);
				cp.pop();
				assert.deepEqual(cp.changed, true);
				cp.toString();
				cp.pop();
				assert.deepEqual(cp.changed, false);
			});
		});

		describe("#moveToStart", function(){
			it("should move the given selector to start of current path", function(){
				var cp = new CssPath();

				var s1 = new IdSelector("a"),
						s2 = new IdSelector("b"),
						s3 = new IdSelector("c");
				cp.add(s1, s2, s3);

				assert.deepEqual(cp.at(1), s2);
				cp.moveToStart(s2);
				assert.deepEqual(cp.at(0), s2);
				assert.deepEqual(cp.at(1), s1);
				assert.deepEqual(cp.at(2), s3);
				assert.deepEqual(cp.length(), 3);

				// lets move one more time
				assert.deepEqual(cp.at(2), s3);
				cp.moveToStart(s3);
				assert.deepEqual(cp.at(0), s3);
				assert.deepEqual(cp.at(1), s2);
				assert.deepEqual(cp.at(2), s1);
				assert.deepEqual(cp.length(), 3);

				cp.flush();

				var s4 = new IdSelector("d");
				cp.add(s1, s2, s3, s4);

				assert.deepEqual(cp.at(3), s4);
				cp.moveToStart(s4);
				assert.deepEqual(cp.at(0), s4);
				assert.deepEqual(cp.at(1), s1);
				assert.deepEqual(cp.at(2), s2);
				assert.deepEqual(cp.at(3), s3);
				assert.deepEqual(cp.length(), 4);
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