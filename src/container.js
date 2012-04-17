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
 * Container object
 * 
 * The `container` is the TOP level object which contains a set of children 
 * cells. The container is passed to all the cell within the hierarchy and
 * is therefore referenceable from any cell within one of its hierarchies.
 * The container is in charge of loading a builded hierachy within the DOM
 * in the `load` function. All events emitted by cells are forwarded up to
 * the top-level cells and can be listened by the container. Finally the
 * container is supposed to act as a controller between the views (cell
 * hierarchies) and its data representation. This data representation is
 * built to be compatbile with cell refresh and splitted across cells. When 
 * the data model it handles is updated, refresh should be called on the
 * children cells.
 *
 * @extends CELL.emitter
 *
 * @param spec {name}
 */
CELL.container = function(spec, my) {
  var _super = {};
  var my = my || {};

  my.name = spec.name || '';       /* the container name */

  my.children = my.children || {}; /* container children, created at build time */
  my.json = my.json || {};         /* container json */

  // public
  var find;      /* find(path);    */

  // protected
  var load;      /* load();    */
  var refresh;   /* refresh(); */


  var that = CELL.emitter({});

  /**
   * RECURSIVE FUNCTION
   * Recursively refreshes the children cells. refresh should be implemented
   * and `_super.refresh()` called when suited. `my.json` must be set with the
   * correct compatible architecture before a call to refresh
   */
  refresh = function() {
    for(var c in my.children) {
      if(my.children.hasOwnProperty(c) && 
         typeof my.json[c] !== 'undefined')
        my.children[c].refresh(my.json[c]);
    }
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


  /**
   * Builds the cells hierarchies handled by that container and load
   * them within the DOM.
   */
  load = function() {
    // children class implementation specific
  };



  CELL.method(that, 'load', load, _super);
  CELL.method(that, 'refresh', refresh, _super);
  CELL.method(that, 'find', find, _super);

  CELL.getter(that, 'children', my, 'children');
  CELL.getter(that, 'name', my, 'name');
  CELL.getter(that, 'json', my, 'json');

  return that;
};
