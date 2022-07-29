const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const validator = require('express-validator');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.set('port', 3000);
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost/center", {useNewUrlParser:true, useUnifiedTopology:true})
mongoose.connection.once('open', () => {
    console.log("DB is running. BD is named 'Center'");
})

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(layouts);
app.use(validator());
app.use(cookieParser('sir'));
app.use(session({
    secret: "bu sir",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    resave:false,
    saveUninitialized:false
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('errors');
    res.locals.succ = req.flash('success');
    res.locals.userSession = req.session.userSession;
    next();
});

const router = require('./routers/mainRouter');
app.use(router);

app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
    next()
})

app.listen(app.get('port'), () => {
    console.log(`Server is running on Port: ${app.get('port')}`);
});