raw.models.relations = function(map){

	return {

		id : 'relations',
		label : 'Relations',

		structure : {
			sequence : {
				label : 'Sequence',
				accept : ['string','number'],
				single : false,
				unique : true,
				value : []
			}
		},

		map : map,

		applyOn : function(data) {

			var model = this,
				n = [],
				l = [],
				d = {};

			var sequence = model.structure.sequence.value.map(function(d){return d.key;})

			for (var i=0; i < sequence.length-1; i++ ) {

				var sg = sequence[i]
				var tg = sequence[i+1]
				var relations = d3.nest()
					.key(function(d) { return d[sg] } )
					.key(function(d) { return d[tg] } )
					.entries(data)

				relations.forEach(function(s){

					si = getNodeIndex(n, s.key, sg);

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
						//var value = map.value.value == "" ? t.values.length : d3.sum(t.values, function(d){ return parseFloat(d[map.value.value]); });
						var value = t.values.length;
						var link = { "source" : parseInt(si), "target" : parseInt(ti), "value" : value };
						l.push(link);
					})
				})
			}

			function getNodeIndex(array, name, group) {
				for (var i in array){		
					var a = array[i]
					if (a['name'] == name && a['group'] == group) {
						return i;
					}
				}
				return -1;
			}

			d.nodes = n;
			d.links = l;
			return d

		},

		isValid : function(){
			return this.structure.sequence.value.length > 0;
		}
	};
}