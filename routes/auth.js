const router = require('express').Router();
const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const saltRounds = 12;
const session = require('express-session');
const fs = require("fs");

//bcrypt.hash("password", saltRounds).then(hash => console.log(hash)); 

//bcrypt.compare("password", "$2b$12$w3cdXXhMKayK7Awj4DfWeugprn5CcA3Xi/SCAYhasznJ4MPdri/5q")
//    .then(result => console.log(result)); 

router.get('/login', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);

});

router.get('/', (req, res) => {
    const loginPage = fs.readFileSync("./public/login/login.html", "utf8");
    return res.send(loginPage);

});

router.get('/createuser', (req, res) => {
    const createPage = fs.readFileSync("./public/createuser/createuser.html", "utf8");
    return res.send(createPage);

});

router.get('/home', (req, res) => {
    if(req.session.login) {
        const homePage = fs.readFileSync("./public/home/home.html", "utf8");
        return res.send(homePage);
    } else {
        return res.redirect("/login");
    }
});

router.get('/getUsername', (req, res) => {
    return res.send({ response: req.session })
});

router.get('/getUseremail', (req, res) => {
    console.log(req.session)
    return res.send({ response: req.session })
});

router.get('/secret', (req, res) => {
    if(req.session.login) {
        const secretPage = fs.readFileSync("./public/secret/secret.html", "utf8");
        return res.send(secretPage);
    } else {
        return res.redirect("/login");
    }
});




/*
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
                    
                    bcrypt.compare(password, userFound.hashedPassword)
                    .then(result => console.log(result));
                    
                    bcrypt.compare(password, userFound.password).then(function(result) {
                       
                        console.log(`${userFound.password}`)
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

router.post('/home', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const infoCheck = await User.query().select('username', 'email', 'password').where('username', username);

        if (infoCheck.length !== 1) {
            return res.redirect("/login");
        }

        if (infoCheck.length === 1){
            if (password === infoCheck[0].password){
                req.session.login = true;
                req.session.username = username;
                return res.redirect("/home");
            } else {
                return res.redirect("/login")
            }
        }

    } catch(error){
        return res.send(error);
    }
})




router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // username and password validation
    if (username && password && email) {
        if (password.length < 8) {
            return res.status(400).send({ response: "Password must be 8 characters or longer" });
        } else {
            try {
                User.query().select('username').where('username', username).then(foundUser => {
                    if (foundUser.length > 0) {
                        return res.status(400).send({ response: "User already exists" });
                    } else {

                            User.query().insert({
                                username,
                                email,
                                password
                            }).then(createdUser => {
                                console.log("success");
                                //return res.send({ response: `The user ${createdUser.username} was created` });
                                return res.redirect("/login");
                            });
                    }
                });
            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the DB" });
            }
        }
    } else {
        return res.status(400).send({ response: "username or password missing" });
    }
});



router.post('/logout', (req, res) => {
    req.session.login = undefined;
    req.session.username = undefined;
    req.session.email = undefined;
    return res.redirect("/login");
});


module.exports = router;