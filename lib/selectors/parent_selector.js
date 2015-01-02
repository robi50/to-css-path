var inherits = require("util").inherits;
var CssPath = require("../css_path.js");

inherits(ParentSelector, CssPath);
function ParentSelector(documentHolder, path){
	CssPath.call(this, documentHolder, path);
}

module.exports = ParentSelector;