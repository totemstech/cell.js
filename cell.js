if(typeof CELL === 'undefined')
  var CELL = {};

/**
 * Cell object
 * 
 * A `cell` is an object in charge of building and refreshing a precise 
 * UI part. Cells are hierarchical: it means that building and refreshing
 * is done recursively
 * 
 * This pattern was introduced by Google here:
 * http://google-web-toolkit.googlecode.com/svn/javadoc/2.1/com/google/gwt/cell/client/Cell.html
 * 
 * Each cell has a specific path and refers to a JSON data object whose
 * structure is "close" (if not similar) to the cell hierarchy. A specific
 * cell can be recusively found from the top cell thanks to its path. Finally
 * cells bubble up the 'update' event whenever it is fired (generally due to
 * a UI interaction) 
 * 
 * Cells help the creation modular and reusable code even in complex inter dependent
 * environments. Each cell is in charge of a specific UI part. UI handlers should
 * be implemented within the cell. Cells are globally adressable thanks to their path.
 * Building and refreshing can be contextual to the json data or the path of the cell
 * allowing the reuse of specific cells in different contexts.
 *
 * The JSON passed to the top cell should have an adequate hierarchy. Each cell reference
 * the JSON part it is in charge of. When the JSON is updated in a children cell, every cell
 * have access to the updated JSON thanks to JS object model.
 *
 * @extends CELL.emitter
 *
 * @emits 'update'
 *
 * @param spec {path}
 */
CELL.cell = function(spec, my) {
  var _super = {};
  var my = my || {};

  my.element = null;               /* stores the HTML element handled by this cell */
  my.path = spec.path || '/';      /* the current cell path */
  my.children = {};                /* cell children, created at build time */
  my.json = {};                    /* cell json, always up to date */


  // public
  var build;     /* build();       */
  var refresh;   /* refresh(json); */
  var find;      /* find(path);    */

  // private
  var bind;      /* bind();        */


  var that = emitter({});


  /**
   * RECURSIVE FUNCTION
   * `build` construct and initialize the HTML my.element and recursively calls
   * `build` on the cell children to append the generated elements. 
   * `build` is called at page construction to generate "static" UI elements
   * that will be later refreshed. `build` can also be called at refresh
   * time to construct "dynamic" elements (as an example search results)
   */
  build = function() {
    throw new Error('`build` must be implemented : ' + my.path);    
    /**
     * for documentation only
     */       
    my.element = $('<div></div>');

    my.children['foo'] = foocell({path: my.path + '/foo'});
    my.element.append(my.children['foo'].build());

    return my.element;
  };


  /**
   * /!\ `bind` *must* be called each time a children is added to enable
   * the `update` event bubbling. It is automatically called in the cell 
   * refresh method.
   */
  bind = function() {
    my.hdlr = my.hdl || 
      function(path) {
        that.emit('update', path);
      };

    for(var c in my.children) {
      if(my.children.hasOwnProperty(c)) {
        my.children[c].off('update', my.hdlr);
        my.children[c].on('update', my.hdlr);
      }
    }
  };


  /**
   * RECURSIVE FUNCTION
   * Recursively refreshes the elements children. refresh should be implemented
   * and `_super.refresh()` called when suited. The refresh function must be in
   * charge of updating the UI with the updated json data passed recursively.
   * @param data the update data to use to refresh the UI
   */
  refresh = function(json) {
    my.json = json;

    for(var c in my.children) {
      if(my.children.hasOwnProperty(c))
        my.children[c].refresh(json[c]);
    }
    bind();
  };


  /**
   * RECURSIVE FUNCTION
   * Recursively finds a cell by its path. useful to call a method exposed
   * by a cell directly from outside the cell hierarchy
   * @param path the path to the cell
   * @return the cell under 'path'
   */
  find = function(path) {
    var comps = path.split('/');
    
    if(comps.length === 0)
      return that;
    else {
      var next = comps.shift();
      return my.children[next].find(comps.join('/'));
    }
  };


  method(that, 'init', init, _super);
  method(that, 'render', render, _super);
  method(that, 'find', find, _super);

  getter(that, 'children', my, 'children');
  getter(that, 'element', my, 'element');
  getter(that, 'path', my, 'path');
  getter(that, 'json', my, 'json');

  return that;

};