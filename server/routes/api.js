var express = require('express');
var router = express.Router();
var request = require('request');
var yelp = require('node-yelp');

var configureYelp = function(searchString, callback) {

	//Use the API keys here
	var client = yelp.createClient({
  		oauth: {
    	"consumer_key": "aviPUJyViflvgJ8XQ9NRlQ",
    	"consumer_secret": "bo_Cj8tbZ-WhrbbnJTvmMDHFxqU",
    	"token": "UaasXYXCJu7dmEgVPwTgRGtY6AJ9rZDL",
    	"token_secret": "KM1VTKcmhXZ-CMnJcYK2vTwQp5c"
  		}
	});

	client.search({
  		terms: searchString,
  		location: "Manchester"
	}).then(function (data) {
  		//console.log(data);
  		callback(data);  
	});
}

var sendMessage = function(){
		// Twilio Credentials 
	var accountSid = 'AC49beb2b0ce8058005d7db2504507a09f'; 
	var authToken = '86bafd16b3b70d18e85e051fefddb6f1'; 
	 
	//require the Twilio module and create a REST client
	var twilio = require('twilio'); 
	var client = new twilio.RestClient(accountSid, authToken); 
	 
	client.sms.messages.create({
		to: '+447733645724',  
		from: '+441376350104',
		body: 'Merge fraiere!!!!'     
	}, function(err, message) { 
		if(!err)
			console.log(message.sid);
		else
			console.log(err); 
	});
}

router.post('/yelp', function(req, res, next) {

  var searchString = req.query.search;
  console.log(searchString);
  //replace spaces with +
  searchString.replace(' ', '+');

  configureYelp(searchString, function(data){
  	res.json(data);
  	sendMessage();
  });
});

module.exports = router;