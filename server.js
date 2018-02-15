const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
// scraping tools
const request = require("request");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 3000;

// initializing exphbspress-handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// accessing our models
const db = require("./models");

// Configuring our middleware (morgan/body-parser)
const bodyParser = require("body-parser");
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Managing Database
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsScraper", {
    useMongoClient: true
});


app.get('/', function(req, res) {
    res.render('index');
});

// Our Routes
app.get("/", function(req, res) {
    let result = [];

    request("http://www.breitbart.com/california/", function(err, res, html) {
        if (err) throw err;
        const $ = cheerio.load(html);
        $("h2 a").each(function(i, element) {

            let title = $(element).text();
            let link = $(element).attr("href");
            result.push({
                title: title,
                link: link
            });
        });
        db.Article
            .create(result)
            .then(function(dbArticle) {
                res.send("somestring")
                console.log("RESULT RUNS");
            })
            .catch(function(error, res) {
                console.log('Promise rejected', error);
                res.json(error);
            })
    });
});


app.get("/articles", function(req, res) {
    db.Article
        .find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {
    db.Article
        .findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("App running on port: " + PORT + "!");
});