const router = require('express').Router();
const nodemailer = require("nodemailer");
const fs = require("fs");

//------------------NodeMailer---------------------
router.get('/nodeMailer', (req, res) => {
    if(req.session.login) {
        const mailPage = fs.readFileSync("./public/mail/nodeMailer.html", "utf8");
        return res.send(mailPage);
    } else {
        return res.redirect("/login");
    }
});

router.post('/nodeMailer', (req, res) => {
      
    let transporter = nodemailer.createTransport({
        service: "Gmail", 
    auth: {
        user: "node.testmail300@gmail.com", // generated ethereal user
        pass: "Nodetest123" // generated ethereal password
    }
    });

    // send mail with defined transport object
    let mailOptions = {
    from: '"NodemailerTest" <node.testmail300@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.message // plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error)
        }

    console.log("Message sent:");
    });
});


module.exports = router;