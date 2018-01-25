
var express = require("express");
var cookieParser = require('cookie-parser')

var app = express();
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var cookiesInfo = {}
//
var userRegistrar = {}

function generateRandomString() {
  var anysize = 6;//the size of string
  var charset = "ABCDEFGHIGKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  result= "";
     for( var i=0; i < anysize; i++ )
        result += charset[Math.floor(Math.random() * charset.length)];
    return result;
}


app.get("/urls/register", (req, res) => {
  let templateVars = {
    cookieFoobar: cookiesInfo,
    userRegistrarFoobar: userRegistrar
  }
  res.render("urls_register", templateVars)
});

app.get("/urls/new", (req, res) => {
   let templateVars = {
      cookieFoobar: cookiesInfo,
      userRegistrarFoobar: userRegistrar
    }
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
      cookieFoobar: cookiesInfo,
      userRegistrarFoobar: userRegistrar
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
   cookieFoobar: cookiesInfo,
   userRegistrarFoobar: userRegistrar
  };
  console.log( templateVars)
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


app.get('/', function (req, res) {
  let templateVars = {
    username: cookiesInfo["username"],
    userRegistrarFoobar: userRegistrar["email"]
  }
// Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
})



 //login/logout leave cookie
 app.post("/login", (req, res) => {
  if(req.body.username !== null){
   res.cookie('username',req.body.username);
   let loginName = req.body.username;
   cookiesInfo['loginID'] = loginName;
   //console.log("username is " + loginName);
   //console.log("cookiesInfo " + cookiesInfo)
   res.redirect("/urls")
   } else {
  res.clearCookie('name')
   }
});

 //registration page
app.post("/urls/register", (req, res) => {
    console.log("req.body is " + req.body);
    let emailInput = req.body.email;
    console.log("emailInput is " + emailInput );
    let passwordInput = req.body.password;
    console.log("passwordInput is " + passwordInput );
    userRegistrar.userEmail = emailInput;
    userRegistrar.userPassword = passwordInput;
    console.log("userRegistrar is " + userRegistrar );
  res.redirect("/urls");
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