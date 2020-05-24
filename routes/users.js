const router = require('express').Router();
const User = require('../models/User.js');

router.get('/setsessionvalue', (req, res) => {
    req.session.payingAttention = true;
    return res.send({ response: "OK" });
});

router.get('/getsessionvalue', (req, res) => {
    return res.send({ response: req.session.payingAttention });
});

router.get('/getUserdata', (req, res) => {
    return res.send({ response: req.session });
});

//POST method for signup, inserts the password i plain text because i had some problems using bcrypt.compare when logging in
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

/*
Signup with password encryptet
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        // password validation
        if (password.length < 8) {
            return res.status(400).send({ response: "Password must be 8 characters or longer" });
        } else {
            try {
                User.query().select('username').where('username', username).then(foundUser => {
                    if (foundUser.length > 0) {
                        return res.status(400).send({ response: "User already exists" });
                    } else {
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            User.query().insert({
                                username,
                                password: hashedPassword
                            }).then(createdUser => {
                                return res.send({ response: `The user ${createdUser.username} was created` });
                            });
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
*/
module.exports = router;
