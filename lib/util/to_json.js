function toJSON(){
	var tag = this.tagName.toLowerCase(),
			attributes = this.attributes,
			attributesChunk = [];

	for(var i = 0; i < attributes.length; i++){
		var attr = attributes[i];
		attributesChunk[i] = attr.name + "=" + '"'+ attr.value +'"';
	}

	return '<'+ tag +' '+ attributesChunk.join(" ") +'></'+ tag +'>';
}

toJSON.install = function(element){
	if(!element.prototype.toJSON){
		element.prototype.toJSON = toJSON;
	}else{
		throw new Error("toJSON allready installed on given target");
	}
};

toJSON.uninstall = function(element){
	if(element.prototype.toJSON){
		delete element.prototype.toJSON;
	}else{
		throw new Error("toJSON is not installed on given target");
	}
};

module.exports = toJSON;