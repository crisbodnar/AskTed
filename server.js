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

app.listen(3000, function() {
    console.log('App listening');
});

fs.watchFile('response.txt', function(current, previous) {
    var content;
    fs.readFile('response.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        content = data;
        console.log(data);
        var requestify = require('requestify');

        requestify.post('http://6adf8acb.ngrok.io/api/yelp', {
            search: content
        })
        .then(function(response) {
            // Get the response body (JSON parsed or jQuery object for XMLs)
            var rsp = response.getBody().answer.replace("'", "\\'");
            //console.log("hello");
            //console.log(response);
            console.log(rsp);
            exec('say '+rsp, function(error, stdout, stderr) {
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
