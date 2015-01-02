var inherits = require("util").inherits;
var Selector = require("./selectors/selector.js");

inherits(CssPath, Selector);
function CssPath(documentHolder, path){
	Selector.call(this, Selector.TYPE_PATH, path);

	this.document = document || documentHolder;
	this.path = path || [];
}

CssPath.prototype.add = function(step){
	this.path.push(step);
};

CssPath.prototype.flush = function(){
	this.path = [];
};

CssPath.prototype.removeByType = function(type, all){
	var removedPath = [];
	all = all || true;

	for(var i = 0; i < this.path.length; i++){
		var s = this.path[i];
		if(s.type === type){
			this.path.splice(i, 1);
			removedPath.push(s);

			if(!all){
				break;
			}
		}
	}

	return removedPath;
};

CssPath.prototype.isUnique = function(){
	var path = this.toString();	
	return this.document.querySelectorAll(path).length == 0; 
};

CssPath.prototype.isValid = (function(){
	var body = document.createElement("body");

	return function(){
		var path = this.toString();
		try{
			body.querySelector(path);
			
			return true;
		}catch(e){
			return false;
		}
	}
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