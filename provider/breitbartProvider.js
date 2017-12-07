var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");
var exports = module.exports;


exports.breitbart = request("http://www.breitbart.com/california/", function(error, resp, html) {
    var $ = cheerio.load(html);
    var result = [];

    $("h2 a").each(function(i, element) {
        var title = $(element).text();
        var link = $(element).attr("href");

        result.push({
            title: title,
            link: link
        });

    });
    // console.log("Results: ", result);

});



