var express = require('express');
var router = express.Router();
var request = require('request');
var Yelp = require('yelp');

var configureYelp = function(searchString, callback) {

    var yelp = new Yelp({
      consumer_key: 'aviPUJyViflvgJ8XQ9NRlQ',
      consumer_secret: 'bo_Cj8tbZ-WhrbbnJTvmMDHFxqU',
      token: 'UaasXYXCJu7dmEgVPwTgRGtY6AJ9rZDL',
      token_secret: 'KM1VTKcmhXZ-CMnJcYK2vTwQp5c',
    });

	yelp.search({
  		term: searchString,
  		location: "Manchester, UK",

	}).then(function (data) {
  		//console.log(data);
  		callback(data);
	});
};

var sendMessage = function(result){
		// Twilio Credentials
	var accountSid = 'AC49beb2b0ce8058005d7db2504507a09f';
	var authToken = '86bafd16b3b70d18e85e051fefddb6f1';

	//require the Twilio module and create a REST client
	var twilio = require('twilio');
	var client = new twilio.RestClient(accountSid, authToken);

    var text = 'Here are a couple of restaurants you might like: ';
           text += '\n' + '1.' + result[0].name + ' ' + result[0].location.display_address[0];
           text += '\n' + '2.' + result[1].name + ' ' + result[0].location.display_address[0];

	client.sms.messages.create({
		to: '+447733645724',
		from: '+441376350104',
		body: text
	}, function(err, message) {
		if(!err)
			console.log(message.sid);
		else
			console.log(err);
	});
};

var cleverBot = function(searchString, callback){
	var cleverbot = require('cleverbot.io');
	bot = new cleverbot("i34acQJ3CVN81j5S", "9DkDuNrnlfqbgUUDGr253nzzElaJjBal");

	bot.setNick("sessionname");


	//bot is created here
	bot.create(function (err, session) {
		//Ask the bot something
  		bot.ask(searchString, function (err, response) {
  			console.log("The AI response: " + response);
            callback(response);
		});
	});
};

var processYelpData = function(data){
    var result = [];
    for(var index = 0; index < 3 && index < data.length; index++){
        var restaurant = {};
        restaurant.rating = data[index].rating;
        restaurant.name = data[index].name;
        restaurant.location = data[index].location;
        console.log(restaurant.location);
        result.push(restaurant);
    }
    return result;
};

router.post('/yelp', function(req, res, next) {
  var searchString = req.body.search;
  console.log(searchString);
  //replace spaces with +
  searchString.replace(' ', '+');

  configureYelp(searchString, function(data){
    console.log(data.businesses);
    yelpData = processYelpData(data.businesses);
    console.log('++++++++++++++++++++++++++++++');
    sendMessage(yelpData);
    //console.log(yelpData);
    res.json(yelpData[0]);
  });
});

router.post('/bot', function(req, res, next){
    var searchString = req.body.search;
    console.log(searchString);

    cleverBot(searchString, function(response){
        res.json({answer: response});
    });
});

module.exports = router;
