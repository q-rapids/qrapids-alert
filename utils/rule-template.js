
exports.simple_template = function(index, alerttype,name,thtype, value,evaluation_date, alert_handler)
{
  valuefilter = {}
  valuefilter[thtype] = value

  return ({
    active: true,
    index: index,
    condition:{
      "query": {
        "bool": {
          "must": [
            { "term" : { "evaluationDate" :  evaluation_date}},
            { "term" : { "name" : name}},
            { "range" : { "value" : valuefilter } }
          ]
        }
      }
    },
    action: function(esdata){
      if(alert_handler) return alert_handler({"esdata":esdata,
        "alerttype":alerttype,
        "name":name,
        "thtype":thtype, 
        "value":value,
        "evaluation_date":evaluation_date, 
        "category":index})
    }
  })
}  



