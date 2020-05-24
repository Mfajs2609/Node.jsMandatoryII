const router = require('express').Router();
const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const saltRounds = 12;
const session = require('express-session');
const fs = require("fs");

//bcrypt.hash("password", saltRounds).then(hash => console.log(hash)); 

//bcrypt.compare("password", "$2b$12$w3cdXXhMKayK7Awj4DfWeugprn5CcA3Xi/SCAYhasznJ4MPdri/5q")
//    .then(result => console.log(result));


//GET methods for login
router.get('/login', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

router.get('/', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);
});

//GET method for create user
router.get('/createuser', (req, res) => {
    const createPage = fs.readFileSync("./public/createuser/createuser.html", "utf8");
    return res.send(createPage);
});

//GET method for home, login is required.
router.get('/home', (req, res) => {
    if(req.session.login) {
        const homePage = fs.readFileSync("./public/home/home.html", "utf8");
        return res.send(homePage);
    } else {
        return res.redirect("/login");
    }
});

//GET method for secret, login is required.
router.get('/secret', (req, res) => {
    if(req.session.login) {
        const secretPage = fs.readFileSync("./public/secret/secret.html", "utf8");
        return res.send(secretPage);
    } else {
        return res.redirect("/login");
    }
});

//POST method for home. 
router.post('/home', async (req, res) => {

    //variable for the form data.
    const { username, password } = req.body;
    try {
        //Selecting username, email and password Where username in the database matches username from the form.
        const infoCheck = await User.query().select('username', 'email', 'password').where('username', username);

        //Checking if the query found any matches, if not redirect login. 
        if (infoCheck.length !== 1) {
            return res.redirect("/login");
        }

        //If match, Check that password from the form matches the password from the database.
        if (infoCheck.length === 1){
            //if true.
            if (password === infoCheck[0].password){
                //using the middleware express-session, this will give the user access to the other pages.
                req.session.login = true;
                req.session.username = username;
                req.session.email = infoCheck[0].email;
                return res.redirect("/home");
            } else {
                //if false, redirect to login.
                return res.redirect("/login")
            }
        }

    } catch(error){
        return res.status(500).send({ response: "Something went wrong with the DB" });
    }
});

//POST method for logout
router.post('/logout', (req, res) => {
    //Again using the middleware express-session.
    //This will make sure that when the user logout, they have to login again before accessing the unauthorized pages.
    req.session.login = undefined;
    req.session.username = undefined;
    req.session.email = undefined;
    return res.redirect("/login");
});

/*
First attempt at creating a login where i compared the password from the form data with the password stored in the database.
it didn't work so I started over again with password in plain text.

router.post('/login', (req, res) => {                                                                               
    const { username, password } = req.body;
    if (username && password) {
        console.log(username, password)
        //checking that the user exists
        User.query().select('username', 'password').where('username', username).then(userFound => {
            if(userFound.length !== 1) {
                return res.status(400).send({response: "username could not be found, try again"});
            } else {
                try{
                    console.log(userFound.length)
                    
                    bcrypt.compare(password, userFound.password)
                    .then(result => console.log(result));
                    
                    bcrypt.compare(password, userFound.password).then(function(result) {
                       
                        if (result === true) {
                            return res.send({response: "Success"})
                        } else {
                            return res.send({response: "Incorrect password"})
                        }
                    });
                
                } catch (error) {
                    return res.status(500).send({ response: "Something went wrong with the DB" });
                } 
            }
        });  
    } else {
        return res.status(400).send({ response: "username or password missing" });
    }
});
*/

module.exports = router;