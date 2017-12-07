// establish app framework
const express = require("express");
const app = express();

// database/dbmanagers
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const PORT = process.env.port || 3000;
mongoose.Promise = Promise

// Scraping tools
const cheerio = require("cheerio");
const request = require("request");

// handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// initializing body-parser and morgan
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// establishing our public folder as a static dir
app.use(express.static("public"));

// Database config
mongoose.connect("mongodb://localhost/3000");
const db = mongoose.connection;

// message issued upon failure to connect
db.on("error", function(error, resp){
	console.log('Mongoose Error.', resp);
});

// successful connect case
db.once("open", function() {
	console.log('Mongoose connection successful');
})

// app will utilize newsController.js routes
const routes = require("./controller/newsController.js");
app.use("/", routes)

// begin listening for server requests
app.listen(PORT, function(err, res) {
    if (err) {
        console.log('ERROR: ', err);
    } else {
        console.log('Connected on port: ' + PORT);
    }

})