var inherits = require("util").inherits;
var Selector = require("./selector.js");

inherits(TagSelector, Selector);
function TagSelector(value){
	Selector.call(this, Selector.TYPE_TAG, value);
}

TagSelector.prototype.toString = function(){
	return this.value;
};

module.exports = TagSelector;