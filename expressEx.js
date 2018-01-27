
var express = require("express");
var cookieParser = require('cookie-parser')

var app = express();
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
                  ID123: {"b2xVn2": "http://www.lighthouselabs.ca",
                        "9sm5xK": "http://www.google.com" },
                  ID222: { "4bwexn": "http://www.lighthouselabs.ca"}
                    };


var userDatabase = {
                 ID123:  {userId: "ID123",
                             userEmail: "123@123.com",
                             userPassword: "123"
                             },
                 ID222:  {userId: "ID222",
                             userEmail: "222@222.com",
                             userPassword: "222"
                             }
                   }

function urlsForUser(id){
  let currentUser = id
for(id in urlDatabase) {
  if (currentUser = id ){
   let urls = urlDatabase.currentUser
  return urls
  }
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
//>> GET << Basuc

app.get("/", (req, res) => {
 // let templateVars = {
//    url: urlDatabase,
//    username: userDatabase[req.cookies["userId"]]}; // added code
  res.render('index'/*, templateVars*/);
});

//app.get("/", (req, res) => {
//  res.end("Hello!");
//});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//GET URL
app.get('/urls', (req,res) => {
  let currentUser = req.cookies["userId"];
  let shortUrl = urlsForUser(currentUser)
  let usersListURL = urlDatabase[currentUser]
  if (currentUser in urlDatabase) {
    let templateVars = {
         usersListURL: usersListURL,
         shortUrl: usersListURL,
         userId: req.cookies["userId"]};
   res.render('urls_index', templateVars);
    } else {
     let templateVars = {
     userId: req.cookies["userId"]};
      res.render('urls_login', templateVars)
  }
});

//GET LOGIN
app.get("/urls/login", (req, res) => {
  let templateVars = {
  userId: req.cookies["userId"]};
  res.render("urls_login",templateVars);
});

//GET REGISTER
app.get("/urls/register", (req, res) => {
  let templateVars = {
    userId: req.cookies["userId"]}; /// updated template vars
  res.render("urls_register", templateVars)
});

//GET NEW
app.get("/urls/new", (req, res) => {
let userId = req.cookies["userId"];
 if (userId in userDatabase) {
  let CurrentUserId = userId;
    let templateVars = {
    urlDatabase: CurrentUserId,
    userId: userId
    }; // updated template vars
  res.render("urls_new", templateVars);
  } else {
     let templateVars = {
     userId: req.cookies["userId"]};
      res.render('urls_login', templateVars);
    }
});

//SHOW SHORT URL
app.get("/u/:shortURL", (req, res) => {
  let userId = req.cookies["userId"];
  let templateVars = {
    url: urlDatabase,
    userId: userId
    }; //
  // let longURL = ...
  res.redirect(longURL);
});

//SHOW URL/:ID
app.get("/urls/:id", (req, res) => {
  let userId = req.cookies["userId"];
  var shortURL = req.params.id;
   if (userId in userDatabase) {
    let currentUserId = userId
    let templateVars = {
          shortURL: shortURL,
          longURL: urlDatabase[currentUserId].shortURL,//[req.params.id],
          urlDatabase: currentUserId,
          userId: currentUserId
          }; // updated template vars
  res.render("urls_show", templateVars);
  } else {
     let templateVars = {
    url: urlDatabase,
    userId: req.cookies["userId"]};
      res.render('urls_login', templateVars);
    }
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/', function (req, res) {

// Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
})

//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

 //REGISTER
app.post("/urls/register", (req, res) => {
 let emailInput = req.body.email;
 let passwordInput = req.body.password;
 let newUserID = generateRandomString()

  if (!req.body.email || !req.body.password) {
     res.status(400).send({ error: "missing email or password" });
    }
   for (var user in userDatabase) {

    if (req.body.email == userDatabase[user].userEmail) {
      res.status(400).send({ error: "that email already exists" });
 } else {
     userDatabase[newUserID] = {
          userId:  newUserID,
          userEmail: emailInput,
          userPassword: passwordInput
           }
    }
  }
   res.cookie('userId', newUserID);
   res.redirect("/urls");
});


 //LOGIN PAGE
 app.post("/login", (req, res) => {
 //console.log (req.body.username + req.body.password)

 var emailInput = req.body.username;
 var passwordInput = req.body.password;
 let userIdAssignment = ""

  for (var elem in userDatabase) {
    if(userDatabase[elem]["userEmail"] === emailInput) {
      userIdAssignment = userDatabase[elem]["userId"];
    }
  }

  if(userIdAssignment === "") {
      res.status(403).send("This user is not registered.");
  } else {

    if(userDatabase[userIdAssignment]["userPassword"] !== passwordInput) {

      res.status(403).send("Incorrect password.");
    }
   }

  res.cookie('userId',userIdAssignment);
  res.redirect("/urls")
});

//LOGOUT
  app.post("/logout", (req, res) => {
    res.clearCookie('userId');
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {

  let longURL = req.body.longURL //console.log(req.body); // ->  longURL: 'https://www.pinterest.ca' }
  let shortURL = generateRandomString() //console.log(" random string " + shortURL)
  urlDatabase.userId[shortURL] = longURL //console.log(urlDatabase) // debug statement to see POST parameters
  res.redirect("/urls");
});

//ADD NEW URL
app.post("/urls", (req, res) => {

  let longURL = req.body.longURL //console.log(req.body); // ->  longURL: 'https://www.pinterest.ca' }
  let shortURL = generateRandomString() //console.log(" random string " + shortURL)
  urlDatabase.userId[shortURL] = longURL //console.log(urlDatabase) // debug statement to see POST parameters
  res.redirect("/urls");
});

//DELETE EXISTING URL
app.post("/urls/:id/delete", (req, res) => {
    let shortURL =  req.params.id
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

//UPDATE EXISTING URL
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