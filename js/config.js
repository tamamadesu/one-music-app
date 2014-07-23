var gui = require('nw.gui');
win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
    nativeMenuBar.createMacBuiltin("My App");
    win.menu = nativeMenuBar;
} catch (ex) {
    console.log(ex.message);
}


// var gui = require('nw.gui');
// var option = {
//   key : "Ctrl+Shift+A",
//   active : function() {
//     console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
//   },
//   failed : function(msg) {
//     console.log(msg);
//   }
// };
// var shortcut = new gui.Shortcut(option);
// gui.App.registerGlobalHotKey(shortcut);

