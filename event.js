if(typeof CELL === 'undefined')
  var CELL = {};

/**
 * Emitter Object
 *
 * provides emitter which is can be used as a base functional class
 * to add event emission and handler registration to any object.
 * 
 * In functional inheritance, make and object an emitter this way:
 * 
 *  var that = CELL.emitter({});
 *
 * emitters can then be used as follow:
 * 
 *    var obj = ... ;
 *    obj.on('login', function(session) {...});    
 *    obj.emit('login', session, user);
 * 
 * @extends {}
 * 
 * @param spec {}
 */
CELL.emitter = function(spec, my) {
  my = my || {};
  var _super = {};
  
  my.handlers = {};
  
  // public
  var on;   /* on(type, handler) */
  var emit; /* emit(type, handler) */
  var off;  /* off(type, handler) */
  
  var that = {};
  
  /**
   * adds handler to handle event of type 'type'
   * @param type {String}      the event type
   * @param handler {Function} the handler
   */
  on = function(type, handler) {
    if(typeof handler === 'function') {
      my.handlers[type] = my.handlers[type] || [];
      my.handlers[type].push(handler);
    }
    else {
      throw new Error('emitter: not a function');
    }
  };
  
  /**
   * emit an event of type 'type'
   * @param type {String} the event type
   * @param ...            parameters to pass the handler	 
   */
  emit = function() {
    var args = Array.prototype.slice.call(arguments);
    var name = args.shift();
    
    if(my.handlers[name]) {
      for(var i = 0; i < my.handlers[name].length; i++) {
        if(my.handlers[name][i])
          my.handlers[name][i].apply(this, args);
      }
    }
  };
	
  /**
   * removes handler for event 'type'
   * @param type {String}      the event type
   * @param handler {Function} the handler
   */
  off = function(type, handler) {
    for(var i = my.handlers[type].length - 1; i >= 0; i--) {
      if(handler === my.handlers[type][i]) 
        my.handlers[type].splice(i, 1);        
    }    
  };


  method(that, 'on', on, _super);
  method(that, 'emit', emit, _super);
  method(that, 'off', off, _super);
  
  getter(that, 'handlers', my, 'handlers');
  
  return that;
};
