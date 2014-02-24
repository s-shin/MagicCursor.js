(function() {
  options = {
    "default": {},
    line: {fps: 15},
    bezierline: {fps: 15},
    evernote: {}
  };
  ["default", "line", "bezierline", "evernote"].forEach(function(name) {
    options[name].target = document.querySelector("td." + name);
    new MagicCursor(name, options[name]).watch();
  });
})();
