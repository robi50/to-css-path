to-css-path (Experimental)
===========

DOMElement to css path converter

Almost every time it will give you a valid and unique css path of target DOMElement. But it will be not speed optimized, cross browser nor small.

### `target.toCssPath()`
Consumes css path from target DOMElement
### `toCssPath.install(target, document)`
Injects the 'toCssPath' method to target object.
### `toCssPath.uninstall(target)`
Removes the 'toCssPath' method from target object.

Example:
```javascript
var jsdom = require("jsdom").jsdom;
var toCssPath = require("to-css-path");

// in this example we are using the 'jsdom' library to access the dom 
// 'toCssPath' will work everywhere that has window, window.document
var doc = jsdom("<html><head></head><body></body></html>"),
		window = doc.parentWindow,
		document = window.document;

// lets inject the 'toCssPath' method to 'HTMLElement' so we can access from every dom element
toCssPath.install(window.HTMLElement, window.document, false);

// lets fill our body with element so we can get little bit more complex css paths
window.document.body.appendChild(window.document.createElement("div"));

// create a element
var fancyDiv = window.document.createElement("div");
fancyDiv.id = "fancy-div";

// element must be children of document.body
window.document.body.appendChild(fancyDiv);

var cssPath = fancyDiv.toCssPath();
console.log(cssPath);
```
```
$ node example.js
div#fancy-div
```
