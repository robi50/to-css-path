#!/usr/bin/env node
var CssPath = require("./css_path.js");

var TagSelector = require("./selectors/tag_selector.js");
var IdSelector = require("./selectors/id_selector.js");
var ClassSelector = require("./selectors/class_selector.js");

if(!document){
	var document;
}

toCssPath.debug = false;

if(!console.debug){
	console.debug = function(msg){
		if(toCssPath.debug){
			// console.log("DEBUG: " + msg.toJSON ? msg.toJSON() : msg);
			console.log(msg);
		}
	}
}

function toCssPath(){
	if(!document){
		throw new Error("#document or/and #document.body is not exists");
	}

	var level = 0,
			path = new CssPath(document);

	path.add(new TagSelector(this.tagName.toLowerCase()));

	do {
		if(level == 0){
			var id = this.id.replace(/\s/g, "");
			if(id !== ""){
				path.add(new IdSelector(id.replace(/\./g, "\\.")));
			}
		}else if(level == 1){
			var classList = this.classList;
			if(classList.length > 0){
				path.add(new ClassSelecor(Array.prototype.slice.call(classList)));
			}
		}



		level++;
	} while(!path.isUnique());

	return path;
}

toCssPath.install = function(element, documentHolder, debug){
	if(!element.prototype.toCssPath){
		element.prototype.toCssPath = toCssPath;
		element.prototype.toCssPath.debug = debug || false;
		document = document || documentHolder;
	}else{
		throw new Error("toCssPath allready installed on given target");
	}
};

toCssPath.uninstall = function(element){
	if(element.prototype.toCssPath){
		delete element.prototype.toCssPath;
		document = undefined;
	}else{
		throw new Error("toCssPath is not installed on given target");
	}
};

module.exports = toCssPath;