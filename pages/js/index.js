// highlight.js
// START CUSTOM REVEAL.JS INTEGRATION
(function() {
	if( typeof window.addEventListener === 'function' ) {
		var hljs_nodes = document.querySelectorAll( 'pre code' );

		for( var i = 0, len = hljs_nodes.length; i < len; i++ ) {
			var element = hljs_nodes[i];

			// trim whitespace if data-trim attribute is present
			if( element.hasAttribute( 'data-trim' ) && typeof element.innerHTML.trim === 'function' ) {
				element.innerHTML = element.innerHTML.trim();
			}

			// Now escape html unless prevented by author
			if( ! element.hasAttribute( 'data-noescape' )) {
				element.innerHTML = element.innerHTML.replace(/</g,"&lt;").replace(/>/g,"&gt;");
			}

			// re-highlight when focus is lost (for edited code)
			element.addEventListener( 'focusout', function( event ) {
				hljs.highlightBlock( event.currentTarget );
			}, false );
		}
	}
})();
// END CUSTOM REVEAL.JS INTEGRATION

(function() {
  
  hljs.configure({tabReplace: '  '});
  hljs.initHighlightingOnLoad();
  
  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    dependencies: [{
      src: "../vendor/reveal/plugin/markdown/marked.js",
      condition: function() {
        return !!document.querySelector("[data-markdown]");
      }
    }, {
      src: "../vendor/reveal/plugin/markdown/markdown.js",
      condition: function() {
        return !!document.querySelector("[data-markdown]");
      }
    }]
  });
  
  var magicCursor = new MagicCursor("evernote", {
    fullScreen: true
  });
  
  var handler = function(e) {
    var classes = e.currentSlide.className.split(" ");
    if (classes.indexOf("no-cursor-effect") >= 0) {
      magicCursor.unwatch();
    } else {
      magicCursor.watch();
    }
  }
  
  Reveal.addEventListener("ready", handler);
  Reveal.addEventListener("slidechanged", handler);
  
})();

