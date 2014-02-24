// Generated by CoffeeScript 1.7.1

/*
MagicCursor.js v1.0.0
(C) 2014 Shintaro Seki <s2pch.luck@gmail.com>
The MIT License
 */

(function() {
  var Animator, CursorPoint, MagicCursor, Options, OptionsManager, UA, Vector2,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  UA = {
    ie: (function() {
      var ael, ie;
      ie = false;
      ael = window.addEventListener != null;
      if (ael && (document.documentElement.style.maxHeight == null)) {
        ie = 6;
      }
      if (!ie && ael && (document.querySelectorAll == null)) {
        ie = 7;
      }
      if (!ie && ael && (document.getElementsByClassName == null)) {
        ie = 8;
      }
      if (!ie && document.uniqueID && !window.matchMedia) {
        ie = 9;
      }
      if (!ie && document.uniqueID) {
        ie = document.documentMode;
      }
      return ie;
    })(),
    firefox: "MozAppearance" in document.documentElement.style,
    opera: window.opera != null,
    chrome: window.chrome != null,
    safari: (window.chrome == null) && "WebkitAppearance" in document.documentElement.style,
    mobile: window.orientation != null
  };

  Animator = (function() {
    var getTime, now, requestAnimationFrame;

    requestAnimationFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {
        return window.setTimeout(cb, 1000.0 / 60.0);
      };
    })();

    now = window.performance && performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow;

    getTime = function() {
      return (now != null ? now.call(performance) : void 0) || (typeof Date.now === "function" ? Date.now() : void 0) || new Date().getTime();
    };

    function Animator(fps, fn) {
      this.fps = fps;
      this.fn = fn;
      this.isRunning = false;
    }

    Animator.prototype.run = function() {
      var frameCount, frameTime, loopFn, startTime;
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      frameTime = 1000.0 / this.fps;
      startTime = getTime();
      frameCount = 0;
      (loopFn = (function(_this) {
        return function() {
          var currentFrameCount;
          if (_this.isRunning) {
            requestAnimationFrame(loopFn);
          }
          currentFrameCount = Math.floor((getTime() - startTime) / frameTime);
          if (currentFrameCount > frameCount) {
            frameCount = currentFrameCount;
            return _this.fn(frameCount);
          }
        };
      })(this))();
      return this;
    };

    Animator.prototype.stop = function() {
      this.isRunning = false;
      return this;
    };

    return Animator;

  })();

  Vector2 = (function() {
    Vector2.fromArray = function(a) {
      return new Vector2(a[0], a[1]);
    };

    function Vector2(x, y) {
      this.set(x, y);
    }

    Vector2.prototype.set = function(x, y) {
      this[0] = x;
      this[1] = y;
      this.x = x;
      this.y = y;
      return this;
    };

    Vector2.prototype.clone = function() {
      return new Vector2(this.x, this.y);
    };

    Vector2.prototype.add = function(v) {
      return this.clone().iadd(v);
    };

    Vector2.prototype.iadd = function(v) {
      return this.set(this.x + v.x, this.y + v.y);
    };

    Vector2.prototype.sub = function(v) {
      return this.clone().isub(v);
    };

    Vector2.prototype.isub = function(v) {
      return this.set(this.x - v.x, this.y - v.y);
    };

    Vector2.prototype.muls = function(s) {
      return this.clone().imuls(s);
    };

    Vector2.prototype.imuls = function(s) {
      return this.set(this.x * s, this.y * s);
    };

    Vector2.prototype.len = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector2.prototype.norm = function() {
      return this.clone().inorm();
    };

    Vector2.prototype.inorm = function() {
      var len;
      len = this.len();
      this.set(this.x / len, this.y / len);
      return this;
    };

    Vector2.prototype.normal = function() {
      return this.clone().inormal();
    };

    Vector2.prototype.inormal = function() {
      return this.set(this.y, -this.x).inorm();
    };

    return Vector2;

  })();

  Options = new (OptionsManager = (function() {
    var skeleton;

    skeleton = {
      target: document.body,
      fullScreen: false,
      zIndex: 5000,
      fps: 30,
      duration: 1,
      easing: function(x, t, b, c, d) {
        return x;
      },
      draw: function(ctx, points, head, tail) {
        return console.log("override me");
      }
    };

    function OptionsManager() {
      this.opts_ = {
        skeleton: skeleton
      };
    }

    OptionsManager.prototype.extend = function(name, opts) {
      var k, v, _ref;
      if (opts == null) {
        opts = {};
      }
      if (!(name in this.opts_)) {
        throw "Custom option '" + name + "' doesn't exist.";
      }
      _ref = this.opts_[name];
      for (k in _ref) {
        v = _ref[k];
        if (opts[k] == null) {
          opts[k] = v;
        }
      }
      return opts;
    };

    OptionsManager.prototype.add = function(name, opts) {
      this.opts_[name] = this.extend("skeleton", opts);
      return this;
    };

    OptionsManager.prototype.remove = function(name) {
      return delete this.opts_[name];
    };

    OptionsManager.prototype.get = function(name, opts) {
      return this.opts_[name];
    };

    return OptionsManager;

  })());

  Options.add("default", {
    fillColor: [100, 100, 255],
    lineColor: [255, 255, 255],
    radius: 7,
    lineWidth: 2.5,
    draw: function(ctx, points, head, tail) {
      var drawRadius, p, t, _i, _len;
      drawRadius = function(p, radius, lineWidth, frgba, srgba) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "rgba(" + (srgba.join(',')) + ")";
        ctx.fillStyle = "rgba(" + (frgba.join(',')) + ")";
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        return ctx.stroke();
      };
      for (_i = 0, _len = tail.length; _i < _len; _i++) {
        p = tail[_i];
        t = 1 - p.param;
        if (t < 0) {
          t = 0;
        }
        drawRadius(p, this.radius * t, this.lineWidth * t, this.fillColor.concat([t]), this.lineColor.concat([t]));
      }
      if (head) {
        return drawRadius(head, this.radius, this.lineWidth, this.fillColor.concat([1]), this.lineColor.concat([1]));
      }
    }
  });

  CursorPoint = (function(_super) {
    __extends(CursorPoint, _super);

    function CursorPoint(opts, x, y) {
      this.opts = opts;
      CursorPoint.__super__.constructor.call(this, x, y);
      this.life = this.opts.initialLife;
      this.progress = 0;
      this.param = opts.easing(this.progress, this.opts.duration * this.progress, 0, 1, this.opts.duration);
    }

    CursorPoint.prototype.isDead = function() {
      return this.life <= 0;
    };

    CursorPoint.prototype.decrementLife = function() {
      this.life--;
      this.progress = 1 - this.life / this.opts.initialLife;
      return this.param = this.opts.easing(this.progress, this.opts.duration * this.progress, 0, 1, this.opts.duration);
    };

    return CursorPoint;

  })(Vector2);

  MagicCursor = (function() {
    var isString;

    isString = function(obj) {
      return toString.call(obj) === "[object String]";
    };

    function MagicCursor(name, opts) {
      var animator, canvas, currentPoint, isCurrentPointUpdated, isMouseDown, isMouseMove, points, target;
      if (opts == null) {
        opts = {};
      }
      if (name == null) {
        name = "default";
      } else if (!isString(name)) {
        opts = name;
        name = "default";
      }
      opts = Options.extend(name, opts);
      opts.initialLife = opts.fps * opts.duration;
      target = opts.target;
      if (target.style.position === "" || target.style.position === "static") {
        target.style.position = "relative";
      }
      canvas = document.createElement("canvas");
      canvas.width = target.clientWidth;
      canvas.height = target.clientHeight;
      canvas.style.position = "absolute";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.cursor = "none";
      canvas.style.zIndex = opts.zIndex;
      canvas.style.display = "none";
      target.appendChild(canvas);
      currentPoint = null;
      isCurrentPointUpdated = false;
      isMouseDown = false;
      isMouseMove = false;
      this.events_ = [
        {
          target: target,
          name: "mousemove",
          fn: (function(_this) {
            return function(e) {
              var x, y;
              e.stopPropagation();
              isMouseMove = true;
              if (isMouseDown) {
                return;
              }
              if (opts.fullScreen) {
                if (e.clientX != null) {
                  x = e.clientX;
                  y = e.clientY;
                } else {
                  x = window.event.clientX;
                  y = window.event.clientY;
                }
              } else {
                if (e.offsetX != null) {
                  x = e.offsetX;
                  y = e.offsetY;
                } else {
                  x = e.layerX;
                  y = e.layerY;
                }
              }
              if ((function(cp) {
                return cp && cp.x === x && cp.y === y;
              })(currentPoint)) {
                return;
              }
              currentPoint = new CursorPoint(opts, x, y);
              isCurrentPointUpdated = true;
              canvas.style.display = "block";
              return _this.animator.run();
            };
          })(this)
        }, {
          target: target,
          name: "mouseenter",
          fn: (function(_this) {
            return function(e) {
              var idx, _results;
              if (isMouseDown) {
                return;
              }
              _results = [];
              while ((idx = points.indexOf("dummy")) !== -1) {
                _results.push(points.splice(idx, 1));
              }
              return _results;
            };
          })(this)
        }, {
          target: target,
          name: "mouseleave",
          fn: (function(_this) {
            return function(e) {
              isMouseMove = false;
              if (isMouseDown) {
                return;
              }
              currentPoint = "dummy";
              return isCurrentPointUpdated = true;
            };
          })(this)
        }, {
          target: window,
          name: "mousedown",
          fn: (function(_this) {
            return function(e) {
              isMouseDown = true;
              return canvas.style.display = "none";
            };
          })(this)
        }, {
          target: window,
          name: "mouseup",
          fn: (function(_this) {
            return function(e) {
              return isMouseDown = false;
            };
          })(this)
        }, {
          target: window,
          name: UA.firefox ? "DOMMouseScroll" : "mousewheel",
          fn: (function(_this) {
            return function(e) {
              return canvas.style.display = "none";
            };
          })(this)
        }
      ];
      points = [];
      animator = new Animator(opts.fps, (function(_this) {
        return function(frameCount) {
          var ctx, head, i, tail, _i, _ref;
          if (canvas.width !== target.clientWidth || canvas.height !== target.clientHeight) {
            canvas.width = target.clientWidth;
            canvas.height = target.clientHeight;
          }
          if (isCurrentPointUpdated) {
            points.push(currentPoint);
            isCurrentPointUpdated = false;
          }
          while (points.length > 0 && (points[0] === "dummy" || points[0].isDead())) {
            points.shift();
          }
          if (points.length === 0) {
            canvas.style.display = "none";
            animator.stop();
            return;
          }
          ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (points.length > 0) {
            tail = points.concat();
            head = tail.pop();
            if (head === "dummy") {
              opts.draw(ctx, tail, null, tail);
            } else {
              opts.draw(ctx, points, head, tail);
            }
          }
          if (points.length > 1) {
            for (i = _i = 0, _ref = points.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              points[i].decrementLife();
            }
          }
          return null;
        };
      })(this));
      this.opts = opts;
      this.canvas = canvas;
      this.animator = animator;
      this.isWatching_ = false;
    }

    MagicCursor.prototype.watch = function() {
      var event, _i, _len, _ref;
      if (this.isWatching_) {
        return;
      }
      this.isWatching_ = true;
      _ref = this.events_;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        event.target.addEventListener(event.name, event.fn);
      }
      return this;
    };

    MagicCursor.prototype.unwatch = function() {
      var event, _i, _len, _ref;
      if (!this.isWatching_) {
        return;
      }
      this.isWatching_ = false;
      _ref = this.events_;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        event.target.removeEventListener(event.name, event.fn);
      }
      this.animator.stop();
      this.canvas.style.display = "none";
      return this;
    };

    MagicCursor.prototype.destroy = function() {
      this.unwatch();
      return this.opts.target.removeChild(this.canvas);
    };

    return MagicCursor;

  })();

  MagicCursor.UA = UA;

  MagicCursor.Vector2 = Vector2;

  MagicCursor.Options = Options;

  window.MagicCursor = MagicCursor;

}).call(this);