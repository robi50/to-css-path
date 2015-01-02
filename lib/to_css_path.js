#!/usr/bin/env node
var CssPath = require("./css_path.js");

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

	var path = new CssPath(document);

	while(!path.isUnique()){
	}

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
