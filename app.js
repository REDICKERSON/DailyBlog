//require section

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Db } = require("mongodb");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//ejs view engine
app.set('view engine', 'ejs');

//filler content for design layout
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// ----- MONGOOSE Section -------

//mongoose connection
mongoose.connect("mongodb+srv://REDickerson:Wpsm51613@cluster0.xlpprvk.mongodb.net/blogDB", {useNewUrlParser: true});

//mongoose schemas

const postSchema = {
  title: String,
  content: String,
  timeStamp: String
}

//mongoose models

const Post = mongoose.model("Post", postSchema);


// ------- routing section ---------

//root route
app.get("/", function (req, res) {

  Post.find({}, function(err, posts){
    if (err){return};
    
    res.render("home", { "startingContent": homeStartingContent, "posts": posts });
  });
  
  
});

//about route
app.get("/about", function (req, res) {

  res.render("about", { "aboutContent": aboutContent });
});

//contact route
app.get("/contact", function (req, res) {

  res.render("contact", { "contactContent": contactContent });
});

//compose route
app.get("/compose", function (req, res) {

  res.render("compose");
});

app.post("/compose", function (req, res) {

  let timeOfPost = Date();
  
  //creates compose post object
  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composeBody,
    timeStamp: timeOfPost,    
  });

  //add the post to the db
  post.save(function(err){
    if (err){ return };

    //redirect to home and show all posts
    res.redirect("/");    
  });
  
});

//posts/:topic route
app.get("/posts/:postId", function (req, res) {  

  //render post page and content
  
  const requestedId = req.params.postId;
  
  
  //find if the post exists by id
  Post.findOne({_id: requestedId},function(err, foundPost){
    if (err) {return};
    
    //render the post
    res.render("post", { "postTitle": foundPost.title, "postContent": foundPost.content });
  });

});

//heroku listener port info
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, function() {
  console.log("Server has started on succesfully");
});

