var inherits = require("util").inherits;
var Selector = require("./selector.js");

inherits(IdSelector, Selector);
function IdSelector(value){
	Selector.call(this, Selector.TYPE_ID, value);
}

IdSelector.prototype.toString = function(){
	return "#" + this.value;
};

module.exports = IdSelector;