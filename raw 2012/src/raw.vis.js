(function(){
	
	raw.vis = {}
	
	/* Bubble */
	raw.vis.bubble = function(){
		
		var vis = {},
			data,
			target,
			structure = raw.structure.tree(),
			param = {
				radius: { 
					label : "Radius",
					value : 800,
					type : "number",
					description : "Radius, of course",
					data : null
				},
				labels: { 
					label : "Show Labels",
					value : true,
					type : "check",
					description : "Bla",
					data : null
				},
				color: { 
					label : "Color",
					value : function(x){ 
						return "#c27070";
					},
					type : "color",
					data : function() {
						var nesting = d3.nest()
							.key(function(d) { return d[structure.map().color.value] })
							.map(vis.data())
						return d3.keys(nesting);
					},
					description : "Colors..."
				}	
			},
			svg,
			event = d3.dispatch(
				"update"
			)
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
				
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			vis.update();
			return vis;
		}
		
		vis.on = function(type, listener) {
			event.on(type,listener)
			return vis;
		}
		
		vis.update = function() {
						
			var r = param.radius.value,
			    format = d3.format(",d"),
			    fill = param.color.value;//d3.scale.category20c();
			
			var layout = d3.layout.pack()
    			.sort(null)
    			.size([param.radius.value, param.radius.value]);

			d3.select(target).selectAll("svg").remove()
			
			svg = d3.select(target).append("svg:svg")
			    .attr("width", param.radius.value)
			    .attr("height", param.radius.value)
			    .attr("class", "bubble equals")

			  var node = svg.selectAll("g.node")
			      .data(layout.nodes(structure(data))
			      .filter(function(d) { return !d.children; }))
			    .enter().append("svg:g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  node.append("svg:title")
			      .text(function(d) { return d.name + ": " + format(d.value); });

			  node.append("svg:circle")
			      .attr("r", function(d) { return d.r; })
				  .style("stroke", function(d) { return structure.map().color.value ? d3.rgb(fill(d.color)).darker() : d3.rgb(fill("undefined")).darker(); } )
			      .style("fill", function(d) { return structure.map().color.value ? fill(d.color) : fill("undefined"); });

			  
			  if (param.labels.value) node.append("svg:text")
			      .attr("text-anchor", "middle")
			      .attr("dy", ".3em")
			      .text(function(d) { return d.name +  " (" + d.value + ")"; })
				  .style("font-size","10px")
				  .style("font-family","Arial, Helvetica, sans-serif");
			
			
			// Returns a flattened hierarchy containing all leaf nodes under the root.
			function classes(root) {
			  var classes = [];

			  function recurse(name, node) {
			    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
			    else classes.push({packageName: name, className: node.name, value: node.size});
			  }

			  recurse(null, root);
			  return {children: classes};
			}
		
			event.update();
			
			return vis;
		}
		
		
		return vis;		
	}
	
	/*	Treemap */
	raw.vis.treemap = function(){
		
		var vis = {},
			structure = raw.structure.tree(),
			param = {
				width: { 
					label : "Width",
					value : 800,
					type : "number",
					description : "The width, oh yes",
					data : null
				},
				height: { 
					label : "Height",
					value : 500,
					type : "number",
					description : "The height, oh yes",
					data : null
				},
				padding: { 
					label : "Padding",
					value : 0,
					type : "number",
					description : "Bla",
					data : null
				},
				labels: { 
					label : "Show Labels",
					value : true,
					type : "check",
					description : "Bla",
					data : null
				},
				color: { 
					label : "Color",
					value : function(x){ 
						return "#c27070";
					},
					type : "color",
					data : function() {
						var nesting = d3.nest()
							.key(function(d) { return d[structure.map().color.value] })
							.map(vis.data())
						return d3.keys(nesting);
					},
					description : "Colors..."
				}
			},
			svg,
			target,
			data,
			event = d3.dispatch(
				"update"
			)
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
		
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			vis.update();
			return vis;
		}
		
		vis.on = function(type, listener) {
			event.on(type,listener)
			return vis;
		}
		
		vis.update = function() {
									
			var color = param.color.value;//d3.scale.category20c();
			var format = d3.format(",d");		
			var layout = d3.layout.treemap()
			    .padding(parseInt(param.padding.value))
				.sticky(true)
			    .size([parseInt(param.width.value), parseInt(param.height.value)])
			    .value(function(d) { return d.value; })
						
			d3.select(target).selectAll("svg").remove()

			svg = d3.select(target).append("svg:svg")
			    .attr("width", parseInt(param.width.value))
			    .attr("height", parseInt(param.height.value))
			  	.append("svg:g")
			    .attr("transform", "translate(-.5,-.5)");

			  var cell = svg.data([structure(data)])
				.selectAll("g")
			    .data(layout.nodes)
			    .enter().append("svg:g")
			      .attr("class", "cell")
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  cell.append("svg:rect")
			      .attr("width", function(d) { return d.dx; })
			      .attr("height", function(d) { return d.dy; })
			      .style("fill", function(d) {  return structure.map().color.value ? color(d.color) : color("undefined"); })
			      .style("fill-opacity", function(d) {  return d.children ? 0 : 1; })
				  .style("stroke","#fff")
			
				cell.append("svg:title")
				      .text(function(d) { return d.name + ": " + format(d.value); });

			if (param.labels.value)
				 cell.append("svg:text")
				      .attr("x", function(d) { return d.dx / 2; })
				      .attr("y", function(d) { return d.dy / 2; })
				      .attr("dy", ".35em")
				      .attr("text-anchor", "middle")
				      .text(function(d) { return d.children ? null : d.name; })
					  .style("font-size","10px")
					  .style("font-family","Arial, Helvetica, sans-serif");
			
			event.update();
			
			return vis;
		}
		
		return vis;
	
	}
	
	/*	Tree */
	raw.vis.tree = function(){
		
		var vis = {},
			structure = raw.structure.tree(),
			param = {
				radius: { 
					label : "Radius",
					value : 960,
					type : "Number",
					description : "",
					default : 960
				},
				labels: { 
					label : "Show Labels",
					value : true,
					type : "check",
					description : "Bla",
					default : true
				}
			},
			svg,
			target,
			data
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
		
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			return vis;
		}
		
		vis.update = function() {
						
			var r = param.radius.value/2;

			var tree = d3.layout.tree()
			    .size([360, r - 120])
			    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

			var diagonal = d3.svg.diagonal.radial()
			    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
			
			d3.select(target).selectAll("svg").remove()

			svg = d3.select(target).append("svg:svg")
			    .attr("width", r * 2)
			    .attr("height", r * 2 - 150)
			  .append("svg:g")
			    .attr("transform", "translate(" + r + "," + r + ")");

			  var nodes = tree.nodes(structure(data));

			  var link = svg.selectAll("path.link")
			      .data(tree.links(nodes))
			    .enter().append("svg:path")
			      .attr("class", "link")
			      .attr("d", diagonal)
				  .style("fill","none")
				  .style("stroke","#ccc")
				  .style("stroke-width",1.5)

			  var node = svg.selectAll("g.node")
			      .data(nodes)
			    .enter().append("svg:g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

			  node.append("svg:circle")
			      .attr("r", 4.5)
				  .style("fill","#fff")
				  .style("stroke","steelblue")
				  .style("stroke-width",1.5)

			  if (param.labels.value)
			 	node.append("svg:text")
			      .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
			      .attr("dy", ".31em")
			      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
			      .text(function(d) { return d.name; });
	
		}
		
		return vis;
	
	}
		
	/*	Sunburst */
	raw.vis.sunburst = function(){
		
		var vis = {},
			structure = raw.structure.tree(),
			param = {
				radius: { 
					label : "Radius",
					value : 960,
					type : "number",
					description : "",
					data : null
				},
				labels: { 
					label : "Show Labels",
					value : true,
					type : "check",
					description : "Bla",
					data : null
				},
				color: { 
					label : "Color",
					value : function(x){ 
						return "#c27070";
					},
					type : "color",
					data : function() {
						var nesting = d3.nest()
							.key(function(d) { return d[structure.map().color.value] })
							.map(vis.data())
						return d3.keys(nesting);
					},
					description : "Colors..."
				}
			},
			svg,
			target,
			data,
			event = d3.dispatch(
				"update"
			)
			
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
		
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			vis.update();
			return vis;
		}
		
		vis.on = function(type, listener) {
			event.on(type,listener)
			return vis;
		}
		
		vis.update = function() {
						
			d3.select(target).selectAll("svg").remove()
						
			var d = parseInt(param.radius.value),
			    color = param.color.value;

			svg = d3.select(target).append("svg:svg")
			    .attr("width", d)
			    .attr("height", d)
			  .append("svg:g")
			    .attr("transform", "translate(" + d / 2 + "," + d / 2 + ")")

			var partition = d3.layout.partition()
			    .sort(null)
			    .size([2 * Math.PI, (d/2) * (d/2)])
			    .value(function(d) { console.log(d); return d.value; });

			var arc = d3.svg.arc()
			    .startAngle(function(d) { return d.x; })
			    .endAngle(function(d) { return d.x + d.dx; })
			    .innerRadius(function(d) { return Math.sqrt(d.y); })
			    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

			  var path = svg.data([structure(data)]).selectAll("path")
			      .data(partition.nodes)
			    .enter().append("svg:path")
			      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
			      .attr("d", arc)
			      .attr("fill-rule", "evenodd")
			      .style("stroke", "#fff")
			      .style("fill", function(d) {
				
				 		return structure.map().color.value ? color(d.color) : color("undefined"); 
				 		
							//return color((d.children ? d : d.parent).color);
					})
			      .each(stash);

			// Stash the old values for transition.
			function stash(d) {
			  d.x0 = d.x;
			  d.dx0 = d.dx;
			}

			// Interpolate the arcs in data space.
			function arcTween(a) {
			  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
			  return function(t) {
			    var b = i(t);
			    a.x0 = b.x;
			    a.dx0 = b.dx;
			    return arc(b);
			  };
			}
			
			event.update();
			
			return vis;
	
		}
		
		return vis;
	
	}
	
	raw.vis.net = function(){
		
		var vis = {},
			structure = raw.structure.net(),
			param = {
				width: { 
					label : "Width",
					value : 960,
					type : "number",
					description : "",
					default : 960
				},
				height: { 
					label : "Height",
					value : 500,
					type : "number",
					description : "",
					default : 500
				},
				charge: { 
					label : "Charge",
					value : -120,
					type : "number",
					description : "",
					default : -120
				},
				distance: { 
					label : "Links Distance",
					value : 30,
					type : "number",
					description : "",
					default : 30
				},
			},
			svg,
			target,
			data
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
		
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			return vis;
		}
		
		vis.update = function() {
			
			var json = structure(data);
			
			var w = param.width.value,
			    h = param.height.value,
			    fill = d3.scale.category20();
			
			d3.select(target).selectAll("svg").remove()
			
			svg = d3.select(target)
				.append("svg:svg")
				.attr("width", w)
				.attr("height", h);

			var force = d3.layout.force()
				.charge(param.charge.value)
				.linkDistance(param.distance.value)
				.nodes(json.nodes)
				.links(json.links)
				.size([w, h])
				.start();

			var link = svg.selectAll("line.link")
				.data(json.links)
				.enter().append("svg:line")
				.attr("class", "link")
				.style("stroke-width", function(d) { return Math.sqrt(d.value); })
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			var node = svg.selectAll("circle.node")
				.data(json.nodes)
				.enter().append("svg:circle")
				.attr("class", "node")
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; })
				.attr("r", 5)
				.style("fill", function(d) { return fill(d.group); })
				.call(force.drag);

			node.append("svg:title")
				.text(function(d) { return d.name; });

/*			vis.style("opacity", 1e-6)
				.transition()
				.duration(1000)
				.style("opacity", 1);
*/
			force.on("tick", function() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
			});
	
		}
		
		return vis;
	}
	
	raw.vis.pack = function(){
		
		var vis = {},
			structure = raw.structure.tree(),
			param = {
				width: { 
					label : "Width",
					value : 960,
					type : "number",
					description : "Radius, of course",
					default : 960
				},
				height: { 
					label : "Height",
					value : 960,
					type : "number",
					description : "Bla",
					default : 960
				}/*,
				color: { 
					label : "Color",
					value : "",
					type : "list",
					description : "Colors, of course",
					default : function(){  }
				},*/	
			},
			svg,
			data,
			target
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
				
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			//if (options.hasOwnProperty(name))
			param[name].value = value;
			return vis;
		}
		
		vis.update = function() {
			
			console.log(structure(data))
			
			d3.select(target).selectAll("svg").remove()
						
			var w = param.width.value,
			    h = param.height.value,
			    format = d3.format(",d");

			var pack = d3.layout.pack()
			    .size([w - 4, h - 4])
			    .value(function(d) { return d.size; });

			svg = d3.select(target).append("svg")
			    .attr("width", w)
			    .attr("height", h)
			    .attr("class", "pack")
			  .append("g")
			    .attr("transform", "translate(2, 2)");

			  var node = svg.data([structure(data)]).selectAll("g.node")
			      .data(pack.nodes)
			    .enter().append("g")
			      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			  node.append("title")
			      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

			  node.append("circle")
			      .attr("r", function(d) { return d.r; });

			  node.filter(function(d) { return !d.children; }).append("text")
			      .attr("text-anchor", "middle")
			      .attr("dy", ".3em")
			      .text(function(d) { return d.name.substring(0, d.r / 3); });
		
		}
		
		return vis;
	}
	
	raw.vis.dots = function(){
		
		var vis = {},
			structure = raw.structure.points(),
			param = {
				width: { 
					label : "Width",
					value : 800,
					type : "number",
					description : "Radius, of course",
					data : null
				},
				height: { 
					label : "Height",
					value : 500,
					type : "number",
					description : "Bla",
					data : null
				},
				minradius: { 
					label : "Min radius",
					value : 0,
					type : "number",
					description : "Bla",
					data : null
				},
				maxradius: { 
					label : "Max radius",
					value : 20,
					type : "number",
					description : "Bla",
					data : null
				},
				padding: { 
					label : "Padding",
					value : 20,
					type : "number",
					description : "Bla",
					data : null
				},
				color: { 
					label : "Color",
					value : function(x){ 
						return "#c27070";
					},
					type : "color",
					data : function() {
						var nesting = d3.nest()
							.key(function(d) { return d[structure.map().color.value] })
							.map(vis.data())
						return d3.keys(nesting);
					},
					description : "Colors..."
				}
			},
			svg,
			data,
			target,
			event = d3.dispatch(
				"update"
			)
			
		vis.structure = function(){
			return structure; // da vedere aprentesi o no
		}

		vis.target = function(x){
			if (!arguments.length) return target;
			target = x;
			return vis;
		}
				
		vis.data = function(x){
			if (!arguments.length) return data;
			data = x;
			return vis;
		}
		
		vis.param = function(name, value){
			if (!arguments.length) return param;
			param[name].value = value;
			vis.update();
			return vis;
		}
		
		vis.on = function(type, listener) {
			event.on(type,listener)
			return vis;
		}
		
		vis.update = function() {
						
			var w = parseInt(param.width.value),
			    h = parseInt(param.height.value),
			    p = parseInt(param.padding.value),
			    color = param.color.value,
				x = d3.scale.linear().range([0, w]).domain([ d3.min(structure(data).map(function(d){ return d.x; })) , d3.max(structure(data).map(function(d){ return d.x; }))  ]),
			    y = d3.scale.linear().range([h, 0]).domain([ d3.min(structure(data).map(function(d){ return d.y; })) , d3.max(structure(data).map(function(d){ return d.y; }))  ]),
				size = d3.scale.linear().range([ Math.pow(parseFloat(param.minradius.value),2)*Math.PI , Math.pow(parseFloat(param.maxradius.value),2)*Math.PI]).domain([ d3.min(structure(data).map(function(d){ return d.size; })) , d3.max(structure(data).map(function(d){ return d.size;}))   ])
			    
			//symbol = d3.scale.ordinal().range(d3.svg.symbolTypes),

			d3.select(target).selectAll("svg").remove()

			svg = d3.select(target)
			  .append("svg")
			    .attr("width", w + p * 2)
			    .attr("height", h + p * 2)
			  .append("g")
			    .attr("transform", "translate(" + p + "," + p + ")");

			var xrule = svg.selectAll("g.x")
			    .data(x.ticks(10))
			  .enter().append("g")
			    .attr("class", "x");

			xrule.append("line")
			    .attr("x1", x)
			    .attr("x2", x)
			    .attr("y1", 0)
			    .attr("y2", h)
				.style("stroke","#ccc")
				.style("shape-rendering","crispEdges");

			xrule.append("text")
			    .attr("x", x)
			    .attr("y", h + 3)
			    .attr("dy", ".71em")
			    .attr("text-anchor", "middle")
				.style("font-size","10px")
				.style("font-family","Arial, Helvetica, sans-serif")
			    .text(x.tickFormat(10));

			var yrule = svg.selectAll("g.y")
			    .data(y.ticks(10))
			  .enter().append("g")
			    .attr("class", "y");

			yrule.append("line")
			    .attr("x1", 0)
			    .attr("x2", w)
			    .attr("y1", y)
			    .attr("y2", y)
				.style("stroke","#ccc")
				.style("shape-rendering","crispEdges");

			yrule.append("text")
			    .attr("x", -3)
			    .attr("y", y)
			    .attr("dy", ".35em")
			    .attr("text-anchor", "end")
				.style("font-size","10px")
				.style("font-family","Arial, Helvetica, sans-serif")
			    .text(y.tickFormat(10));

			svg.append("rect")
			    .attr("width", w)
			    .attr("height", h)
				.style("fill","none")
				.style("stroke","#888")
				.style("shape-rendering","crispEdges");

			svg.selectAll("circle")
			    .data(structure(data))
			  .enter().append("circle")
			    .attr("class", "dot")
				.style("stroke", function(d) { return structure.map().color.value ? d3.rgb(color(d.color)).darker() : d3.rgb(color("undefined")).darker(); } )
			    .style("fill", function(d) { return structure.map().color.value ? color(d.color) : color("undefined"); })
			    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
			    .attr("r", function(d){ return structure.map().size.value ? Math.sqrt(size(d.size)/Math.PI) : parseFloat(param.maxradius.value); });
				//.attr("r", function(d){ return d.size; });
			
			event.update();
					
		}
		
		return vis;
	}
	
})();