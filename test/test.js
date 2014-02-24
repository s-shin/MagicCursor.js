
module("MagicCursor");

test("create and destroy", function() {
  var mc = new MagicCursor().watch();
  equal($("canvas").length, 1);
  mc.destroy();
  equal($("canvas").length, 0);
});

test("watch and unwatch", function() {
  var mc = new MagicCursor();
  ok(!mc.isWatching_);
  mc.watch();
  ok(mc.isWatching_);
  mc.unwatch();
  ok(!mc.isWatching_);
  mc.destroy();
});

test("custom options", function() {
  ["default", "line", "bezierline", "evernote"].forEach(function(optsName) {
    var mc = new MagicCursor(optsName);
    ok(mc);
    mc.destroy();
  });
  throws(function() {
    new MagicCursor("dummy");
  });
});

module("MagicCursor.Options");
var Options = MagicCursor.Options

test("extend", function() {
  ok(Options.extend("skeleton"));
  ok(Options.extend("default"));
  deepEqual(Options.extend("default"), Options.get("default"));
});

test("add and remove", function() {
  Options.add("test", Options.extend("default", {fps: 0}));
  equal(Options.get("test").fps, 0);
  Options.remove("test");
  equal(Options.get("test"), null);
});

