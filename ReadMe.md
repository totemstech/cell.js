### Simple Hierarchical Rendering Web Framework

`cell.js` provides a light web framework to help keep javascript UI code structured and modular. The framework has a few basic functions to provide functional inheritance (as defined in the Crockford) [base.js] and a base `emitter` class [events.js] to add to objects the ability to bind and emit events. The framework is based on a very simple class called `cell` which helps developpers structure their UI in a hierarchical manner that helps modularity and reusability. 

The concept of cells is largely inspired by the work introduced by Google in its GWT framework [http://google-web-toolkit.googlecode.com/svn/javadoc/2.1/com/google/gwt/cell/client/Cell.html]

Below are the basic forms of a `container` and a `cell` that can be used as skeleton structures when using `cell.js`

#### Cell Base

```javascript
/************************************/
/* BASIC CELL                       */
/************************************/

var basic_c = function(spec, my) {
  var _super = {};
  var my = my || {};
  
  // public
  var build;    /* build(); */
  var refresh;  /* refresh(); */
  
  // private
  
  var that = CELL.cell(spec, my);
  
  /**
   * builds the cell static content
   */
  build = function() {
    // ...
  };

  /**
   * refreshes the cell content with received data
   * @expected { ... }
   */
  refresh = function(json) {
    // ...
    _super.refresh(json);
  };
  
  
  CELL.method(that, 'build', build, _super);
  CELL.method(that, 'refresh', refresh, _super);

  return that;
};
```

#### Container Base

```javascript
/************************************/
/* BASIC CONTAINER                  */
/************************************/
/**
 * @param sepc {}
 */
var basic_t = function(spec, my) {
  var _super = {};
  var my = my || {};

  // public
  var load;     /* load(); */
  var refresh;  /* refresh(); */

  // private

  var that = CELL.container({ name: 'basic' }, my);

  /**
   * loads children cells within the DOM
   */
  load = function() {
    var elem = $('#some_id');

    // Construction
    my.children['basic'] = basic_c({ path: my.path + '/basic', container: that });
    elem.append(my.children['menu'].build());

    // Handlers
    my.children['basic'].on('some_event', function() {
      // ...
    });

    // Start Updates
  };   

  /**
   * refreshes the UI with new version of data
   */
  refresh = function() {
    // ...
    _super.refresh();
  };

  
  CELL.method(that, 'load', load, _super);
  CELL.method(that, 'refresh', refresh, _super);
    
  return that;
};
```