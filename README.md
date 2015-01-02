to-selector (Experimental)
===========

DOMElement to css path converter

### `target.toSelector()`
Consumes css path from target DOMElement
### `toSelector.install(target, document, debugMode)`
Injects the 'toSelector' method to target object.
### `toSelector.uninstall(target)`
Removes the 'toSelector' method from target object.

Example:
```javascript
var jsdom = require("jsdom").jsdom;
var toSelector = require("to-selector");

// in this example we are using the 'jsdom' library to access the dom 
// 'toSelector' will work everywhere that has window, window.document
var doc = jsdom("<html><head></head><body></body></html>"),
		window = doc.parentWindow,
		document = window.document;

// lets inject the 'toSelector' method to 'HTMLElement' so we can access from every dom element
toSelector.install(window.HTMLElement, window.document, false);

// lets fill our body with element so we can get little bit more complex css paths
window.document.body.appendChild(window.document.createElement("div"));

// create a element
var fancyDiv = window.document.createElement("div");
fancyDiv.id = "fancy-div";

// element must be children of document.body
window.document.body.appendChild(fancyDiv);

var cssPath = fancyDiv.toSelector();
console.log(cssPath);
```
```
$ node example.js
div#fancy-div
```
