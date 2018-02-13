(function(){
	
	raw.io = {}
	
	/* Auto-detect delimiter, inspired by JosipK's C++ algorithm
	   http://www.codeproject.com/KB/cs/auto-detect-csv-separator.aspx */
	
	raw.io.detectDelimiter = function(string, delimiters){
		
		if (!arguments.length) return "";
		
		if (!delimiters)
			delimiters = [",",";","\t"]
		
		var rows,
			delimitersCount = delimiters.map(function(d){ return 0; }),
			character,
			characterCount = 0,
			row = 0,
			quoted = false,
			firstChar = true;
		
		rows = string.split("\n");

		for (row in rows) {
			
			if (rows[row].length > 0)
			for (var characterCount=0; characterCount < rows[row].length - 1; characterCount++) {

				character = rows[row][characterCount];

				switch(character) {

					case '"':
						if (quoted) {
							if (rows[row][characterCount+1] != '"')
								quoted = false;
							else
								characterCount++;
						}
						else {
							if (firstChar)
								quoted = true;
						}
						break;
						
					default:
						if (!quoted) {
							var index = delimiters.indexOf(character);
							if (index != -1)
							{
								delimitersCount[index]++;
								firstChar = true;
								continue;
							}
						}
						break;
				}
				if (firstChar)
					firstChar = false;
			}
		}

		var maxCount = d3.max(delimitersCount);
		return maxCount == 0 ? '\0' : delimiters[delimitersCount.indexOf(maxCount)];
	}
	

	raw.io.convert = function(c){
		if (!c)
			return;
		switch(c.charCodeAt(0))
		{
			case 9:
				return "\\t (tab)";
				break;
			case 44:
				return ", (comma)";
				break;
			case 59:
				return "; (semi-colon)";
				break;
			default:
				return c;
				break;
		}
	}
	
	
	raw.io.displayKeyCode = function(charCode){

		var string = ""
		string = String.fromCharCode(charCode);
		console.log(string)
		if (charCode == 8) string = "backspace"; //  backspace
		if (charCode == 9) string = "tab"; //  tab
		if (charCode == 13) string = "enter"; //  enter
		if (charCode == 16) string = "shift"; //  shift
		if (charCode == 17) string = "ctrl"; //  ctrl
		if (charCode == 18) string = "alt"; //  alt
		if (charCode == 19) string = "pause/break"; //  pause/break
		if (charCode == 20) string = "caps lock"; //  caps lock
		if (charCode == 27) string = "escape"; //  escape
		if (charCode == 33) string = "page up"; // page up, to avoid displaying alternate character and confusing people	         
		if (charCode == 34) string = "page down"; // page down
		if (charCode == 35) string = "end"; // end
		if (charCode == 36) string = "home"; // home
		if (charCode == 37) string = "left arrow"; // left arrow
		if (charCode == 38) string = "up arrow"; // up arrow
		if (charCode == 39) string = "right arrow"; // right arrow
		if (charCode == 40) string = "down arrow"; // down arrow
		if (charCode == 45) string = "insert"; // insert
		if (charCode == 46) string = "delete"; // delete
		if (charCode == 91) string = "left window"; // left window
		if (charCode == 92) string = "right window"; // right window
		if (charCode == 93) string = "select key"; // select key
		if (charCode == 96) string = "numpad 0"; // numpad 0
		if (charCode == 97) string = "numpad 1"; // numpad 1
		if (charCode == 98) string = "numpad 2"; // numpad 2
		if (charCode == 99) string = "numpad 3"; // numpad 3
		if (charCode == 100) string = "numpad 4"; // numpad 4
		if (charCode == 101) string = "numpad 5"; // numpad 5
		if (charCode == 102) string = "numpad 6"; // numpad 6
		if (charCode == 103) string = "numpad 7"; // numpad 7
		if (charCode == 104) string = "numpad 8"; // numpad 8
		if (charCode == 105) string = "numpad 9"; // numpad 9
		if (charCode == 106) string = "multiply"; // multiply
		if (charCode == 107) string = "add"; // add
		if (charCode == 109) string = "subtract"; // subtract
		if (charCode == 110) string = "decimal point"; // decimal point
		if (charCode == 111) string = "divide"; // divide
		if (charCode == 112) string = "F1"; // F1
		if (charCode == 113) string = "F2"; // F2
		if (charCode == 114) string = "F3"; // F3
		if (charCode == 115) string = "F4"; // F4
		if (charCode == 116) string = "F5"; // F5
		if (charCode == 117) string = "F6"; // F6
		if (charCode == 118) string = "F7"; // F7
		if (charCode == 119) string = "F8"; // F8
		if (charCode == 120) string = "F9"; // F9
		if (charCode == 121) string = "F10"; // F10
		if (charCode == 122) string = "F11"; // F11
		if (charCode == 123) string = "F12"; // F12
		if (charCode == 144) string = "num lock"; // num lock
		if (charCode == 145) string = "scroll lock"; // scroll lock
		if (charCode == 186) string = ";"; // semi-colon
		if (charCode == 187) string = "="; // equal-sign
		if (charCode == 188) string = ","; // comma
		if (charCode == 189) string = "-"; // dash
		if (charCode == 190) string = "."; // period
		if (charCode == 191) string = "/"; // forward slash
		if (charCode == 192) string = "`"; // grave accent
		if (charCode == 219) string = "["; // open bracket
		if (charCode == 220) string = "\\"; // back slash
		if (charCode == 221) string = "]"; // close bracket
		if (charCode == 222) string = "'"; // single quote
		
		return string;
	}
	

	// Parse data from csv
	raw.io.parse = function(strData, asObject, strDelimiter){
		
		var response = {}
		
		if (!strData) {
			response.status = "error";
			response.message = ["Uhm. Sorry, no data found."];
			return response;
		}
			
		if (!strDelimiter)
			strDelimiter = raw.io.detectDelimiter(strData);
		var objPattern = new RegExp(
			(
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
		);

		var arrData = [[]],
			arrMatches = null
							
		while (arrMatches = objPattern.exec( strData )){
			
			try {
				var strMatchedDelimiter = arrMatches[ 1 ];
					if (strMatchedDelimiter.length &&
						(strMatchedDelimiter != strDelimiter)
						){
							arrData.push( [] );
						}
					
					if (arrMatches[ 2 ]){
						var strMatchedValue = arrMatches[ 2 ].replace(
							new RegExp( "\"\"", "g" ),
							"\""
						);
					} else {
						var strMatchedValue = arrMatches[ 3 ];
					}
				arrData[ arrData.length - 1 ].push( strMatchedValue );
			
			} catch(e) {
				if (!response.message) response.message = []
				response.message.push(e.message)
			}
		}
		
		
		if (asObject) {
			var objData = [],
				header = arrData[0];
				
			for (var row=1; row<arrData.length; row++) {
				
				if(arrData[row].length == header.length) {
					var obj = {};
					for (var h in header){
						obj[header[h]] = arrData[row][h];
					}
					objData.push(obj);
				} else {
					if (!response.message) response.message = []
					response.message.push("whoops! Error in parsing line " + (row+1))
				}
			}
			if (!response.message) {
				response.status = "ok"
				response.result = objData;
				response.delimiter = strDelimiter;
			} else {
				response.status = "error"
				response.delimiter = strDelimiter;
			}
			return response;
		}
		
		if (!response.message) {
			response.status = "ok"
			response.result = arrData;
			response.delimiter = strDelimiter;
		} else {
			response.status = "error"
			response.delimiter = strDelimiter;
		}
		return response;
		
	}
	
})();