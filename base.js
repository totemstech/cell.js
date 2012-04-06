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
