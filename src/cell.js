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
 * @param spec {path, container}
 */
CELL.cell = function(spec, my) {
  var _super = {};
  my = my || {};

  my.path = spec.path || '/';      /* the current cell path */
  my.container = spec.container;   /* the top level container */

  my.children = my.children || {}; /* cell children, created at build time */
  my.json = my.json || {};         /* cell json, always up to date */

  my.element = null;               /* stores the HTML element handled by this cell */

  // public
  var build;     /* build();       */
  var refresh;   /* refresh(json); */
  var find;      /* find(path);    */

  // private
  var bind;      /* bind();        */


  var that = CELL.emitter({});


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

    my.children['foo'] = foo_c({path: my.path + '/foo', container: my.container});
    my.element.append(my.children['foo'].build());

    return my.element;
  };


  /**
   * /!\ `bind` *must* be called each time a children is added to enable
   * the `update` event bubbling. It is automatically called in the cell 
   * refresh method.
   */
  bind = function() {
    my.hdlr = my.hdlr || 
      function() {
        var args = Array.prototype.slice.call(arguments);
        that['emit'].apply(this, args);
      };

    for(var c in my.children) {
      if(my.children.hasOwnProperty(c)) {
        my.children[c].off('*', my.hdlr);
        my.children[c].on('*', my.hdlr);
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
      if(my.children.hasOwnProperty(c) && 
         typeof my.json[c] !== 'undefined')
        my.children[c].refresh(my.json[c]);
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
    path = path.replace(/^\/+/, '');
    var comps = path.split('/');    
    var next = comps.shift();

    if(next.length > 0)
      return my.children[next].find(comps.join('/'));
    else
      return that;
  };


  CELL.method(that, 'build', build, _super);
  CELL.method(that, 'refresh', refresh, _super);
  CELL.method(that, 'find', find, _super);

  CELL.getter(that, 'children', my, 'children');
  CELL.getter(that, 'element', my, 'element');
  CELL.getter(that, 'path', my, 'path');
  CELL.getter(that, 'json', my, 'json');

  return that;

};
