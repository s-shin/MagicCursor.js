(function() {
  opts = {
    easing: EasingFunctions["linear"],
    fillColor: [100, 100, 255],
    fps: 15
  }
  
  var magicCursor = null;
  function resetCursor() {
    if (magicCursor) {
      magicCursor.destroy();
      magicCursor = null;
    }
    magicCursor = new MagicCursor(opts).watch();
  }
  resetCursor();
  
  var elEasing = document.querySelector("select.easing");
  elEasing.addEventListener("change", function(e) {
    opts.easing = EasingFunctions[elEasing.value];
    resetCursor();
  });

  var elColor = document.querySelector("select.color");
  elColor.addEventListener("change", function(e) {
    opts.fillColor = {
      red: [255, 100, 100],
      green: [100, 255, 100],
      blue: [100, 100, 255]
    }[elColor.value];
    resetCursor();
  });

  var elFps = document.querySelector("select.fps");
  elFps.addEventListener("change", function(e) {
    opts.fps = +elFps.value
    resetCursor();
  });
  
})();
