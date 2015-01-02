#!/usr/bin/env node
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

function toCssPath(levelLimit, documentHolder){
	var path = this.nodeName.toLowerCase(),
			level = 0,
			levelLimit = levelLimit || -1;

	document = document || documentHolder;

	if(!document){
		throw new Error("toCssPath must access to 'document' object");
	}

	while((!levelLimit || levelLimit == -1 || level <= levelLimit) && document.querySelectorAll(path).length != 1){
		// cache the copy of last valid css path 
		var cachedPath = path;

		if(level == 0){
			var id = this.id.replace(/\s/g, "");
			if(id !== ""){
				path += "#" + id.replace(/\./g, "\\.");

				// (fixed with "\\." escape) 
				// BUG: path not matched when 'id' contains '.' character
				// Chrome is encoding the '.' to '\2e ' and it works
				// but not on jsdom unfortunatly
			}
		}else if(level == 1){
			var className = this.className.replace(/\s+/g, " ").trim();
			if(className !== ""){
				path += "." + className.replace(/\s/g, ".");
			}
		}else if(level == 2){
			var parentNode = this.parentNode,
					children = Array.prototype.slice.call(parentNode.children, 0);
			if(parentNode){
				path += ":nth-child("+ (children.indexOf(this) + 1) +")";
			}
		}else if(level == 3){
			var parentNode = this.parentNode,
					parentLevel = 0,
					// since current function its not optimized
					// increasing the parentlevelLimit will cause
					// better test result (assertCount)
					// etc: (assertCount, passCount)
					//   parentLevelLimit = 5 ==> 2000, 1000
					//   parentLevelLimit = 20 ==> 3000, 1000
					parentLevelLimit = 20;

			while(parentLevel < parentLevelLimit && document.querySelectorAll(path).length != 1){
				if(!parentNode || parentNode.nodeName.toLowerCase() === "#document"){
					// console.debug("Parent is not exists or its '#document'. Breaked");
					break;
				}

				path = parentNode.toCssPath(2) + " > " + path;

				parentLevel++;
				parentNode = parentNode.parentNode;
			}
		}else{
			console.debug(path);
			console.debug("");
			return null;
		}

		// Bug Fix: path could be a unvalid css path if it's
		// 'querySelector' throws a Error 
		// when that happens retrive the last valid path from cache
		try{
			document.querySelector(path);
		}catch(e){
			path = cachedPath;
		}

		level++;
	}

	return path;
};

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
