require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const path = require('path');
const socketIO = require("socket.io");
const server = http.createServer(app);
const mongoUser = process.env.Mongo_User;
const mongoPassword = process.env.Mongo_Password;
const Factory = require("./backend/models/factory.js");
const helmet = require('helmet')


// Connect to mlab mongodb

// const db = `mongodb://${mongoUser}:${mongoPassword}@ds229552.mlab.com:29552/passportchallenge`;
const db = `mongodb://localhost:27017/factory`;

useMongoClient: true;
mongoose.Promise = global.Promise;
//connect and show any mongoose errors
mongoose.connect(db, { useNewUrlParser: true }, function(err) {
  if(err) {
      console.log('Error connecting');
  }
  else{
    console.log('Mongoose connection successful.')
  }
});


//security package of different middlewares
app.use(helmet())
// API file for interacting with MongoDB
const tree = require("./backend/routes/api.js");

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/frontend')));


app.use(bodyParser.json());
// API location


app.use("/tree", tree);



// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

//Set Port

var port = process.env.PORT || 4200;


module.exports.sendFactoryInfo = function() {
  Factory.find({}, function(err, info) {
    if(err) {
      console.log("there was an error", err);
      return;
    }
    //send to everyone
    io.emit("currentFactoryInfo", info);
  });
}

server.listen(port, () => console.log("connected and listening on port ", port));
