var express = require("express");
var router = express.Router();
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var breitbartProvider = require("../provider/breitbartProvider");

var hello = {
	hello: "Hello World"
}

router.get("/", function(req, res) {
// Article.create()
res.json(hello)
})
//         res.render("index", breitbartProvider);

//     });


// router.post("/", function(req, res) {
//         res.render("index", breitbartProvider);

// 	});


module.exports = router;