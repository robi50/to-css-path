#!/usr/bin/env mocha
var jsdom = require("jsdom").jsdom;
var fs = require("fs");
var assert = require("assert");

var toCssPath = require("../../lib/to_css_path.js");
var toJSON = require("../../lib/util/to_json.js");

// PS: Always compress the env files. It helps to save huge time
var htmlEnvId = process.env.HTML_ENV_ID ? process.env.HTML_ENV_ID : "1",
		htmlEnvFilePath = __dirname + "/html_env/env_"+ htmlEnvId +".html";

if(!fs.existsSync(htmlEnvFilePath)){
	throw new Error("Enviroment file '"+ htmlEnvFilePath +"' not found");
}

var doc = jsdom(fs.readFileSync(htmlEnvFilePath)),
		window = doc.parentWindow,
		document = window.document;

toCssPath.install(window.HTMLElement, document, true);
toJSON.install(window.HTMLElement);

describe("toCssPath", function(){
	// stress tests could take to much time
	this.timeout(10000000);

	it("should give a valid/right css path on given elements", function(){
		var elements = document.body.getElementsByTagName("*"),
				assertCount = 0,
				passCount = 0;

		for(var i = 0; i < elements.length; i++){
			var el = elements[i];

			var path = el.toCssPath();
			if(path){
				assert.deepEqual(document.querySelector(path), el);
				assertCount++;
			}else{
				// console.log(el.toJSON());
				// console.log("");
				// console.log(path);
				// console.log("");	
				passCount++;
			}
		}

		console.log(assertCount, passCount);
	});
});