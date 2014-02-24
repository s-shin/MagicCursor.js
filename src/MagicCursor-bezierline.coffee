###
MagicCursor-bezierline.js
(C) 2014 Shintaro Seki <s2pch.luck@gmail.com>
The MIT License
###
MagicCursor.Options.add "bezierline",
	fps: 30
	duration: 0.5
	color: [255, 255, 255]
	lineWidth: 2
	radius: 5
	curveStrength: 0.5
	debug: false
	draw: (ctx, points, head, tail) ->
		controlPoints = []
		if points.length >= 3
			# create control points of bazier curve
			# http://decafish.blog.so-net.ne.jp/2009-01-11
			# http://www.antigrain.com/research/bezier_interpolation/index.html
			controlPoints.push null # first point
			for i in [1...points.length-1]
				a = points[i-1]
				b = points[i]
				c = points[i+1]
				ba = a.sub b
				bc = c.sub b
				baLen = ba.len()
				bcLen = bc.len()
				ma = b.add ba.muls(0.5)
				mc = b.add bc.muls(0.5)
				mamc = mc.sub ma
				mm = ma.add mamc.muls(baLen / (baLen+bcLen))
				mmma = ma.sub mm
				mmmc = mc.sub mm
				k = @curveStrength
				controlPoints.push [b.add(mmma.muls(k)), b.add(mmmc.muls(k))]
			controlPoints.push null # last point
		if tail.length > 0
			ctx.lineWidth = @lineWidth
			ctx.strokeStyle = "rgb(#{@color.join(',')})"
			ctx.beginPath()
			if controlPoints.length > 0
				for i in [0...points.length-1]
					a = points[i]
					b = points[i+1]
					if i == 0
						ctx.moveTo a[0], a[1]
						cp2 = controlPoints[i+1][0]
						ctx.quadraticCurveTo cp2.x, cp2.y, b.x, b.y
					else if i == points.length-2
						cp1 = controlPoints[i][1]
						ctx.quadraticCurveTo cp1.x, cp1.y, b.x, b.y
					else
						cp1 = controlPoints[i][1]
						cp2 = controlPoints[i+1][0]
						ctx.bezierCurveTo cp1.x, cp1.y, cp2.x, cp2.y, b.x, b.y
			else
				ctx.lineTo for p in points
			ctx.stroke()
		if head
			ctx.lineWidth = 0
			ctx.fillStyle = "rgb(#{@color.join(',')})"
			ctx.beginPath()
			ctx.arc head.x, head.y, @radius, 0, Math.PI * 2
			ctx.fill()
		if @debug
			# draw bezier control points
			ctx.lineWidth = 2
			ctx.strokeStyle = "red"
			ctx.fillStyle = "red"
			for cp in controlPoints
				continue unless cp
				ctx.beginPath()
				ctx.moveTo cp[0].x, cp[0].y
				ctx.lineTo cp[1].x, cp[1].y
				ctx.stroke()
				ctx.beginPath()
				ctx.arc cp[0].x, cp[0].y, 2, 0, Math.PI * 2
				ctx.fill()
				ctx.beginPath()
				ctx.arc cp[1].x, cp[1].y, 2, 0, Math.PI * 2
				ctx.fill()
			
		
			
		

