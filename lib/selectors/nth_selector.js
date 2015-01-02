var inherits = require("util").inherits;
var Selector = require("./selectors/selector.js");

inherits(NthSelector, Selector);
function NthSelector(value){
	Selector.call(this, Selector.TYPE_NTH, value);
}

NthSelector.prototype.toString = function(){
	return ":nth-child("+ this.value +")";
};

module.exports = NthSelector;