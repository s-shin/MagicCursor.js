###
MagicCursor-evernote.js
(C) 2014 Shintaro Seki <s2pch.luck@gmail.com>
The MIT License
###
# Evernote presentation style
MagicCursor.Options.add "evernote",
	fps: 60
	duration: 0.25
	color: [100, 150, 255]
	radius: 7
	lineWidth: 2.5
	draw: (ctx, points, head, tail) ->
		{radius, lineWidth, color} = @
		
		if tail.length > 0
			# create path
			path = []
			for i in [0...points.length-1]
				a = points[i]
				b = points[i+1]
				if i == 0
					path.push a
				else
					n = b.sub(a).normal()
					v = n.muls ((1-a.param) * radius)
					path.push a.add(v)
					path.unshift a.sub(v)
			# draw
			t1 = tail[0]
			t2 = head or tail[tail.length-1]
			ctx.lineWidth = lineWidth
			grad = ctx.createLinearGradient t1[0], t1[1], t2[0], t2[1]
			grad.addColorStop 0, "rgba(255, 255, 255, 0)"
			grad.addColorStop 1, "rgba(255, 255, 255, 1)"
			ctx.strokeStyle = grad
			grad = ctx.createLinearGradient t1[0], t1[1], t2[0], t2[1]
			grad.addColorStop 0, "rgba(#{color.join(',')}, 0)"
			grad.addColorStop 1, "rgba(#{color.join(',')}, 1)"
			ctx.fillStyle = grad
			ctx.beginPath()
			ctx.lineTo p[0], p[1] for p in path
			ctx.fill()
			ctx.stroke()
		
		if head
			ctx.lineWidth = lineWidth
			ctx.strokeStyle = "#FFF"
			ctx.fillStyle = "rgba(#{color.join(',')}, 1)"
			ctx.beginPath()
			ctx.arc head[0], head[1], radius, 0, Math.PI * 2
			ctx.fill()
			ctx.stroke()
		
