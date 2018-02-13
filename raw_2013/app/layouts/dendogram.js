/**
 * 
 * Dendogram
 *
 */
raw.layouts.dendogram = function(){
	return {

		id : 'dendogram',
		label : 'Dendogram',
		description : '...',
		model : raw.models.tree(),

		style : {

			width : {
				label : 'Width',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 800
			},

			height : {
				label : 'Height',
				type : 'number',
				position : 1,
				description : 'Width is whatever',
				value : 500
			},

			labels : {
				label : 'Labels',
				type : 'check',
				position : 2,
				description : 'Show labels',
				value : true
			},

			color : {
				label : 'Color',
				type : 'color',
				position : 2,
				description : 'Color sucks!',
				value : raw.diverging()
			}
		},

		render : function(data, target) {

			var model = this.model,
				style = this.style,
		        format = d3.format(",d");

		    var width = style.width.value,
    			height = style.height.value;

			var cluster = d3.layout.cluster()
    			.size([height, width - 160]);

			var diagonal = d3.svg.diagonal()
    			.projection(function(d) { return [d.y, d.x]; });

			var svg = target.append("svg")
    			.attr("width", width)
    			.attr("height", height)
  				.append("g")
   				.attr("transform", "translate(40,0)");
			
			var nodes = cluster.nodes(model.applyOn(data)),
			    links = cluster.links(nodes);

			var link = svg.selectAll(".link")
			    .data(links)
			    .enter().append("path")
			    .attr("class", "link")
			    .attr("d", diagonal)
			    .style("fill","none")
			    .style("stroke","#ccc")
			    .style("stroke-width","1.5px");

			var node = svg.selectAll(".node")
			    .data(nodes)
			    .enter().append("g")
			     	.attr("class", "node")
			      	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
			
			node.append("circle")
			    .attr("r", 4.5)
			    .style("fill","#fff")
			    .style("stroke","steelblue")
			    .style("stroke-width","1.5px");

			if (style.labels.value) {
				node.append("text")
				    .attr("dx", function(d) { return d.children ? -8 : 8; })
				    .attr("dy", 3)
				    .style("font-size","11px")
					.style("font-family","Arial, Helvetica, sans-serif")
				    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
				    .text(function(d) { return d.name; });
			}

		    return this;

		}
	}
};