'use strict';

var express = require('express');
var mongoose = require('mongoose');

var cors = require('cors');

// Import dot env file
require('dotenv').config();

var app = express();

// Connect to mongoose
const uri = process.env.MONGO_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Opened')
})


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
const { create, getShortUrl } = require('./controllers/url')

app.post("/api/shorturl/new", create);
app.get("/api/shorturl/:short_url?", getShortUrl);

// Basic Configuration 
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Node.js listening ...');
});