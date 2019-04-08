var request = require('request');
var configfile = require('../config.json')

var  post_notificatino = function(obj){
	var serobj = {"elementet":obj};
	request({
                uri:"http://"+configfile.notification_service,
                method:"POST",
		json: obj
        }, function (error, response, body) {
		if(error) console.log(error);
		else console.log(JSON.stringify(serobj)+" set to " + configfile.notification_service)
		//iconsole.log(body);
		//console.log(response);
        });
}

exports.CrateAlert = function(data, atype, threshold){
	// {"element":{"id":3,"name":"test","type":"METRIC","value":1,"threshold":3,"category":"x"}}
	console.log(data);
	var o = {
		"element":{
			"id":data._id,
			"name":data._source.name,
			"type": atype,
			"category": data._source["factor"] || data._source["metric"] || data._source["strategic_indicator"] || "General",
			"value": data._source["value"],
			"threshold": threshold,
			"project_id": data._index.split(".")[1] || "unknown",
			//"artefacts": data._source || data
		}
	}

	console.log(o)
	post_notificatino(o)
	return o
}
