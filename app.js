const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');


//Passing jSON-objects and form data in HTML-files.
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// You need to copy the config.template.json file and fill out your own secret
const config = require('./config/config.json');

app.use(session({
    secret: config.sessionSecret, //'secret value'
    resave: false,
    saveUninitialized: true
}));

//Express rate limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8 // limit each IP to 8 requests per windowMs
});

app.use('/signup', authLimiter);
app.use('/login', authLimiter);

//Setup Knex with Objection
const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

//Creating connection to database.
const knex = Knex(knexfile.development);
Model.knex(knex);

//router references
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const nodemailerRoute = require('./routes/nodemailer.js');
const electivesRoute = require('./routes/electives.js');

app.use(authRoute);
app.use(usersRoute);
app.use(nodemailerRoute);
app.use(electivesRoute);

//Getting access to static files such as CSS, images, videos etc.
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/public/home"));

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on the port", PORT);
})

