#!/usr/bin/env node
if(!document){
	var document;
}

toSelector.debug = false;

if(!console.debug){
	console.debug = function(msg){
		if(toSelector.debug){
			// console.log("DEBUG: " + msg.toJSON ? msg.toJSON() : msg);
			console.log(msg);
		}
	}
}

function toSelector(levelLimit, documentHolder){
	var selector = this.nodeName.toLowerCase(),
			level = 0,
			levelLimit = levelLimit || -1;

	document = document || documentHolder;

	if(!document){
		throw new Error("toSelector must access to 'document' object");
	}

	while((!levelLimit || levelLimit == -1 || level <= levelLimit) && document.querySelectorAll(selector).length != 1){
		// cache the copy of last valid css path 
		var cachedSelector = selector;

		if(level == 0){
			var id = this.id.replace(/\s/g, "");
			if(id !== ""){
				selector += "#" + id.replace(/\./g, "\\.");

				// (fixed with "\\." escape) 
				// BUG: Selector not matched when 'id' contains '.' character
				// Chrome is encoding the '.' to '\2e ' and it works
				// but not on jsdom unfortunatly
			}
		}else if(level == 1){
			var className = this.className.replace(/\s+/g, " ").trim();
			if(className !== ""){
				selector += "." + className.replace(/\s/g, ".");
			}
		}else if(level == 2){
			var parentNode = this.parentNode,
					children = Array.prototype.slice.call(parentNode.children, 0);
			if(parentNode){
				selector += ":nth-child("+ (children.indexOf(this) + 1) +")";
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

			while(parentLevel < parentLevelLimit && document.querySelectorAll(selector).length != 1){
				if(!parentNode || parentNode.nodeName.toLowerCase() === "#document"){
					// console.debug("Parent is not exists or its '#document'. Breaked");
					break;
				}

				selector = parentNode.toSelector(2) + " > " + selector;

				parentLevel++;
				parentNode = parentNode.parentNode;
			}
		}else{
			console.debug(selector);
			console.debug("");
			return null;
		}

		// Bug Fix: selector could be a unvalid css path if it's
		// 'querySelector' throws a Error 
		// when that happens retrive the last valid selector from cache
		try{
			document.querySelector(selector);
		}catch(e){
			selector = cachedSelector;
		}

		level++;
	}

	return selector;
};

toSelector.install = function(element, documentHolder, debug){
	if(!element.prototype.toSelector){
		element.prototype.toSelector = toSelector;
		element.prototype.toSelector.debug = debug || false;
		document = document || documentHolder;
	}else{
		throw new Error("toSelector allready installed on given HTMLElement");
	}
};

toSelector.uninstall = function(element){
	if(element.prototype.toSelector){
		delete element.prototype.toSelector;
		document = undefined;
	}else{
		throw new Error("toSelector is not installed on given HTMLElement");
	}
};

module.exports = toSelector;