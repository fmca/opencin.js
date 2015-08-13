//This script is auto-generated. Please don't change anything manually.

var endpoint_uri = "http://webproj04.cin.ufpe.br/sparql/";

var prefixs = {
	"cin":"http://www.cin.ufpe.br/opencin/"
}

//@response_format -> json | xml | csv | html | javascript | ntriples | spreadsheet | rdf/xml
function query(queryString, response_format, success_callback, error_callback) {
	var prefixString = "";
	for (prefix in prefixs){
		prefixString += "PREFIX " + prefix + ": <"+prefixs[prefix]+"> \n";
	}

	queryString = "query="+prefixString+queryString+"&format="+response_format;

	getResult(endpoint_uri, queryString, success_callback, error_callback);
}


function getResult(endpoint, data, success_callback, error_callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
	           callback(xmlhttp.status == 200);
           }
        }

    function callback(success) {
        if(success){
          var result = new Result(xmlhttp.responseText);
          success_callback(result);
        }else{
          	error_callback(xmlhttp.responseText);
        }
    }


    xmlhttp.open("GET", endpoint+"?"+data, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1')
    xmlhttp.send();
}


function Result(queryResponse){
    this.json = JSON.parse(queryResponse);
    //getTitle, getDesc, get.. are generated dinamically
}

//Generating all getters dinamically
['title', 'desc', 'queryValue', 'group' ].forEach(function(property){
  Result.prototype['get_' + property] = function() {
      try{
        return this.json.results.bindings[property]
      }catch(TypeError){
        return null;
      }
  };
})
