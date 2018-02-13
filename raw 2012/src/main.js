
// Some global vars
var duration = 0,
	ease = "exp",
	data,
	vis,
	// Available views - comment the line to disabled views
	views = [ 
		{"label":"Bubble Chart","name":"bubble"},
		{"label":"Dots","name":"dots"},
		{"label":"Treemap","name":"treemap"}
	],
	loader

// Initializing data loader
loader = raw.gui.loader()
	.target("#loader")
	.on("parse", updateData)
	.append()

// Listeners...
$(window).load(resize);
$(window).resize(resize);
$(window).resize(loader.update);

d3.select("#expand-data")
	.on("click",function(){
		loader.close();
		resize();
	})


// well, update data...
function updateData(response){

	data = response.result

	if(response.status == "ok") {
		raw.gui.select2()
			.data(views)
			.value(function(d){ return d.name; })
			.text(function(d){ return d.label; })
			.target("#set-vis")
			.label("Choose a layout")
			.on("change", function(d){ updateStructure(d); })
			.append()

		d3.select("#expand-data")
			.attr("class","btn enabled")
				.on("click",function(){
					d3.select("#expand-data")
						.style("display","none")
					loader.close();
					resize();
					d3.select("#top-panel .description")
						.style("display","none")
					d3.select("#middle-panel")
						.style("opacity","0")
						.style("display","block")
						.transition()
						.duration(500)
						.ease("out")
						.style("opacity","1")
						
					
				//	d3.selectAll(".closed").style("display","block");
			})
	}
	else {
		d3.select("#expand-data")
			.attr("class","btn disabled")
			.on("click","")
	}
	
	
}


function updateStructure(v){
	
	if (!raw.vis[v]) return false;
	
	d3.select("#bottom-panel")
		.style("display","block")
		
	resize();
	
	vis = raw.vis[v]()
		.target("#vis")
		.on("update",resize)
		.data(data)
		//.update()
	
		d3.select("#set-map")
			.selectAll("*").remove()
	
		d3.entries(vis.structure().map()).forEach(function(t){
			if (!raw.gui[t.value.type]) return;
			raw.gui[t.value.type]()
				.data(d3.keys(data[0]))
				.target("#set-map")
				.label(t.value.label)
				.tip(t.value.description)
				.multiple(t.value.multiple? t.value.multiple : false)
				//.on("load",  function(d){ vis.structure().map(t.key,d); })
				.on("change", function(d){
					// update mapping
					vis.structure().map(t.key,d);
					//update params
					updateParams();	
					// update vis
					//vis.update();  
				})
				.append()
		})	
		
	updateParams();	
		
	d3.select("#export-svg")
		.attr("class","btn")
		.on("click", exportSvg)
		
	d3.select("#export-data")
		.attr("class","btn")
		.on("click", exportData)
	

}

// update params
function updateParams(){
	
	d3.select("#set-layout")
		.selectAll("*").remove()

	d3.entries(vis.param()).forEach(function(t){
		if (!raw.gui[t.value.type]) return;
	
		raw.gui[t.value.type]()
			.target("#set-layout")
			.label(t.value.label)
			.value(t.value.value)
			.data(t.value.data)
			.tip(t.value.description)
			.on("change", function(d){
				vis.param(t.key,d);
			})
			.append()
	})
}

// export Svg
function exportSvg(e){
	
			
  var html = d3.select("#vis").select("svg")
    	.attr("title", "rawprint")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;
	
    var content = d3.select("body").append("div")
        .attr("id", "tmp")
		.style("display","none")
        .style("top", d3.event.clientY+20+"px")
        .style("left", d3.event.clientX+"px")
        .html("Right-click on the image below and choose Save as...<br/>")
        .append("img")
        .attr("src", "data:image/svg+xml,"+ (html))

	var w = window.open();
	$(w.document.body).html(content.node().parentNode.innerHTML);
	
	d3.select("#tmp")
		.remove()
}

// export Data
function exportData(e) {
	
	var json = JSON.stringify(vis.structure()(data));
	var content = d3.select("body").append("div")
        .attr("id", "tmp")
		.style("display","none")
        .html(json);
	
	var w = window.open("data:text/json;charset=utf-8," + json);
	
	d3.select("#tmp")
		.remove()
}

// Resizing stuff
function resize() {

	var bodyHeight = parseInt($("body").outerHeight(true)),
		headerHeight = parseInt($("#header").outerHeight(true)),
		topHeight = parseInt($("#top-panel").outerHeight(true)),
		middleHeight = parseInt($("#middle-panel").outerHeight(true))
			
	d3.select("#bottom-panel")
		.style("height","0px")

	var s = d3.max([
		(bodyHeight - headerHeight - topHeight - middleHeight),
		d3.max([ parseInt($("#bottom-panel .content-side").outerHeight(true) + 40), parseInt($("#bottom-panel .content").outerHeight(true)) ])
		])
	
	d3.select("#bottom-panel")
		.style("height",function(){ return s + "px"; })
		
	d3.select("#bottom-panel")
		.transition()
		.duration(duration)
		.ease(d3.ease(ease))
		.style("top",function(){ return topHeight + middleHeight + "px"; })
		
}

