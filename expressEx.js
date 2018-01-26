
var express = require("express");
var cookieParser = require('cookie-parser')

var app = express();
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
  //shortURL: longURL
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//var cookiesInfo = {
    //cookie('userId',randomID);
   //cookie('email',req.body.email);
    //cookie('password',req.body.password)
//}

var userDatabase = {
                userID123:  {userID: "ID123",
                             userEmail: "123@123.com",
                             userPassword: "123"
                             },
                 userID222:  {userID: "ID222",
                             userEmail: "222@222.com",
                             userPassword: "222"
                             }
                   }

function generateRandomString() {
  var anysize = 6;//the size of string
  var charset = "ABCDEFGHIGKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  result= "";
     for( var i=0; i < anysize; i++ )
        result += charset[Math.floor(Math.random() * charset.length)];
    return result;
}


//>> GET <<

app.get("/", (req, res) => {
  let templateVars = {
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]}; // added code
  res.render('index', templateVars);
});


app.get('/urls', (req,res) => {
   let templateVars = {
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]};
  res.render('urls_index', templateVars);
});
app.get("/urls/login", (req, res) => {
  // let templateVars = {
   // url: urlDatabase,
   // username: userDatabase[req.cookies["userID"]]};
  res.render("urls_login");
});

app.get("/urls/register", (req, res) => {
  let templateVars = {
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]}; /// updated template vars
  res.render("urls_register", templateVars)
});

app.get("/urls/new", (req, res) => {
    let templateVars = {
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]}; // updated template vars
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
 let templateVars = {
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]}; // updated template vars
  res.render("urls_show", templateVars);
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
    url: urlDatabase,
    username: userDatabase[req.cookies["userID"]]
  }
// Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
})

//>> POST <<

 //registration page
app.post("/urls/register", (req, res) => {

  if (!req.body.email || !req.body.password) {
     res.status(400).send({ error: "missing email or password" });
   }
   for (var user in userDatabase) {

  if (req.body.email == userDatabase[user].userEmail) {
      res.status(400).send({ error: "that email already exists" });
    }
   }

    let randomID = generateRandomString()
    res.cookie('userId',randomID);
    //res.cookie('email',req.body.email);
    //res.cookie('password',req.body.password)

     let emailInput = req.body.email;
     let passwordInput = req.body.password;
       userDatabase[randomID] = {
    userID: randomID,
    userEmail: emailInput,
    userPassword: passwordInput
    }
// console.log(userDatabase)
  res.redirect("/urls");

});

 //login + login cookie //
 app.post("urls/login", (req, res) => {
  console.log (req.body.username, req.body.password)
 var emailInput = req.body.username
 var passwordInput =req.body.password
 var userIDassignment = 0
  for (var info in userDatabase){
    if(userDatabase[info]["email"] === emailInput) {
    userIDassignment = userDatabase[info]["UserID"];
    }
  }
  if(!userIDassignment){
    res.status(400).send({ error: "Your email is not registered." });
  } else {
    if(userDatabase[userIDassignment]["userPassword"] !== passwordInput) {
      res.status(403).send("Your password is incorrect.");
    }
  }
       res.cookie('userId', userIDassignment);
       res.redirect("/urls");
});

 //logout
  app.post("/logout", (req, res) => {
    res.clearCookie('userID');
  res.redirect("/urls")
});

// Add New URL
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL //console.log(req.body); // ->  longURL: 'https://www.pinterest.ca' }
  let shortURL = generateRandomString()
  urlDatabase[shortURL] = longURL //console.log(urlDatabase) // debug statement to see POST parameters
  res.redirect("/urls"); //res.send("Ok"); removed to redirect back to origal page with new addition
});

//Delete Existing URL
app.post("/urls/:id/delete", (req, res) => {
    let shortURL =  req.params.id
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

//Update Existing URL
app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id //console.log("req.params.id " + req.params.id) //console.log("shortURL " + shortURL)
  let longURL = req.body.longURL //console.log("req.body" + req.body) // console.log("longURL " + longURL)
  urlDatabase[shortURL] = longURL
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(PORT)
  console.log(`Example app listening on port ${PORT}!`);
});