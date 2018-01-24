

var express = require("express");
var cookieParser = require('cookie-parser')

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var anysize = 6;//the size of string
  var charset = "ABCDEFGHIGKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"; //from where to create
  result= "";
     for( var i=0; i < anysize; i++ )
        result += charset[Math.floor(Math.random() * charset.length)];
    return result;
}


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
/*
// add new items
app.post("/urls", (req, res) => {
  //console.log(req.body);  //{ longURL: 'https://www.pinterest.ca' }
  let longURLKeyValue = req.body  //console.log(longURLKeyValue);
  let longURL = longURLKeyValue['longURL']
  console.log("longURL is " + longURL)
  let shortURL = generateRandomString().  //console.log(" random string " + shortURL)
  urlDatabase[shortURL] = longURL
  console.log(urlDatabase) // debug statement to see POST parameters
  res.send("Ok");
});
app.post("/urls", (req, res) => {
 let longURLKeyValue = req.body
 let longURL = longURLKeyValue['longURL']
 console.log("trying to get value " + longURL)
 let shortURL = generateRandomString()


 console.log(" random string " + shortURL)
 //console.log(longURL)
 urlDatabase[shortURL] = longURL
 //console.log(req.body);
 console.log(urlDatabase)
  //{ longURL: 'https://www.pinterest.ca' }
  // debug statement to see POST parameters
 res.send("Ok");         // Respond with 'Ok' (we will replace this)
});*/


app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

// add new items
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL //console.log(req.body); // ->  longURL: 'https://www.pinterest.ca' }
  let shortURL = generateRandomString() //console.log(" random string " + shortURL)
  urlDatabase[shortURL] = longURL //console.log(urlDatabase) // debug statement to see POST parameters
  res.redirect("/urls"); //res.send("Ok"); removed to redirect back to origal page with new addition
});

//delete existing items
app.post("/urls/:id/delete", (req, res) => {
    let shortURL =  req.params.id
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

//update existing items
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id //console.log("req.params.id " + req.params.id) //console.log("shortURL " + shortURL)
  let longURL = req.body.longURL //console.log("req.body" + req.body) // console.log("longURL " + longURL)
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

