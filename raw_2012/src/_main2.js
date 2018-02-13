/*$(function() {
		$( "#accordion" ).accordion({
			autoHeight: false,
			collapsible: true
		});
	});
*/

var data,
	vis,
	views = [
		{"label":"Treemap","name":"treemap"},
		{"label":"Bubble Chart","name":"bubble"},
//		{"label":"Circle Packing","name":"pack"},
//		{"label":"Tree","name":"tree"},
//		{"label":"Sunburst","name":"sunburst"},
		{"label":"Dots","name":"dots"},
//		{"label":"Network","name":"net"}
		],
	minLayoutHeight


var loader = raw.gui.loader()
	.target("#loader")
	.on("parse", updateData)
	.append()
	
/*var picker = raw.gui.picker()
	.target("body")
	.on("change",function(d){ console.log(d)})
	.append()
*/


/*
d3.select("#export-svg.enabled")
	.on("click",print)
d3.select("#export-data.enabled")
	.on("click",exportData)
*/

function updateData(response){
	
	data = response.result
	
	if(response.status == "ok") {
	
		raw.gui.select2()
			.data(views)
			.value(function(d){ return d.name; })
			.text(function(d){ return d.label; })
			.target("#set-vis")
			.label("Choose a layout")
			.on("change", function(d){ initStructure(d); })
			.append()
		
		d3.select("#butt")
			.attr("class","btn enabled")
				.on("click",function(){
					d3.select("#butt")
						.style("display","none")
					loader.close();
					d3.selectAll(".closed").style("display","block");
			})
		

	}
	else {
		
		d3.select("#butt")
			.attr("class","btn disabled")
			.on("click","")
	}
			
}


/*d3.select("#flip")
	.on("click",function(){
		d3.select("#card")
			.attr("class","flipped")
	})
*/

function setEqualHeight() 
{
	var h = d3.select("#visualization")
		.select("svg")
		.attr("height")
		
	d3.select("#layout-wrapper")
		.style("height",h+"px")
}




function initStructure(v){
	
	if (!raw.vis[v]) return false;
	
	vis = raw.vis[v]()
		.target("#visualization")
		.on("update",setEqualHeight)
		.data(data)
		//.update()
	
		d3.select("#structure")
			.selectAll("*").remove()
	
		d3.entries(vis.structure().map()).forEach(function(t){
			if (!raw.gui[t.value.type]) return;
			raw.gui[t.value.type]()
				.data(d3.keys(data[0]))
				.target("#structure")
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

	minLayoutHeight = d3.select("#layout-wrapper")
		.style("height")
	d3.select("#layout-wrapper")
		.style("min-height",function(){ return minLayoutHeight; })
		
	d3.select("#export-svg")
		.attr("class","btn enabled")
		.on("click",print)
		
	d3.select("#export-data")
		.attr("class","btn enabled")
		.on("click",exportData)
		

}


function updateParams(){
	
	d3.select("#set-layout")
		.selectAll("*").remove()
	d3.select("#layout-wrapper")
		.node().style.removeProperty("height")

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
				//vis.update();
			})
			.append()
	})
}



function print(e){
	
			
  var html = d3.select("#visualization").select("svg")
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
};


function exportData(e) {
	
	var json = JSON.stringify(vis.structure()(data));
	var content = d3.select("body").append("div")
        .attr("id", "tmp")
		.style("display","none")
        .html(json);
	
	var w = window.open("data:text/json;charset=utf-8," + json);
	//$(w.document.body).html(json);
	
	d3.select("#tmp")
		.remove()
}

