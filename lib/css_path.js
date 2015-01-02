var inherits = require("util").inherits;
var Selector = require("./selectors/selector.js");

inherits(CssPath, Selector);
function CssPath(documentHolder, path){
	Selector.call(this, Selector.TYPE_PATH, path);

	this.document = documentHolder;
	this.path = path || [];
}

CssPath.prototype.add = function(step){
	this.path.push(step);
};

CssPath.prototype.flush = function(){
	this.path = [];
};

CssPath.prototype.remove = function(s){
	var pathLen = this.path.length,
			path = this.path;

	for(var i = 0; i < pathLen; i++){
		if(path[i].id === s.id){
			this.path.splice(i, 1);
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

CssPath.prototype.isUnique = function(){
	var path = this.toString();	
	return this.document.querySelectorAll(path).length == 0; 
};

// TODO: find another way to caching body element
// it causes a error since its using #document 
// before it initalized
CssPath.prototype.isValid = (function(){
	// var body = document.createElement("body");

	// return function(){
	// 	var path = this.toString();
	// 	try{
	// 		body.querySelector(path);
			
	// 		return true;
	// 	}catch(e){
	// 		return false;
	// 	}
	// }
})();

CssPath.prototype.toString = function(){
	var path = this.path,
			pathString = "";

	// TODO: optimize/minimize the path before converting to a string
	// ...

	for(var i = 0; i < path.length; i++){
		var s = path[i];

		if(s instanceof ParentSelector){
			pathString = s.toString() + " > " + pathString;
		}else{
			pathString += s.toString();
		}
	}
};

module.exports = CssPath;