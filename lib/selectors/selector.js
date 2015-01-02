function Selector(type, value){
	this.id = Selector.id++;
	this.type = type;
	this.value = value;
};

Selector.prototype.toString = function(){
	throw new Error("Selector must implemented 'toString' method");
};

Selector.id = 0;

Selector.TYPE_ID = 0;
Selector.TYPE_CLASS = 1;
Selector.TYPE_PATH = 2;
Selector.TYPE_TAG = 3;
Selector.TYPE_NTH = 4;

module.exports = Selector;