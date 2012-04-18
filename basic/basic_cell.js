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



  