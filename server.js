const express = require('express');
const http = require('http');
const path = require('path');
const configGenerator = require('./configGenerator.js')

var app = express();

app.use(express.static(path.join(__dirname, 'src')));

/* serves main page  */
app.get('/', function (req, res) {
    // res.sendFile("src/index.html", {"root": __dirname});
});

app.get('/create', function (req, res) {
    console.log(req.query.url);
    let config = configGenerator(req.query.url)
    res.json(config);
});

var port = process.env.PORT || 9070;

http.createServer(app).listen(port, function(){
    console.log('Express server listening on port ' + port);
});
