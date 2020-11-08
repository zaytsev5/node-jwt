const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const ejs = require('ejs')
const session = require('express-session')
const app = express();
const passport = require('passport')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.set('view engine','ejs')



app.use(passport.initialize());
app.use(passport.session());


app.get('/home',(req, res) =>{
  res.render('home')
})
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {  
  console.log("got this far");
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      console.log(req.token);
      res.status(200).json({
        message: 'Welcome to JsonWebToken...',
        authData
      });
    }
  });
});

// app.get('/welcome',verifyToken,(req,res)=>{
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.send('Please login to access resoures...')
//     } else {
//       res.send('Welcome to dashboard..')
//     }
//   });
// })0
app.get('/welcome',(req, res) =>{
  console.log(req.user);
})

app.post('/api/login', (req, res) => {

 const user = req.body;
 console.log(user);
  
  
  // MOCK USER
  // const user = {
  //   id: 1, 
  //   username: 'nguyenvnhai',
  //   email: 'nguyenvnhai@gmail.com'
  // }
  req.user = user;
  console.log(req.user);
 
  jwt.sign({user}, 'secretkey', { expiresIn: '300s' }, (err, token) => {
    res.json({
      token
    });
  });

});

function forward(req, res, next){
  if(req.token) next();
  else res.send("Have to log in!")
}

// Verify Token
function verifyToken(req, res, next) {

  const token = req.headers['authorization'];
  if(typeof token !== 'undefined') {
    req.token = token;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.send("Your session is expried!");
  }

}
const port  = process.env.PORT || 5000

app.listen(5000, () => console.log(`Server started on port ${port}`));