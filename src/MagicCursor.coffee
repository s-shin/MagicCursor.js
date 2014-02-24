###
MagicCursor.js v1.0.0
(C) 2014 Shintaro Seki <s2pch.luck@gmail.com>
The MIT License
###

# Utilities
#-----------

# ### UserAgent
# https://gist.github.com/s-shin/9171790
UA =
	ie: do ->
		ie = false
		ael = window.addEventListener?
		ie = 6 if ael and not document.documentElement.style.maxHeight?
		ie = 7 if not ie and ael and not document.querySelectorAll?
		ie = 8 if not ie and ael and not document.getElementsByClassName?
		ie = 9 if not ie and document.uniqueID and not window.matchMedia
		ie = document.documentMode if not ie and document.uniqueID
		ie
	firefox: "MozAppearance" of document.documentElement.style
	opera: window.opera?
	chrome: window.chrome?
	safari: not window.chrome? and \
		"WebkitAppearance" of document.documentElement.style
	mobile: window.orientation?


# ### Animator
# https://gist.github.com/s-shin/9071179
class Animator
	requestAnimationFrame = do ->
		window.requestAnimationFrame or
		window.webkitRequestAnimationFrame or
		window.mozRequestAnimationFrame or
		window.oRequestAnimationFrame or
		window.msRequestAnimationFrame or
		(cb) -> window.setTimeout cb, 1000.0 / 60.0

	now = window.performance and
		performance.now or
		performance.mozNow or
		performance.msNow or
		performance.oNow or
		performance.webkitNow

	getTime = ->
		now?.call(performance) or Date.now?() or new Date().getTime()

	constructor: (@fps, @fn) -> @isRunning = false

	run: ->
		return if @isRunning
		@isRunning = true
		frameTime = 1000.0 / @fps
		startTime = getTime()
		frameCount = 0
		do loopFn = =>
			requestAnimationFrame loopFn if @isRunning
			currentFrameCount = Math.floor((getTime()-startTime) / frameTime)
			if currentFrameCount > frameCount
				frameCount = currentFrameCount
				@fn frameCount
		@
	
	stop: -> @isRunning = false; @


# ### Simple 2D Vector Class
# https://gist.github.com/s-shin/9155724
class Vector2 
	@fromArray: (a) -> new Vector2 a[0], a[1]
	constructor: (x, y) -> @set x, y
	set: (x, y) -> @[0] = x; @[1] = y; @x = x; @y = y; @
	clone: -> new Vector2 @x, @y
	add: (v) -> @clone().iadd v
	iadd: (v) -> @set @x+v.x, @y+v.y
	sub: (v) -> @clone().isub v
	isub: (v) -> @set @x-v.x, @y-v.y
	muls: (s) -> @clone().imuls s
	imuls: (s) -> @set @x*s, @y*s
	len: -> Math.sqrt(@x*@x + @y*@y)
	norm: -> @clone().inorm()
	inorm: -> len = @len(); @set @x / len, @y / len; @
	normal: -> @clone().inormal()
	inormal: -> @set(@y, -@x).inorm()


# Core Modules
#--------------

# ### Options Manager
Options = new class OptionsManager
	
	# Base options
	skeleton = 
		# Target DOM element.
		target: document.body
		# Set true in some full screen applications (ex. reveal.js).
		fullScreen: false
		# CSS z-index of canvas where the cursor is drawed.
		zIndex: 5000
		# FPS of animation.
		fps: 30
		# Duration.
		duration: 1 # [s]
		# jQuery-style easing function.
		# About easing functions: http://www.robertpenner.com/easing/
		easing: (x, t, b, c, d) -> x # linear
		# Draw function in each frame.
		#
		# - ctx: 2d context of canvas.
		# - points: if head is null then [tail...] else [tail..., head]
		# - head: The head point. [null|CursorPoint]
		# - tail: The tail points, [Array]
		draw: (ctx, points, head, tail) -> console.log "override me"
	
	# Member methods
	constructor: -> @opts_ = {skeleton: skeleton}
	extend: (name, opts={}) ->
		throw "Custom option '#{name}' doesn't exist." unless name of @opts_
		opts[k] ?= v for k, v of @opts_[name]; opts
	add: (name, opts) -> @opts_[name] = @extend "skeleton", opts; @
	remove: (name) -> delete @opts_[name]
	get: (name, opts) -> @opts_[name]
	

# ### Default options.
# This is an example of the way users add their own custom options
# on MagicCursor.
Options.add "default",
	# Custum parameters.
	# These params can be referenced like `this.param` in `draw()`.
	fillColor: [100, 100, 255]
	lineColor: [255, 255, 255]
	radius: 7
	lineWidth: 2.5
	# Override draw().
	draw: (ctx, points, head, tail) ->
		drawRadius = (p, radius, lineWidth, frgba, srgba) ->
			ctx.beginPath()
			ctx.lineWidth = lineWidth
			ctx.strokeStyle = "rgba(#{srgba.join(',')})"
			ctx.fillStyle = "rgba(#{frgba.join(',')})"
			ctx.arc p.x, p.y, radius, 0, Math.PI * 2
			ctx.fill()
			ctx.stroke()
		for p in tail
			t = 1 - p.param
			t = 0 if t < 0
			drawRadius p, @radius*t, @lineWidth*t, \
				@fillColor.concat([t]), @lineColor.concat([t])
		if head
			drawRadius head, @radius, @lineWidth, \
				@fillColor.concat([1]), @lineColor.concat([1])


# ### CursorPoint Class
class CursorPoint extends Vector2
	constructor: (@opts, x, y) ->
		super(x, y)
		@life = @opts.initialLife
		@progress = 0
		@param = opts.easing \
			@progress, @opts.duration * @progress, 0, 1, @opts.duration
			
	isDead: -> @life <= 0
	
	decrementLife: ->
		@life--
		@progress = 1 - @life / @opts.initialLife
		@param = @opts.easing \
			@progress, @opts.duration * @progress, 0, 1, @opts.duration


# ### MagicCursor Class
class MagicCursor

	isString = (obj) -> toString.call(obj) == "[object String]"

	constructor: (name, opts={}) ->
		if not name?
			name = "default"
		else if not isString name
			opts = name
			name = "default"
		
		opts = Options.extend name, opts
		opts.initialLife = opts.fps * opts.duration
		
		# target style
		{target} = opts
		if target.style.position == "" or target.style.position == "static"
			target.style.position = "relative"
			
		# canvas style
		canvas = document.createElement "canvas"
		canvas.width = target.clientWidth
		canvas.height = target.clientHeight
		canvas.style.position = "absolute"
		canvas.style.top = "0px"
		canvas.style.left = "0px"
		canvas.style.cursor = "none"
		canvas.style.zIndex = opts.zIndex
		canvas.style.display = "none"
		target.appendChild canvas
		
		# states
		currentPoint = null
		isCurrentPointUpdated = false
		isMouseDown = false
		isMouseMove = false
		
		# events
		@events_ = [
			{
				target: target
				name: "mousemove"
				fn: (e) =>
					e.stopPropagation()
					isMouseMove = true
					return if isMouseDown
					if opts.fullScreen
						if e.clientX?
							x = e.clientX; y = e.clientY;
						else
							x = window.event.clientX; y = window.event.clientY
					else
						if e.offsetX? # IE, GC, Safari, O
							x = e.offsetX; y = e.offsetY
						else # FireFox, GC, Safari
							x = e.layerX; y = e.layerY
					return if do (cp=currentPoint) -> cp and cp.x == x and cp.y == y
					currentPoint = new CursorPoint opts, x, y
					isCurrentPointUpdated = true
					canvas.style.display = "block"
					@animator.run()
			}
			{
				target: target
				name: "mouseenter"
				fn: (e) =>
					return if isMouseDown
					# remove dummies if their exist.
					points.splice idx, 1 while (idx = points.indexOf "dummy") != -1
			}
			{
				target: target
				name: "mouseleave"
				fn: (e) =>
					isMouseMove = false
					return if isMouseDown
					# This point is a dummy and is never drawn. Also see animation loop.
					currentPoint = "dummy"
					isCurrentPointUpdated = true
			}
			{
				target: window
				name: "mousedown"
				fn: (e) =>
					isMouseDown = true
					canvas.style.display = "none"
			}
			{
				target: window
				name: "mouseup"
				fn: (e) =>
					isMouseDown = false
			}
			{
				target: window
				name: if UA.firefox then "DOMMouseScroll" else "mousewheel"
				fn: (e) =>
					canvas.style.display = "none"
			}
		]
		
		# cursor points
		points = []
		
		# animate
		animator = new Animator opts.fps, (frameCount) =>
			# observe target size
			if canvas.width != target.clientWidth or \
					canvas.height != target.clientHeight
				canvas.width = target.clientWidth
				canvas.height = target.clientHeight
			# append point
			if isCurrentPointUpdated
				points.push currentPoint
				isCurrentPointUpdated = false
			# remove dead or dummy points
			while points.length > 0 and (points[0] == "dummy" or points[0].isDead())
				points.shift()
			# points is empty only on mouse leave
			if points.length == 0
				canvas.style.display = "none"
				animator.stop() # suspend
				return
			# draw
			ctx = canvas.getContext "2d"
			ctx.clearRect 0, 0, canvas.width, canvas.height
			if points.length > 0
				tail = points.concat()
				head = tail.pop()
				if head == "dummy"
					opts.draw ctx, tail, null, tail
				else
					opts.draw ctx, points, head, tail
			# decrement life and update some properties of each tail point
			if points.length > 1
				points[i].decrementLife() for i in [0...points.length-1] 
			null
			
		@opts = opts
		@canvas = canvas
		@animator = animator
		@isWatching_ = false
			
	watch: ->
		return if @isWatching_
		@isWatching_ = true
		event.target.addEventListener event.name, event.fn for event in @events_
		@
		
	unwatch: ->
		return unless @isWatching_
		@isWatching_ = false
		event.target.removeEventListener event.name, event.fn for event in @events_
		@animator.stop()
		@canvas.style.display = "none"
		@
	
	destroy: ->
		@unwatch()
		@opts.target.removeChild @canvas
		
	
# Exports
#---------

MagicCursor.UA = UA
MagicCursor.Vector2 = Vector2
MagicCursor.Options = Options
window.MagicCursor = MagicCursor


