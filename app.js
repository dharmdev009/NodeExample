const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

db.once('open', function () {
    console.log("connection is open");
});

db.on("error", function (error) {
   console.log(error);
});

//Bring in models
let Article = require("./models/articles");

//App initialization
const app = express();

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));


//Get
app.get("/", function (request, response) {
    // let articles = [
    //     {
    //         id : 1,
    //         title: "Title 1",
    //         author: "Dharm",
    //         body: "this is article first"
    //     },
    //     {
    //         id : 2,
    //         title: "Title 2",
    //         author: "Dev",
    //         body: "this is article second"
    //     },
    //     {
    //         id : 3,
    //         title: "Title 3",
    //         author: "Sharma",
    //         body: "this is article third"
    //     }
    // ]
    Article.find({}, function (error, articlesValue) {
        if(error) {
            console.log(error);
        } else {
            response.render("index", {
                title: "Hello Express JS !",
                articles: articlesValue
            });
        }
    });
    
});

app.get("/article/:id", function (request, response) {
    Article.findById(request.params.id, function (error, article) {
       response.render('article', {
        article: article
       });
    });
});

app.get("/article/edit/:id", function (request, response) {
    Article.findById(request.params.id, function (error, article) {
       response.render('edit_article', {
        title: "Edit Article",
        article: article
       });
    });
});

//Add route
app.get("/articles/add", function (request, response) {
    response.render("articles_add", {
        title: "Hello !!!!!!!!"
    })
});

//Add POST
app.post("/articles/add", function (request, response) {

    let article = new Article();
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;

    article.save(function (error) {
        if(error) {
            console.log(error);
            return;
        } else {
            response.redirect("/");
        }     
    });
});

//Update POST
app.post("/articles/edit/:id", function (request, response) {

    let article = {}
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;

    let query = {_id: request.params.id};

    Article.update(query, article, function (error) {
        if(error) {
            console.log(error);
            return;
        } else {
            response.redirect("/");
        }     
    })

});

//Server start
app.listen(3000, function (request, response) {
    console.log("Server is started at port 3000 ......");
})