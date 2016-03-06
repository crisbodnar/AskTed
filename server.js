var express = require('express');
var fs = require('fs');
var request = require('request');
var http = require('http');
var exec = require('child_process').exec;

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.post('/listen', function(req, res) {
    exec('python ./speech_rec.py', function(error, stdout, stderr) {
        if (error) {
            console.log('Error: ', error);
        }
        if (stderr) {
            console.log('FileExecutable Error:', stderr);
        }
        console.log('Executed:', stdout);
        res.json({});
    });
});

app.listen(4000, function() {
    console.log('App listening');
});

fs.watchFile('response.txt', function(current, previous) {
    var content;
    fs.readFile('response.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        var url_path = 'api/bot';
        if (content.indexOf("drink") > -1 || content.indexOf("food") > -1) {
            url_path = 'api/yelp';
        }
        console.log(data);
        var requestify = require('requestify');

        requestify.post('http://6f1931b9.ngrok.io/'+url_path, {
            search: content
        })
        .then(function(response) {
            // Get the response body (JSON parsed or jQuery object for XMLs)
            rsp = response.getBody();
            if (response.getBody().answer) {
                rsp = response.getBody().answer.replace("\'", "'");
            }
            console.log(rsp);
            var reply;
            if (url_path === 'api/bot') {
                reply = 'say "'+rsp+'"';
            }
            else if (url_path === 'api/yelp') {
                reply = 'say "The best restaurant for you is '+rsp.name+' at '+rsp.location.display_address[0]+'"';
            }
            //console.log("hello");
            //console.log(response);
            console.log(reply);
            console.log(rsp);
            exec(reply, function(error, stdout, stderr) {
                if (error) {
                    console.log("Error:",error);
                }
                if (stderr) {
                    console.log("FileExecutable Error:", stderr);
                }
                console.log(stdout);
            });

        });

    });
    console.log('file changed');
});
