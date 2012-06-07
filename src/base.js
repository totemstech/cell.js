// Copyright Teleportd Labs
//
// Authors:
// Anthony Moi
// Stanislas Polu
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

if(typeof CELL === 'undefined')
  var CELL = {};

/**
 * base.js
 *
 * Exposes the 4 functions used for functional inheritance
 * Functional inheritance does not rely on JS prototype and
 * focus more on JS objects extensible nature while providing 
 * protection and inheritance
 *
 * A typical object structure is as follow:
 * 
 *     var camera = function(spec, my) {
 *       var _super = {};
 *       var my = my || {};
 *  
 *       my.memory = {};
 *       my.MODEL = 'generic' || spec.model;
 *   
 *       // public
 *       var take;
 *   
 *       // private
 *       var store;
 *
 *       var that = CELL.emitter({});
 * 
 *       take = function() {
 *          // ...
 *          store(img);
 *       };
 *       
 *       store = function(img) {
 *         // ...
 *       } 
 *
 *       CELL.method(that, 'take', take, _super);
 *       CELL.getter(that, 'model', my, 'MODEL');
 * 
 *       return that;
 *     };
 * 
 * A object that inherits camera would look like this:
 *
 *     var polaroid = function(spec, my) {
 *       var _super = {};
 *       var my = my || {};
 *  
 *       my.MODEL = 'generic';
 *   
 *       // public
 *       var take;
 *   
 *       var that = CELL.emitter({ model: 'polaroid' }, my);
 * 
 *       take = function() {
 *          // ...
 *          _super.take();
 *       };
 *   
 *       CELL.method(that, 'take', take, _super);
 * 
 *       return that;
 *     };
 * 
 *
 * For more information on that model please have a look to
 * 'Javascript: The good parts' by Douglas Crockford
 */


/**
 * method(that, name, method, _super)
 * Adds a method to the current object denoted by that and preserves
 * _super implementation (see Crockford)
 */
CELL.method = function(that, name, method, _super) {
  if(_super) {
    var m = that[name];
    _super[name] = function() {
      if(typeof m !== 'function') 
        throw new Error('_super.' + name + '() is not a function');
      return m.apply(that, arguments);
    };
  }
  that[name] = method;
};

/**
 * getter(that, name, obj, prop)
 * Generates a getter on the current object denoted by that
 */
CELL.getter = function(that, name, obj, prop) {
  var getter = function() {
    return obj[prop];
  };
  that[name] = getter;
};

/**
 * setter(that, name, obj, prop)
 * Generates a setter on the current object denoted by that
 */
CELL.setter = function(that, name, obj, prop) {
  var setter = function (arg) {
    obj[prop] = arg;
    return that;
  };
  that['set' + name.substring(0, 1).toUpperCase() + name.substring(1)] = setter;
};

/**
 * responds(that, name)
 * Tests whether the object responds to a given function name
 */
CELL.responds = function(that, name) {
  return (that[name] && typeof that[name] === 'function');
};

/**
 * log(data)
 * Wrapper around console.log for compatiblity
 */ 
CELL.log = function() {
  if(console && 
     typeof console.log === 'function')
    return console.log.apply(console, arguments);
};

/** 
 * remove(e)
 * Removes the element e from the Array, using the JS '===' equality
 */
CELL.remove = function(that, e) {
  "use strict";
  
  if(that === void 0 || that === null || !Array.isArray(that))
    throw new TypeError();
  
  for(var i = that.length - 1; i >= 0; i--)
    if(e === that[i]) that.splice(i, 1);        
};

/**
 * unique()
 * Returns a new array by removing duplicate elements
 * using the JS '===' equality
 */
CELL.unique = function(that) {
  "use strict";
  
  if(that === void 0 || that === null || !Array.isArray(that))
    throw new TypeError();
  
  var a = that.concat();
  for(var i = 0; i < a.length; i++) {
    for(var j = i+1; j < a.length; j++) {
      if(a[i] === a[j]) {
        a.splice(j, 1);
        j--;
      }
    }
  }
  return a;
};

/**
 * Implementation of indexOf()
 * indexOf() is not available on all browsers
 * such as Internet Explorer
 * See https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {  
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {  
    "use strict";  
    if (this == null) {  
      throw new TypeError();  
    }  
    var t = Object(this);  
    var len = t.length >>> 0;  
    if (len === 0) {  
      return -1;  
    }  
    var n = 0;  
    if (arguments.length > 0) {  
      n = Number(arguments[1]);  
      if (n != n) { // shortcut for verifying if it's NaN  
        n = 0;  
      } else if (n != 0 && n != Infinity && n != -Infinity) {  
        n = (n > 0 || -1) * Math.floor(Math.abs(n));  
      }  
    }  
    if (n >= len) {  
      return -1;  
    }  
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
    for (; k < len; k++) {  
      if (k in t && t[k] === searchElement) {  
        return k;  
      }  
    }  
    return -1;  
  }  
}

CELL.DEBUG = false;

CELL.debug = function() {
  if(CELL.DEBUG && console &&
     typeof console.log === 'function')
    return console.log.apply(console, arguments);
};