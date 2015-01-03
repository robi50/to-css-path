var inherits = require("util").inherits;
var Selector = require("./selectors/selector.js");
var ParentSelector = require("./selectors/parent_selector.js");

inherits(CssPath, Selector);
function CssPath(documentHolder, path){
	Selector.call(this, Selector.TYPE_PATH, path);

	this.document = documentHolder;
	this.path = path || [];
	// we update the 'changed' value when something changed in path
	// so we can only 'compile' the path when its change when 'toString' called
	this.changed = path ? true : false;
	this.pathString = "";
}

CssPath.prototype.length = function(){
	return this.path.length;
};

CssPath.prototype.add = function(step){
	this.path.push(step);
	this.changed = true;
};

CssPath.prototype.flush = function(){
	this.path = [];
	this.pathString = "";
	this.changed = false;
};

CssPath.prototype.remove = function(s){
	var pathLen = this.path.length,
			path = this.path;

	for(var i = 0; i < pathLen; i++){
		if(path[i].id === s.id){
			this.path.splice(i, 1);
			this.changed = true;
			return true;
		}
	}

	return false;
};

CssPath.prototype.removeByType = function(type){
	var removedValue,
			pathLen = this.path.length;

	for(var i = 0; i < pathLen; i++){
		var s = this.path[i];
		if(s.type === type){
			this.path.splice(i, 1);
			removedValue = s;
			this.changed = true;
			break;
		}
	}

	return removedValue;
};

CssPath.prototype.removeAllByType = function(type){
	var removed = [];

	while(this.count(type) != 0){
		removed.push(this.removeByType(type));
	}

	return removed;
};

CssPath.prototype.count = function(type){
	var pathLen = this.path.length,
			count = 0,
			path = this.path;

	for(var i = 0; i < pathLen; i++){
		if(path[i].type === type){
			count++;
		}
	}

	return count;
};

CssPath.prototype.pop = function(n){
	n = n || 1;
	n = n >= this.path.length ? this.path.length : n;
	for(var i = 0; i < n; i++){
		this.path.pop();
		this.changed = true;
	}
};

CssPath.prototype.at = function(indis){
	indis = indis < 0 ? indis + this.path.length : indis;
	if(this.path[indis]){
		return this.path[indis];
	}else{
		return null;
	}
};

CssPath.prototype.isUnique = function(){
	var path = this.toString();	
	return this.document.querySelectorAll(path).length === 1; 
};

// TODO: find another way to caching body element
// it causes a error since its using #document 
// before it initalized
CssPath.prototype.isValid = function(){
	var body = this.document.createElement("body"),
			path = this.toString();

	try{
		body.querySelector(path);
		
		return true;
	}catch(e){
		return false;
	}
};

CssPath.prototype.toString = function(){
	// only compile when there is change
	if(this.changed){
		var path = this.path,
				pathLen = path.length,
				pathString = "";

		for(var i = 0; i < pathLen; i++){
			var s = path[i];

			// BUG: it gives a error if use 'ParentSelector' insteadof 'CssPath'
			// which it should be. This is works too since 'ParentSelector' is 
			// instance of 'CssPath' but just annoying 
			if(s instanceof CssPath){
				pathString = s.toString() + " > " + pathString;
			}else{
				pathString += s.toString();
			}
		}

		this.changed = false;
		return this.pathString = pathString;
	}

	return this.pathString;
};

CssPath.prototype.moveToStart = function(e){
	// a, b, c
	// a, b, c
	var path = this.path, 
		  eIndex = path.indexOf(e);

  // if target allready at there
	if(eIndex == 0){
		return;
	}

	var leftElements = path.slice(0, eIndex),
			leftElementsLen = leftElements.length;
	// move every element to next that at left side of the target 
	for(var i = 0; i < leftElementsLen; i++){
		path[i + 1] = leftElements[i];
	}	

	path[0] = e;
};

module.exports = CssPath;