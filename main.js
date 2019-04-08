const request = require('request');
const express = require('./gui/express.js')
const user_defined_rules = require('./rules/rules.js').user_defined_rules;
const simple_template = require('./utils/rule-template.js').simple_template;
var configfile = require('./config.json')
const moment = require('moment')
const alertUtils = require('./utils/alerts.js');


//var evaluation_date = moment("2018-05-28").format('YYYY-MM-DD')
var evaluation_date = moment().subtract(0, 'days').format('YYYY-MM-DD')

const udef_rules = user_defined_rules(evaluation_date)


var elasticsearch = configfile.elasticsearch_url
var alerts = configfile.alerts

var alerts_collector = []

function req(rule, name){
	console.log(JSON.stringify(rule.condition))
	request(
		{	
			uri:"http://"+elasticsearch+"/"+rule.index+"/_search", method:"POST", 
			headers:{},
			json:rule.condition
		}, 
		function (error, response, body) {
			if (!error) {
				if(body && body.hits && body.hits.total > 0){
					console.log("-----"+name+"-----");
					var alert = rule.action(body.hits);
					alerts_collector.push(alert)
					console.log("-----");
				}
				else {
					console.log(name+": Returned Empty Result's Set")
				}
			}else{
				console.log("FATAL")
				console.log(error)
				console.log(body)
			}
		}
	)
}

function run_standart_rules(){
	for(var index in alerts){
		//console.log(index)
		for(var metric in alerts[index]){
			for(var thtype in alerts[index][metric]){
				//console.log("   "+metric + " " + thtype+ " " + alerts[index][metric][thtype])
				value = alerts[index][metric][thtype]
				ruletype = index.indexOf("metric")!=-1?"METRIC":index.indexOf("factor")!=-1?"FACTOR":"STRATEGIC_INDICATOR"
				r=simple_template(index, ruletype, metric, thtype, value, evaluation_date, function(alert){
					return alertUtils.CrateAlert(alert.esdata.hits[0],alert.alerttype,alert.value)
				})
				console.log(JSON.stringify(r))
				req(r,metric);
			}
		}
	}
}

function run_udef_rules(){
	for(var i in udef_rules){
		console.log(i + ' is active:' + udef_rules[i].active);
		if(udef_rules[i].active)req(udef_rules[i],"udef-rule-"+i);
	}
}


function loop(){
	alerts_collector = []
	
	run_standart_rules()
	run_udef_rules()
	
	express.set_aler_log(alerts_collector)
}


loop();
setInterval(loop, configfile.refresh_rate * 1000)



