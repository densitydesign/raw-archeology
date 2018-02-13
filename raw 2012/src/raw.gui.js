(function(){
	
	raw.gui = {};
	
	raw.gui.loader = function(){
		
		var loader = {},
			target,
			data,
			autoDelimiter = true,
			delimiter,
			event = d3.dispatch(
				"change",
				"parse"
			)
		
		loader.close = function() {
		
			d3.select(target)
				.select("#load-main")
				.transition()
				.style("height","auto")
			
			d3.select(target)
				.select("#load-collapse")
				.style("display","none")
			
			var loadHeader = d3.select(target)
				.select("#load-header")
				.style("display","block")
			
			loadHeader.selectAll("ul")
				.remove()
			
			var l = loadHeader.append("ul")
				.attr("class","load-header-ul")

			l.selectAll("li.drg")
				.data(d3.keys(data[0]))
				.enter().append("li")
				.attr("class","drg")
				.text(function(d){ return d; })
				.attr("title",function(d){ return d; })
			
			$( ".load-header-ul li" ).draggable({
				helper:"clone",
				connectToSortable:".droptarget"
			});
			
			$( l.node() ).droppable({
				connectWith:".droptarget",
				accept:"ul.droptarget li",
				drop:function(e,ui){
					if(d3.select(e.target).selectAll("li")[0].map(function(d){return d.innerHTML;}).indexOf(ui.draggable[0].innerHTML)!=-1)
						$(ui.draggable[0]).remove()
					}
			})
			
			//$( ".load-header-ul" ).disableSelection();
			$( ".drg" ).disableSelection();
		}
		
		loader.append = function() {
			
			// The loader wrapper
			var loadWrapperDiv = d3.select(target)
				.append("div")
				.attr("id","load-wrapper")
			
			// The main loader
			var loadDiv = loadWrapperDiv.append("div")
				.attr("id","load-main")
			
			// The header
			var loadHeaderDiv = loadDiv.append("div")
				.attr("id","load-header")
			
			// The collapsable part
			var loadCollapseDiv = loadDiv.append("div")
				.attr("id","load-collapse")
			
			var loadOptionsDiv = loadWrapperDiv.append("div")
				.attr("id","load-options")
			
			var loadTextarea = loadCollapseDiv
				.append("textarea")
				.attr("id","load-text")
				.attr("class","collapse lined")
				.on("change", parse)
				.on("keyup", parse)
			
			// Message
			var loadMessageDiv = loadCollapseDiv.append("div")
				.attr("id","load-message")
				.attr("class","collapse")
			
			var loadMessageUl = loadMessageDiv.append("ul")
				.attr("id","load-message-ui")
			
			// Enabling tabs into textareas
			$("#load-text").tabby();
			// Auto size textarea
			//$("#load-text").autogrow()
			// Enabling codelines
			//$(".lined").linedtextarea();
			// Spitting div
			//$("#load-collapse").splitter({type: 'h', sizeTop: true});
			// Scrollbars
			$('#load-message').jScrollPane(
				{
					verticalDragMinHeight: 20,
					verticalGutter: 5
				}
			);
			
		
			function parse(){
				
				event.change();
				var response = autoDelimiter? raw.io.parse(loadTextarea.property("value"),true) : raw.io.parse(loadTextarea.property("value"),true,delimiter)
				
				event.parse(response);
				
				loadMessageUl
					.selectAll("li")
					.remove()
				
				if (response.status == "ok"){
					loadMessageDiv
						.attr("class","status-ok")
					loadMessageUl
						.append("li")
						.html("Data successfully imported.")
					
					data = response.result;

				} else {
					
					loadMessageDiv
						.attr("class","status-error")
					loadMessageUl
						.selectAll("li")
						.data(response.message)
							.enter()
							.append("li")
							.html(function(d){ return d; })
				}	
				
				
				api = $('#load-message').data('jsp')
				api.reinitialise();
				
					
			}
			
			return loader;
		}
		
		
		loader.update = function() {
			$('#load-message').data('jsp').reinitialise();
			return loader;
		}
		
		loader.data = function() {
			return data;
		}
		
		loader.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return loader;
		}
		
		loader.autoDelimiter = function(x) {
			if (!arguments.length) return autoDelimiter;
			autoDelimiter = x;
			return loader;
		}
		
		loader.delimiter = function(x) {
			if (!arguments.length) return delimiter;
			delimiter = x;
			return loader;
		}
		
		loader.on = function(type, listener) {
			event.on(type,listener)
			return loader;
		}
		
		return loader;
		
	}
	
	raw.gui.list = function(){
		
		var list = {},
			data,
			target,
			label,
			multiple = false,
			value = function(d){ return d; },
			tip,
			event = d3.dispatch(
				"change",
				"load"
				)
		
		list.append = function() {
						
			$( ".ui-draggable" ).disableSelection();
			
			var div = d3.select(target)
				.append("div")
				.attr("class","list-div")

			if (label) div.append("p")
				.attr("class","list-label")
				.text(function(){ return label; })
			
			var sortable = div.append("ul")
				.attr("class","droptarget")
				
			$( sortable.node() ).sortable({
				placeholder: 'placeholder',
				tolerance:"pointer",
				connectWith:".load-header-ul",
				update : function(e,ui){
					if (multiple)
						event.change(d3.select(e.target).selectAll("li")[0].map(function(d){return d.innerHTML;}))
					else 
						event.change(d3.select(e.target).selectAll("li")[0].map(function(d){return d.innerHTML;})[0])
					
					},
					
				receive : function(e,ui){
						if (!multiple) {
							var val = d3.select(e.target).selectAll("li")[0]
							if (val.length>0){
								for (var i =0; i < val.length; i++)
									if(d3.select(val[i]).attr("class").indexOf("placeholder") == -1)
										d3.select(val[i]).remove()
							}
						$(ui.item).clone().appendTo(e.target)
						
						}
				},
				start:function(e,ui){
					
					//d3.select(e.target).selectAll("li")[0].forEach(function(d){console.log(d3.select(d))})
					
					if (multiple) {
						var indices = [];
						var idx = d3.select(e.target).selectAll("li")[0].map(function(d){return d.innerHTML;}).indexOf(ui.item[0].innerHTML);
						while (idx != -1) {
						    indices.push(idx);
						    idx = d3.select(e.target).selectAll("li")[0].map(function(d){return d.innerHTML;}).indexOf(ui.item[0].innerHTML, idx+1);
						}
						if(indices.length > 1){
							d3.select(ui.item[0]).remove()
						}					
					}
					
				}
			})
			
			/*$('.list-div').jScrollPane(
				{
					verticalDragMinHeight: 20,
					verticalGutter: 5
				}
			);*/
			
			
		}
		
		
		list.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return list;
		}

		list.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return list;
		}

		list.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return list;
		}

		list.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return list;
		}

		list.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return list;
		}
		
		list.multiple = function(x) {
			if (!arguments.length) return multiple;
			multiple = x;
			return list;
		}

		list.on = function(type, listener) {
			event.on(type,listener)
			return list;
		}	

		return list;
		
		
	}
		
	raw.gui.check = function(){
		
		var check = {},
			data,
			value,
			target,
			label,
			tip,
			event = d3.dispatch(
				"change",
				"load"
				)
		
		check.append = function() {
						
			var div = d3.select(target)
				.append("div")
				.attr("class","check-div")
				
			if (label) div.append("p")
				.attr("class","check-p label")
				.html(function(){ return label; })
						
			var c = div.append("input")
				.attr("class","check-options")
				.attr("type","checkbox")
				.on("change", function() { event.change(c.node().checked); })
				
			if (value)
				c.attr("checked",true)
			
			//event.load(c.node().checked);
		}
		
		check.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return check;
		}

		check.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return check;
		}

		check.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return check;
		}

		check.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return check;
		}

		check.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return check;
		}

		check.on = function(type, listener) {
			event.on(type,listener)
			return check;
		}	
		
		return check;
	}
	
	raw.gui.number = function(){
		
		var number = {},
			data,
			value,
			target,
			label,
			tip,
			event = d3.dispatch(
				"change",
				"load"
				)
		
		number.append = function() {
			
			var div = d3.select(target)
				.append("div")
				.attr("class","number-div")
				
			if (label) div.append("p")
				.attr("class","number-p label")
				.html(function(){ return label; })
						
			var t = div.append("input")
				.attr("class","number-options")
				.attr("type","text")
				.on("change", function() { event.change(t.node().value); })
				.on("keyup", function() { event.change(t.node().value); })
				.attr("value",value)
			
			event.load(t.node().value);
		}
		
		number.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return number;
		}

		number.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return number;
		}

		number.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return number;
		}

		number.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return number;
		}

		number.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return number;
		}

		number.on = function(type, listener) {
			event.on(type,listener)
			return number;
		}	
		
		return number;
	}
	
	raw.gui.select2 = function(){
		
		var select = {},
			data,
			target,
			label,
			tip,
			value = function(d){ return d; },
			text = function(d){ return d; },
			event = d3.dispatch(
				"change",
				"load"
			)

		select.append = function() {

			var open = false;
			
			d3.select(target)
				.selectAll(".select-div")
				.remove()

			var div = d3.select(target)
				.append("div")
				.attr("class","select-div")

			if (label) div.append("span")
				.attr("class","select-span btn drop")
				.html(function(){ return label; })
				.on("click",update)

			var menu = div.append("ul")
				.attr("class","select-ul dd-menu")
			
			menu.selectAll("li")
				.data(data)
				.enter().append("li")
				.attr("class", function(d,i){ return i == d3.entries(data).length-1 ? "dd-item last" : "dd-item" } )
					.html(text)
					.on("click", function(d){
						
						d3.selectAll(".dd-item")
							.attr("class",function(d,i){ return i == d3.entries(data).length-1 ? "dd-item last" : "dd-item" })
						
						d3.select(d3.event.target)
							.attr("class","dd-item selected")
						d3.select(".select-span")
							.html(d.label)
						
						event.change(d.name)
				})
			
			
			
			function update(){
				
				
				if (!open) {
					d3.select(".dd-menu")
						.style("display","block")
				}	
				else {
					d3.select(".dd-menu")
						.style("display","none")
				}
				
				open = !open;
				
				d3.event.stopPropagation();
				
				
			}
			
			d3.select("body")
				.on("click",function(){
					
					d3.select(".dd-menu")
						.transition()
						.style("display","none")
					open = false;
				})
			
		}
		
		

		select.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return select;
		}

		select.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return select;
		}

		select.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return select;
		}

		select.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return select;
		}

		select.text = function(x) {
			if (!arguments.length) return text;
			text = x;
			return select;
		}

		select.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return select;
		}

		select.on = function(type, listener) {
			event.on(type,listener)
			return select;
		}

		return select;
		
		

		
		
	}
	
	raw.gui.select = function(){
		
		var select = {},
			data,
			target,
			label,
			tip,
			value = function(d){ return d; },
			text = function(d){ return d; },
			event = d3.dispatch(
				"change",
				"load"
			)
		
		select.append = function() {
			
			d3.select(target)
				.selectAll(".select-div")
				.remove()
			
			var div = d3.select(target)
				.append("div")
				.attr("class","select-div")
				
			if (label) div.append("p")
				.attr("class","select-p")
				.html(function(){ return tip ? label + "<tip> (" + tip + ")</tip>" : label})
						
			var s = div.append("select")
				.attr("class","select-options")
				.on("change", function() { event.change(s.node().value); })
			s.selectAll("option")
				.data(data)
				.enter().append("option")
				.attr("value", value)
				.text(text)
			
			
			event.load(s.node().value);
		}
		
		select.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return select;
		}
		
		select.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return select;
		}
		
		select.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return select;
		}
		
		select.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return select;
		}
		
		select.text = function(x) {
			if (!arguments.length) return text;
			text = x;
			return select;
		}
		
		select.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return select;
		}
		
		select.on = function(type, listener) {
			event.on(type,listener)
			return select;
		}
		
		return select;
	}

	raw.gui.radio = function(){
		
		var radio = {},
			data,
			group,
			target,
			label,
			tip,
			event = d3.dispatch(
				"change",
				"load"
				)
		
		radio.append = function() {
			
			var div = d3.select(target)
				.append("div")
				.attr("class","radio-div")
				
			if (label) div.append("p")
				.attr("class","radio-label label")
				.html(function(){ return label; })
						
			var options = div.selectAll("input")
				.data(data)
				.enter().append("input")
				.attr("class","radio-option")
				.attr("type","radio")
				.attr("value", function(d){ return d; })
				.attr("name", function(){ return group; })
				.on("change", function(){ event.change(change()); })
				.append("span")
				.attr("class","radio-option-label")
				.html(function(d){ return d; })
			
			// first option as the default
			div.select("input").attr("checked","true")
			event.load(change());
			
			
			function change(){
				
				return $(".radio-option:checked")[0].value;
			}
		}
		
		radio.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return radio;
		}

		radio.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return radio;
		}

		radio.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return radio;
		}

		radio.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return radio;
		}

		radio.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return radio;
		}

		radio.group = function(x) {
			if (!arguments.length) return group;
			group = x;
			return radio;
		}

		radio.on = function(type, listener) {
			event.on(type,listener)
			return radio;
		}	
		
		return radio;
		
	}
	
	raw.gui.picker = function() {
		
		var picker = {},
			target,
			x = 0,
			y = 0,
			defaultColor = "#dddddd",
			event = d3.dispatch(
				"change"
			)
		
		picker.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return picker;
		}
		
		picker.defaultColor = function(x) {
			if (!arguments.length) return defaultColor;
			defaultColor = x;
			return picker;
		}
		
		picker.on = function(type, listener) {
			event.on(type,listener)
			return picker;
		}
		
		picker.x = function(newx) {
			if (!arguments.length) return x;
			x = newx;
			return picker;
		}
		
		picker.y = function(newy) {
			if (!arguments.length) return y;
			y = newy;
			return picker;
		}
		
		
		picker.close = function() {
			d3.select(target)
				.select(".picker-div")
				.transition()
				.style("opacity", 0)
				.remove()
			
		}
		
		picker.append = function() {
			
			// delete other pickers, if exist...
			d3.select(target)
				.select(".picker-div")
				.remove()
			
			var pickerDiv = d3.select(target)
				.append("div")
				.attr("class", "picker-div")
				.style("left", function() {return x.toString() + "px"} )
				.style("top", function() {return y.toString() + "px"})
				.style("opacity",0)
				
				
			pickerDiv.append("div")
				.append("div")
				.attr("class","picker-swatch")
			
			pickerDiv.append("span")
				.attr("class","picker-label")
				.text("Hue")
			pickerDiv.append("div")
				.attr("class","picker-slider picker-h")
				
			pickerDiv.append("span")
				.attr("class","picker-label")
				.text("Saturation")
			pickerDiv.append("div")
				.attr("class","picker-slider picker-s")

			pickerDiv.append("span")
				.attr("class","picker-label")
				.text("Luminosity")
			pickerDiv.append("div")
				.attr("class","picker-slider picker-b")
			
			pickerDiv.append("input")
				.attr("class","picker-text")
				.attr("type","text")
				.on("change",refreshAll)
				.on("keyup",refreshAll)
			
			pickerDiv.append("div")
				.attr("class","picker-button btn")
				.on("click",picker.close)
				.html("Ok")
				
				
			$(".picker-slider").slider({
				orientation: "horizontal",
				slide: refreshSwatch,
				//change: refreshSwatch
			})
			
			$(".picker-h").slider({
				min:"0",
				max:"360"
			})
			
			$(".picker-s").slider({
				min:"0",
				max:"100"
			})
			
			$(".picker-b").slider({
				min:"0",
				max:"100"
			})
			
			refreshAll(defaultColor);
			
			pickerDiv.transition()
				.style("opacity",1)
			
			
			function refreshSliders() {
				
				
				var h = parseInt($(".picker-h").slider("value"));
				var s = parseInt($(".picker-s").slider("value"))/100;
				var b = parseInt($(".picker-b").slider("value"))/100;

				// Updating the swatch
				d3.select(".picker-swatch")
					.style("background-color",d3.hsl(h,s,b).toString())
				// Updating the Saturation picker
				d3.select(".picker-s")
					.style("background", "-webkit-linear-gradient(left," + d3.hsl(h,0,b).toString() + " 0," + d3.hsl(h,1,b).toString() + " 100%)")
					.style("background", "-moz-linear-gradient(left," + d3.hsl(h,0,b).toString() + " 0," + d3.hsl(h,1,b).toString() + " 100%)")
					.style("background", "-o-linear-gradient(left," + d3.hsl(h,0,b).toString() + " 0," + d3.hsl(h,1,b).toString() + " 100%)")
					.style("background", "-ms-linear-gradient(left," + d3.hsl(h,0,b).toString() + " 0," + d3.hsl(h,1,b).toString() + " 100%)")
					.style("filter", "progid:DXImageTransform.Microsoft.gradient(startColorstr='"+ d3.hsl(h,0,b).toString() +"',endColorstr='#"+ d3.hsl(h,1,b).toString() +"',GradientType=1)");
				// Updating the Brightness picker
				d3.select(".picker-b")
					.style("background", "-webkit-linear-gradient(left," + d3.hsl(h,s,0).toString() + " 0," + d3.hsl(h,s,1).toString() + " 100%)")
					.style("background", "-moz-linear-gradient(left," + d3.hsl(h,s,0).toString() + " 0," + d3.hsl(h,s,1).toString() + " 100%)")
					.style("background", "-o-linear-gradient(left," + d3.hsl(h,s,0).toString() + " 0," + d3.hsl(h,s,1).toString() + " 100%)")
					.style("background", "-ms-linear-gradient(left," + d3.hsl(h,s,0).toString() + " 0," + d3.hsl(h,s,1).toString() + " 100%)")
					.style("filter", "progid:DXImageTransform.Microsoft.gradient(startColorstr='"+ d3.hsl(h,s,0).toString() +"',endColorstr='#"+ d3.hsl(h,s,1).toString() +"',GradientType=1)");
				
			}
			
			function refreshAll(c) {

				var text = d3.select(".picker-text")
					.property("value")
								
				if (c) text = c;
				
				$(".picker-h").slider({
					value:d3.hsl(text).h
				})
				
				$(".picker-s").slider({
					value:d3.hsl(text).s*100
				})
				
				$(".picker-b").slider({
					value:d3.hsl(text).l*100
				})
				
				// Updating the swatch
				d3.select(".picker-swatch")
					.style("background-color",d3.hsl(text))
			
				refreshSliders()
				
				// Updating the text input
				d3.select(".picker-text")
					.property("value", text)
				
				event.change(d3.hsl(text).toString())
				
			}
			
			
			
			function refreshSwatch() {
				
				var h = parseInt($(".picker-h").slider("value"));
				var s = parseInt($(".picker-s").slider("value"))/100;
				var b = parseInt($(".picker-b").slider("value"))/100;

				// Updating the swatch
				d3.select(".picker-swatch")
					.style("background-color",d3.hsl(h,s,b).toString())
				// Updating the Saturation picker
				d3.select(".picker-s")
					.style("background",
						 "-webkit-linear-gradient(left," + d3.hsl(h,0,b).toString() + " 0," + d3.hsl(h,1,b).toString() + " 100%)"
					)
				// Updating the Brightness picker
				d3.select(".picker-b")
					.style("background",
						 "-webkit-linear-gradient(left," + d3.hsl(h,s,0).toString() + " 0," + d3.hsl(h,s,1).toString() + " 100%)"
					)
				
				// Updating the text input
				d3.select(".picker-text")
					.property("value", d3.hsl(h,s,b).toString())
				
				event.change(d3.hsl(h,s,b).toString())
				
			}
			
			return picker;
			
		}
		
		
		return picker;
		
	}

	raw.gui.colorlist = function() {
		
		var colorlist = {},
			data,
			target,
			label,
			value = function(d){ return d; },
			tip,
			event = d3.dispatch(
				"change",
				"load"
				)
		
		colorlist.append = function() {
			
					
			var listDiv = d3.select(target)
				.append("div")
				.attr("class","colorlist-div")
			
			var listUl = listDiv.append("ul")
				.attr("class","colorlist-ul")
			
			listUl.selectAll("li")
				.data(d3.entries(data))
				.enter().append("li")
					.attr("class", function(d,i){ return i == d3.entries(data).length-1 ? "colorlist-li last" : "colorlist-li" } )
					
			listUl.selectAll("li").
				append("div")
				.html(function(d){ return d.key; })
				.attr("class","colorlist-li-span")
			
			listUl.selectAll("li").
				append("div")
				.attr("class", "colorlist-li-div" )
				.style("background-color",function(d){ return d.value; })
				.style("border-color",function(d){ return d3.rgb(d.value).darker(); })
				.on("click",function(d){
					openColorPicker(d3.event,d)
					}
				)
			
			listUl.selectAll("li").
				append("div")
				.attr("class","clear")
			
			
			$('.colorlist-div').jScrollPane(
				{
					verticalDragMinHeight: 20,
					verticalGutter: 5
				}
			);
						
			event.change(data);
			
			
			function openColorPicker(e,item) {
				
				var picker = raw.gui.picker()
					.target("body")
					.x(e.pageX+30)
					.y(e.pageY)
					.defaultColor(item.value)
					.on("change",function(d){
						item.value = d;
						data[item.key] = item.value;
						d3.select(e.target)
							.style("background-color",d)
							.style("border-color", d3.rgb(d).darker())
						
						event.change(data);
					})
					.append()
								
			//	$("body").click(picker.close())
				
			}
			
		}
		
		
		colorlist.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return colorlist;
		}

		colorlist.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return colorlist;
		}

		colorlist.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return colorlist;
		}

		colorlist.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return colorlist;
		}

		colorlist.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return colorlist;
		}
		
		colorlist.multiple = function(x) {
			if (!arguments.length) return multiple;
			multiple = x;
			return colorlist;
		}

		colorlist.on = function(type, listener) {
			event.on(type,listener)
			return colorlist;
		}	

		return colorlist;	
	}

	raw.gui.color = function(){
		
		var color = {},
			data, // some data to pass to the function
			target, // the target
			colors, // 
			label, // the label text
			value, // the value function
			tip, // a brief description
			event = d3.dispatch(
				"change"
			)
		
		color.data = function(x) {
			if (!arguments.length) return data;
			data = x;
			return color;
		}
		
		color.value = function(x) {
			if (!arguments.length) return value;
			value = x;
			return color;
		}
		
		color.target = function(x) {
			if (!arguments.length) return target;
			target = x;
			return color;
		}
		
		color.label = function(x) {
			if (!arguments.length) return label;
			label = x;
			return color;
		}
		
		color.tip = function(x) {
			if (!arguments.length) return tip;
			tip = x;
			return color;
		}
		
		color.on = function(type, listener) {
			event.on(type,listener)
			return color;
		}
		
		color.append = function() {
			
			var colorDiv = d3.select(target)
				.append("div")
				.attr("class","color-div")
			
			var radioDiv = colorDiv
				.append("div")
				.attr("class","color-radio-div")
			
			var colorOptionsDiv = colorDiv
				.append("div")
				.attr("class","color-options-div")
			
			colors = raw.colors.diverging(data().length)
			
			data().forEach(function(d){
				colors(d);
			})
			
			raw.gui.radio()
				.label("Color")
				.target(".color-radio-div")
				.data(["Categories","Values"])
				.group("color")
				.on("change",update)
				.on("load",update)
				.append()
			
			
			function update(o){
				
				
				d3.select(".color-options-div")
					.selectAll("*").remove()
								
				if ( o == "Categories" ) {
					
					raw.gui.colorlist()
						.target(".color-options-div")
						.data(colors.values())
						.on("change",function(c){ event.change(
							function(x){ 
								if (!x) return d3.keys(c);
								return c[x]; 
							}) 
						})
						.append()
				}
				
			}
			
			
			return color;
		}
		
		return color;
		
	}
	
})();