(function(){
	
	raw.structure = {}
	
	raw.structure.net = function(){

		var map = {
				source : {
					label : "Source",
					value : "",
					type : "list",
					multiple : false,
					description : "From the top to the bottom."
				},
				target : {
					label : "Target",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				},
				value : {
					label : "Value",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				}/*,
				data : {
					label : "Name",
					value : "",
					type : "Text",
					description : "I have no idea <a href='www.google.com'>dasdas</a>"
				},*/
			}/*,
			param = {
				delimiter : {
					label : "Delimiter",
					value : ".",
					type : "Character",
					description : "I have no idea"
				}
			}*/
		
		function getNodeIndex(array, name, group) {
			for (var i in array){		
				var a = array[i]
				if (a['name'] == name && a['group'] == group) {
					return i;
				}
			}
			return -1;
		}

		function net(array){

			var n = [],
				l = [],
				d = {};
			
			// From sankey...
			var sequence = [ map.source.value, map.target.value ];

			for (var i=0; i < sequence.length-1; i++ ) {
				var sg = sequence[i]
				var tg = sequence[i+1]
				var relations = d3.nest()
							 .key(function(d) { return d[sg] } )
							 .key(function(d) { return d[tg] } )
							 .entries(array)

				relations.forEach(function(s){

					si = getNodeIndex(n, s.key, sg)
					if ( si == -1) {
						n.push({ "name" : s.key, "group" : sg })
						si = n.length-1;
					}

					s.values.forEach(function(t){
						ti = getNodeIndex(n, t.key, tg)
						if (ti == -1) {
							n.push({ "name" : t.key, "group" : tg })
							ti = n.length-1;
						}
						var value = map.value.value == "" ? t.values.length : d3.sum(t.values, function(d){ return parseFloat(d[map.value.value]); });
						l.push({ "source" : parseInt(si), "target" : parseInt(ti), "value": value  })
					})
				})
			}

			d.nodes = n;
			d.links = l;

			return d
		}


		net.map = function(name, value){
			if (!arguments.length) return map;
			map[name].value = value;
			return net;
		}

		return net;

		
	}
		
	raw.structure.tree = function() {
		
		var map = {
				path : {
					label : "Hierarchy",
					value : "",
					type : "list",
					multiple : true,
					description : "From the top to the bottom."
				},
				size : {
					label : "Size",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				},
				color : {
					label : "Color",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				}
			}
		
		function tree(list){
			try {
				var t = { children:[] };
				var classes = map.path.value;
				list.forEach(function(d){
					var path = map.path.value.map(function(p){ return d[p]; })//d[map.path.value].split(param.delimiter.value);
					var leaf = seek(t, path, classes);
					if (leaf !== false) {
						if (!leaf.value) leaf.value = 0
						// Assign the size to the leaf
						//leaf.value += map.size.value ? parseFloat(d[map.size.value]) : 1;
						if (map.size.value) {
							if ( !isNaN(parseFloat(d[map.size.value])) )
								leaf.value += parseFloat(d[map.size.value]);
							else leaf.value += 0;
						} else leaf.value += 1;
						//console.log(leaf.value)
						// Assign the color to the leaf
						leaf.color = map.color.value ? d[map.color.value] : null;	
						delete leaf.children;
						//leaf.children.push( { name: d[map.path.value[map.path.value.length-1]], size: parseFloat(d[map.size.value]) /*, _data: d[map.data.value]*/ } );
					}
				})
				return t;
			}
			catch(err){
				return false;
			}
		}

		tree.map = function(name, value){
			if (!arguments.length) return map;
			map[name].value = value;
			return tree;
		}

		tree.param = function(name, value){
			if (!arguments.length) return param;
			param[name].value = value;
			return tree;
		}
				
		// function to populate the tree {name,classes,children[]}
		function seek(t, path, classes) {
			if (path.length < 1)
				return false;
			var p = t.children.filter(function(d){ return d.name == path[0] ? true : false; })[0]
			if (!p) {
				p = { name: path[0], class:classes[0], children:[] };	
				t.children.push(p);
			}
			if (path.length == 1) return p;
			else return seek(p, path.slice(1), classes.slice(1));
		}

		return tree;
	}
		
	raw.structure.points = function() {
		
		var map = {
				x : {
					label : "X Axis",
					value : "",
					type : "list",
					multiple : false,
					description : "From the top to the bottom."
				},
				y : {
					label : "Y Axis",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				},
				size : {
					label : "Size",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				},
				color : {
					label : "Color",
					value : "",
					type : "list",
					multiple : false,
					description : "I have no idea"
				}
			}
		
		function points(list){
			try {
				var t = [];
				list.forEach(function(d){
					var obj = {};
					obj['x'] = d[map.x.value] ? parseFloat(d[map.x.value].replace(",",".")) : 0;
					obj['y'] = d[map.y.value] ? parseFloat(d[map.y.value].replace(",",".")) : 0;
					obj['size'] = d[map.size.value] ? parseFloat(d[map.size.value].replace(",",".")) : 0;
					obj['color'] = d[map.color.value];
					t.push(obj);
				})
				
				return t;
				
			}
			catch(err){
				return false;
			}
		}

		points.map = function(name, value){
			if (!arguments.length) return map;
			map[name].value = value;
			return points;
		}

		return points;
		
	}
	
})();