const alertUtils = require('../utils/alerts.js');

exports.user_defined_rules = function(evaluation_date){ return([

{
  active: true,
  index: "_all",
  description: "Trigger an alarm whenever a threshold is exceeded",
  condition:{
    "query": {
      "bool": {
        "must": [
          { "term" : { "evaluationDate" :  evaluation_date}},
          { "term" : { "name" :  "Comment Ratio"}},
          { "range" : { "value" : {"lt": 0.7} } }
        ]
      }
    }
  },
  action:function(data){
    return alertUtils.CrateAlert(data.hits[0],"User Defined Rule", 0.7)
  }
},


])}


