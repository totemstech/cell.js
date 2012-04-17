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
 * The `container` is the TOP level object which contains all
 * the children cells
 *
 * In charge of exchange with server, it builds the JSON data 
 * architecture that will be splited between different cells
 *
 * @extends CELL.emitter
 *
 * @emits 'update'
 *
 * @param spec {path}
 */
CELL.container = function(spec, my) {
  var _super = {};
  var my = my || {};

  my.name = spec.name || '/';      /* the container name */
  my.children = {};                /* cell children, created at build time */

  // public
  var find;      /* find(path);    */

  // private

  var that = CELL.emitter({});

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

  CELL.method(that, 'find', find, _super);

  CELL.getter(that, 'children', my, 'children');
  CELL.getter(that, 'name', my, 'name');

  return that;

};
