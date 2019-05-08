var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {

    axios.get("https://pokemongohub.net/").then(function(response) {

    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("a").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})
  .then(function(dbArticle) {
    // If all Notes are successfully found, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurs, send the error back to the client
    res.json(err);
  });h
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Articled.find({
    _id: mongojs.ObjectID(req.params.id)
  })
  .then(function(dbArticleID) {
    // If all Notes are successfully found, send them back to the client
    res.json(dbArticleID);
  })
  .catch(function(err) {
    // If an error occurs, send the error back to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.note.create(req.body)
  .then(function(dbArticleUpdate) {
    // If all Notes are successfully found, send them back to the client
    return db
    res.json(dbArticleUpdate);
  })
  .catch(function(err) {
    // If an error occurs, send the error back to the client
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
