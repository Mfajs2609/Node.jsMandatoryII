const router = require('express').Router();
const User = require("../models/User.js");
const fs = require("fs");

//GET method for the electives page
router.get('/electives', (req, res) => {
    //requires login to access
    if(req.session.login) {
        const electivesPage = fs.readFileSync("./public/electives/electives.html", "utf8");
        return res.send(electivesPage);
    } else {
        return res.redirect("/login");
    }
});

//GET method to show the user electives. 
router.get('/userElectives', async (req, res) => {
    //require login to access
    if(req.session.login) {
        //username is used in the query and is set to be username that the user logged in with. 
        username = req.session.username
        const userElectives = await User.query().select('username').where('username', username).withGraphFetched('electives');
        const electives = userElectives[0];
        //converts the objects in the electives variable to a string.
        const stringifyElectives = JSON.stringify(electives);
        //returns the string 
        return res.send({response: stringifyElectives});
    } else {
        return res.redirect("/login");
    }
});

//GET method to show all users with electives.
router.get('/users', async (req, res) => {
    const allUsersWithElectives = await User.query().select('username').withGraphFetched('electives');
    return res.send({ response: allUsersWithElectives });
});


module.exports = router;