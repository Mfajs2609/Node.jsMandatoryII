const router = require('express').Router();
const nodemailer = require("nodemailer");
const fs = require("fs");


//------------------NodeMailer---------------------//
//GET method for the nodeMailer page
router.get('/nodeMailer', (req, res) => {
    //requires login to access.
    if(req.session.login) {
        const mailPage = fs.readFileSync("./public/mail/nodeMailer.html", "utf8");
        return res.send(mailPage);
    } else {
        return res.redirect("/login");
    }
});

//POST method for nodeMailer.
router.post('/nodeMailer', (req, res) => {
    //transporter object
    let transporter = nodemailer.createTransport({
        //service SMTP Gmail
        service: "Gmail", 
    auth: {
        user: "node.testmail300@gmail.com", // user
        pass: "Nodetest123" // password
    }
    });

    //mailOptions contains the email massage
    let mailOptions = {
    from: '"NodemailerTest" <node.testmail300@gmail.com>', // sender address
    to: req.body.email, // receiver from the form data
    subject: req.body.subject, // Subject from the form data
    text: req.body.message // message from the form data
    };

    //Send mail with the transporter object.
    transporter.sendMail(mailOptions, (error) => {
        //if error
        if(error) {
            return console.log(error)
        }

    console.log("Message sent:");
    return res.redirect("/nodeMailer")
    });
    
});

module.exports = router;