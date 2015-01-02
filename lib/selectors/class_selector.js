var inherits = require("util").inherits;
var Selector = require("./selectors/selector.js");

inherits(ClassSelector, Selector);
function ClassSelector(value){
	Selector.call(this, Selector.TYPE_CLASS, value);
}

ClassSelector.prototype.toString = function(){
	return this.value;
};

module.exports = ClassSelector;