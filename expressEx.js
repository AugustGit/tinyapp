
var express = require("express");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
let numP = 10;
var app = express();
app.use(cookieParser())
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(cookieSession({
  name: 'session',
  keys: ["secretkey"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var urlDatabase = {
                  ID123: {"b2xVn2": "http://www.lighthouselabs.ca",
                        "9sm5xK": "http://www.google.com"
                        },

                  ID222: {"4bwexn": "http://www.pinterest.ca"
                      },
                    };


var userDatabase = {
                 ID123:  {userId: "ID123",
                             userEmail: "123@123.com",
                             userPassword: "$2a$10$MyCGkNNJ.oHwhyQwoq2cyu0Xxej.ICCxSA8TWpMeT57ZrhffrJqEG"
                             },

                 ID222:  {userId: "ID222",
                             userEmail: "222@222.com",
                             userPassword: "$2a$10$6EpNgwVqbP3xSPePr2wIDuvB15fwPRswFta73.EeQB6T4kladV5le"
                             }
                   };

function urlsForUser(id){
  let currentUser = id;
 for(id in urlDatabase) {
  if (currentUser = id ){
   let urls = urlDatabase.currentUser;
  return urls;
  }
 }
};

function generateRandomString() {
  var anysize = 6;//the size of string
  var charset = "ABCDEFGHIGKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  result= "";
     for( var i=0; i < anysize; i++ )
        result += charset[Math.floor(Math.random() * charset.length)];
    return result;
};
//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>> GET <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


app.get("/", (req, res) => {
   req.session.views = (req.session.views || 0) + 1;
   res.end(req.session.views + ' views');
  res.render('index');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/// GET URL. ///////////////////
app.get('/urls', (req,res) => {
  let currentUser = req.session.userId;
  let shortUrl = urlsForUser(currentUser);
  let usersListURL = urlDatabase[currentUser];
  if (currentUser in urlDatabase) {
    let templateVars = {
         usersListURL: usersListURL,
         shortUrl: usersListURL,
         userId: req.session.userId};
   res.render('urls_index', templateVars);
    } else {
     let templateVars = {
     userId: req.session.userId};
      res.render('urls_login', templateVars)
  }
});

/// GET LOGIN /////////////////////
app.get("/urls/login", (req, res) => {
  let templateVars = {
  userId: req.session.userId};
  res.render("urls_login",templateVars)
});

/// GET REGISTER /////////////////////////
app.get("/urls/register", (req, res) => {
  let templateVars = {
    userId: req.session.userId}; /// updated template vars
  res.render("urls_register", templateVars)
});

/// GET NEW /////////////////////////
app.get("/urls/new", (req, res) => {
let userId = req.session.userId;
 if (userId in userDatabase) {
  let CurrentUserId = userId;
    let templateVars = {
    urlDatabase: CurrentUserId,
    userId: req.session.userId
    };
  res.render("urls_new", templateVars);
  } else {
     let templateVars = {
     userId: req.session.userId
   }
     ;
      res.render('urls_login', templateVars);
    }
});

//SHOW SHORT URL
app.get("/u/:shortURL", (req, res) => {
var shortURL = req.params.shortURL;
  for (var prop in urlDatabase) {
    var sub = urlDatabase[prop]

    for (var tinyURL in sub){
      if( tinyURL === shortURL) {
        var longURL = sub[tinyURL]
      }
     }
    }
  res.redirect(longURL);
});

//SHOW URL/:ID
app.get("/urls/:id", (req, res) => {
  let userId = req.session.userId;
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
    userId: req.session.userId};
      res.render('urls_login', templateVars);
    }
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/', function (req, res) {

// session that have not been signed
  console.log('session: ', req.session)
})

//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>> POST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

 //REGISTER
app.post("/urls/register", (req, res) => {
 let emailInput = req.body.email;
 let passwordInput = req.body.password;
 let newUserId = generateRandomString()
 let hashedPassword = bcrypt.hashSync(req.body.password, numP);
console.log (hashedPassword)

  if (!req.body.email || !req.body.password) {
     res.status(400).send({ error: "missing email or password" });
    }
   for (var user in userDatabase) {

    if (req.body.email == userDatabase[user].userEmail) {
      res.status(400).send({ error: "that email already exists" });
 } else {
     userDatabase[newUserId] = {
          userId:  newUserId,
          userEmail: emailInput,
          userPassword: hashedPassword
           }

     urlDatabase[newUserId] = { }
    }
  }
   req.session.userId = newUserId;
   res.redirect("/urls");
});

 //LOGIN PAGE
 app.post("/login", (req, res) => {

 var emailInput = req.body.username;
 var passwordInput = req.body.password;
 let userId = "";

  for (var elem in userDatabase) {
    if(userDatabase[elem]["userEmail"] === emailInput) {
      userId = userDatabase[elem]["userId"];
      req.session.userId = userId;
    }
  }

  if(userId === "") {
      res.status(403).send("This user is not registered.");

  } else {

    if (bcrypt.compareSync(passwordInput, userDatabase[userId]["userPassword"]) === false ) {
      res.status(403).send("Incorrect password.");
    }
   }
  res.redirect("/urls")
});

//LOGOUT
  app.post("/logout", (req, res) => {
    req.session = null;
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  let userId = req.session.userId;
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  let userURLs= urlDatabase[userId];
  userURLs[shortURL] = longURL;
  res.redirect("/urls");
});

//ADD NEW URL
app.post("/urls", (req, res) => {
  let userId = req.session["userId"];
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  let userURLs = urlDatabase[userId];
   userURLs[shortURL] = longURL;
  res.redirect("/urls");
});

//DELETE EXISTING URL
app.post("/urls/:id/delete", (req, res) => {
    let userId = req.session.userId;
    let shortURL =  req.params.id;
    let userURLs = urlDatabase[userId];
  delete userURLs[shortURL];
  res.redirect("/urls");
});

//UPDATE EXISTING URL
app.post("/urls/:id", (req, res) => {
  let userId = req.session.userId;
  let shortURL = req.params.id;
  let longURL = req.body.longURL;
  let userURLs = urlDatabase[userId];
  userURLs[shortURL] = longURL;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(PORT);
  console.log(`Example app listening on port ${PORT}!`);
});














