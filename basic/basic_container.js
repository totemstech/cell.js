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
