###
MagicCursor-line.js
(C) 2014 Shintaro Seki <s2pch.luck@gmail.com>
The MIT License
###
MagicCursor.Options.add "line",
	fps: 30
	duration: 0.5
	color: [255, 255, 255]
	lineWidth: 2
	radius: 5
	draw: (ctx, points, head, tail) ->
		if tail.length > 0
			ctx.lineWidth = @lineWidth
			ctx.strokeStyle = "rgb(#{@color.join(',')})"
			ctx.beginPath()
			ctx.lineTo p.x, p.y for p in points
			ctx.stroke()
		if head
			ctx.lineWidth = 0
			ctx.fillStyle = "rgb(#{@color.join(',')})"
			ctx.beginPath()
			ctx.arc head.x, head.y, @radius, 0, Math.PI * 2
			ctx.fill()
			

