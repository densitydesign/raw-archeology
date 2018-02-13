var views = ["-","treemap","bubble","pack","tree","sunburst","net"],
	rows,
	data,
	vis

	d3.select("#print-button")
		.on("click", print)

d3.select("#load-button")
	.on("click", function(){
		
		rows = d3.select("#rows").property("value");
		data = raw.io.parse(rows,true)
		
		/*var cls = 5
		var colo = raw.colors.diverging(cls)
		d3.select("#colors")
			.selectAll("div")
			.data(d3.range(cls))
			.enter().append("div")
			.style("width","20px")
			.style("height", "20px")
			.style("margin-right", "5px")
			.style("background-color",function(d){ return colo(d) })
			.style("float","left")
		*/	
		
		d3.select("#load-drop")
			.append("ul")
			.selectAll("li")
			.data(d3.keys(data[0]))
			.enter()
				.append("li")
				.html(function(d){console.log(d);return d;})
		
		raw.gui.select()
			.data(views)
			.target("#options-vis")
			.label("Choose the visualization")
			.on("change", function(d){ initStructure(d); })
			.append()
});

/*
d3.select("#options-button")
	.on("click", function(){
		console.log(JSON.stringify(vis.structure()(data)))		
	})

/*
d3.csv("data.csv", function(json){
	
	
	var tree = raw.structure.tree()
		.map("path","path")
		.map("size","value")
		.map("name","name")
		.map("data","total")
	
	var colors = {
		A : "#E41A1C",
		B : "#377EB8",
		C : "#4DAF4A",
		D : "#984EA3",
		E : "#FF7F00",
		F : "#FFFF33",
		G : "#A65628",
		H : "#F781BF"
		}
	
	var da = tree(json)
	var svg = d3.select("#chart-section").append("svg:svg")
	    .attr("width", 7000)
	    .attr("height", 500)
	//	.on("click", print);

	var last = 0;
	for (var child in da.children) {
		
		var dimension = Math.sqrt(parseInt(da.children[child].children[0].children[0]._data))*50
		
		var w = dimension,
		    h = dimension,
		    color = d3.interpolateRgb("#ffffff", "#000000"),
			alphaScale = d3.scale.quantize().domain([0,1]).range([0.3,0.44,0.58,0.72,0.86,1])

		var treemap = d3.layout.treemap()
		    .size([w, h])
		    .value(function(d) { return d.size; });

		var single = svg.append("svg:g")
		    .attr("transform", "translate(" + (last) + ",20)")


		  var cell = single.data([da.children[child]]).selectAll("g")
		      .data(treemap)
		    .enter().append("svg:g")
		      .attr("class", "cell")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })



		  cell.append("svg:rect")
		      .attr("width", function(d) { return d.dx; })
		      .attr("height", function(d) { return d.dy; })
		      .style("fill", function(d){ return colors[d.data.name];})
		
//			  .style("fill-opacity", function(d){ console.log(alphaScale(d.data.color)); return alphaScale(d.data.color) })
	//				return "rgba(" + d3.rgb(colors[d.data.name]).r + "," + d3.rgb(colors[d.data.name]).g + "," + d3.rgb(colors[d.data.name]).b + "," + alphaScale(d.data.color) + ")"})//function(d) { return colors[d.data.name] })


		  cell.append("svg:text")
		      .attr("x", function(d) { return d.dx / 2; })
		      .attr("y", function(d) { return d.dy / 2; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", "middle")
		      .text(function(d) { return d.parent ? countLetters(d.parent.data.name) : null;});


		single.append("svg:text")
			.attr("dy", "-1em")
			.text(function(d) { return da.children[child].name; });
		
		last += dimension + 5;
	}
	
	
	
	function countLetters(s) {
		
		var news = ""
		for (var c in s){
			if (s.charCodeAt(c) > 127)
				console.log(s.charAt(c), 'errore');
			else news += s.charAt(c)
		}
		console.log(news)
		return news;
		
	}
	
	
	

	
	
})
	
	/*

d3.json("flare.json", function(json){
	
	var layout = d3.layout.treemap()
	    .padding(0)
	    .size([500,500])
	    .value(function(d) { return d.size; })

	console.log(layout(json), json, d3.layout.d3_layout_hierarchyInline)

	layout = d3.layout.pack()
	    .sort(null)
	    .size([500, 500]);

	console.log(layout.nodes(classes(json)),d3.layout.d3_layout_hierarchyInline)

	var layout2 = d3.layout.treemap()
	    .padding(0)
	    .size([500, 500])
	    .value(function(d) { return d.size; })

	console.log(layout2(json), json, d3.layout.d3_layout_hierarchyInline)
	
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
	
})
*/





function initStructure(v){
	
	if (!raw.vis[v]) return false;
	
	vis = raw.vis[v]()
		.target("#chart-section")
		.data(data)
	
	d3.select("#options-params")
		.selectAll("*").remove()
	
	d3.entries(vis.structure().map()).forEach(function(t){
		if (!raw.gui[t.value.type]) return;
		raw.gui[t.value.type]()
			.data(d3.keys(data[0]))
			.target("#options-params")
			.label(t.value.label)
			.tip(t.value.description)
			.multiple(t.value.multiple? t.value.multiple : false)
			//.on("load",  function(d){ vis.structure().map(t.key,d); })
			.on("change", function(d){ vis.structure().map(t.key,d); vis.update(); })
			.append()
	})
	

	
	d3.entries(vis.param()).forEach(function(t){
		if (!raw.gui[t.value.type]) return;
		
		raw.gui[t.value.type]()
			.target("#options-params")
			.label(t.value.label)
			.data(t.value.default)
			.tip(t.value.description)
			//.on("load",  function(d){ vis.param(t.key,d);  })
			.on("change", function(d){  vis.param(t.key,d); vis.update(); })
			.append()
	})
	
}


function print(e){		
	
  //  var html = d3.select(d3.event.target.parentElement.parentElement.parentElement)
  
//	console.log(d3.select("#chart-section").select("svg")[0])
//	console.log(d3.select(d3.event.target.parentElement.parentElement.parentElement))
		
  var html = d3.select("#chart-section").select("svg")
    	.attr("title", "rawprint")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;
		
    d3.select("body").append("div")
        .attr("id", "rawprint")
        .style("top", event.clientY+20+"px")
        .style("left", event.clientX+"px")
        .html("Right-click on this preview and choose Save as<br />Left-Click to dismiss<br />")
        .append("img")
        .attr("src", "data:image/svg+xml,"+ (html));

    d3.select("#rawprint")
        .on("click", function(){
            if(event.button == 0){
                d3.select(this).transition()
                    .style("opacity", 0)
                    .remove();
            }
        })
        .transition()
        .duration(500)
        .style("opacity", 1);
};
