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
  		console.log(data);
  		callback(data);  
	});
}

router.post('/yelp', function(req, res, next) {

  var searchString = req.query.fiction;
  console.log(searchString);
  //replace spaces with +
  searchString.replace(' ', '+');

  configureYelp(searchString, function(data){
  	res.json(data);
  });
});

module.exports = router;