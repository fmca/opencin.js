//This script is auto-generated. Please don't change anything manually.

var endpoint_uri = "http://webproj04.cin.ufpe.br/sparql/";

var prefixs = {
    "cin": "http://www.cin.ufpe.br/opencin/"
}

//@response_format -> json | xml | csv | html | javascript | ntriples | spreadsheet | rdf/xml
function query(queryString, response_format, success_callback, error_callback) {
    var prefixString = "";
    for (prefix in prefixs) {
        prefixString += "PREFIX " + prefix + ": <" + prefixs[prefix] + "> \n";
    }

    queryString = "query=" + prefixString + queryString + "&format=" + response_format;

    getResult(endpoint_uri, queryString, success_callback, error_callback);
}


function getResult(endpoint, data, success_callback, error_callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            callback(xmlhttp.status == 200);
        }
    }

    function callback(success) {
        if (success) {
            var result = new Result(xmlhttp.responseText);
            success_callback(result);
        } else {
            error_callback(xmlhttp.responseText);
        }
    }


    xmlhttp.open("GET", endpoint + "?" + data, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1')
    xmlhttp.send();
}


function Result(queryResponse) {
    this.json = JSON.parse(queryResponse);
    //getTitle, getDesc, get.. are generated dinamically
}

//Generating all getters dinamically
['title', 'desc', 'queryValue', 'group'].forEach(function(property) {
    Result.prototype['get_' + property] = function() {
        try {
            return this.json.results.bindings[property]
        } catch (TypeError) {
            return null;
        }
    };
})

function get_academic(callback) {
    query("select ?teacher as ?title ?email as ?desc ?email as ?queryValue  where {?x rdf:type cin:academic . ?x cin:name ?teacher . ?x cin:email ?email} group by ?teacher order by ?teacher", "json", callback, alert);
}

function get_profile(arg, callback) {
    query("select ?title ?desc ?email as ?queryValue where { ?x rdf:type cin:academic . ?x cin:name ?nome . ?x cin:email '" + arg + "' . ?x cin:email ?email . ?x ?title ?desc . {?x cin:name ?desc} UNION    {?x cin:office ?desc } UNION {?x cin:phone ?desc} UNION {?x cin:lattes ?desc} UNION {?x cin:homepage ?desc} UNION {?x cin:email ?desc}} group by ?nome", "json", callback, alert);
}

function get_publications(arg, callback) {
    query("select ?type as ?title ?name as ?desc ?public as ?queryValue ?type as ?group where {?x cin:email '" + arg + "' . ?public ?idProfessor ?x . ?public rdf:type ?type . ?public cin:title ?name} group by ?name order by ?type", "json", callback, alert);
}

function get_publication(arg, callback) {
    query("select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <" + arg + "> ?prop ?val FILTER isLiteral(?val)}", "json", callback, alert);
}

function get_news(arg, callback) {
    query("select ?date as ?title ?tit as ?desc ?not as ?queryValue where {?not cin:cite ?doc . ?doc cin:email '" + arg + "' . ?not cin:date ?date . ?not cin:title ?tit} group by ?title order by ?title", "json", callback, alert);
}

function get_newsItem(arg, callback) {
    query("select distinct str(?prop) as ?title str(?val) as ?desc ?val as ?queryValue where { <" + arg + "> ?prop ?val FILTER isLiteral(?val)}", "json", callback, alert);
}

function get_orientations(arg, callback) {
    query("SELECT DISTINCT ?nome as ?title ?titulo as ?desc ?tese as ?queryValue ?t as ?group WHERE { ?tese rdf:type ?t . ?prof cin:email '" + arg + "'. ?aluno cin:isSupervisedBy ?prof . ?aluno cin:creator ?tese . ?tese cin:title ?titulo . ?aluno cin:name ?nome . ?aluno cin:email ?emailAluno}", "json", callback, alert);
}

function get_interestAreas(callback) {
    query("select ?ia as ?title ?ianame as ?desc ?ia as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaInterest ?ia . ?ia cin:name ?ianame} group by ?ianame order by ?desc", "json", callback, alert);
}

function get_expertiseAreas(callback) {
    query("select ?ea as ?title ?eaname as ?desc ?ea as ?queryValue where {?x rdf:type cin:academic . ?x cin:hasAreaExpertise ?ea . ?ea cin:name ?eaname} group by ?ea order by ?desc", "json", callback, alert);
}