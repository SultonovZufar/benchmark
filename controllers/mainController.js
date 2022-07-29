const User = require('../models/signupModel');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const geoip = require('geoip-lite');

module.exports = {
    homePage: (req, res) => {
        res.render('main/home', {data:"Home Page"});
    },

    aboutPage: (req, res) => {
        res.render('main/about', {data:"About Page"});
    },

    contactPage: (req, res) => {
        res.render('main/contact', {data:"Contact Page"});
    },

    signUpPage: (req, res) => {
        res.render('main/signup', {data:"SignUp Page"});
    },

    signInPage: (req, res) => {
        res.render('main/signin', {data:"SignIn Page"});
    },

    privatePage: (req, res) => {

        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        let geo = geoip.lookup(ip);
        res.render("main/private", {
            data:"Private Page", 
            geo,
            ip,
            extra:req.headers['user-agent'].split(')')
        });
    },

    signUp: async (req, res) => {
        req.check("name").notEmpty().trim().withMessage("Name must not empty");
        req.check("sure").notEmpty().trim().withMessage("Surename must not empty");
        req.check("email").notEmpty().trim().withMessage("Email must not empty");
        req.check("pass").notEmpty().trim().withMessage("Password must not empty");

        if (req.body.email.length !== 0) {
            req.check("email").isEmail().trim().withMessage("Wrong email format");
        }

        if (req.body.pass.length !== 0) {
            req.check("pass").isLength({min:6}).trim().withMessage("Password length min 6");
        }

        let errors = await req.getValidationResult();

        if (!errors.isEmpty()) {
            let err = errors.array().map(error => error.msg);
            req.flash('errors', err);
            res.redirect('/signup');
        } else {

            let result = await User.findOne({email:req.body.email});

            if (result) {
                req.flash('errors', "Email already exists");
                res.redirect('/signup');
            } else {
                req.body.pass = hashSync(req.body.pass, genSaltSync(10));
                await User.create(req.body);

                req.flash('success', "Sign Up was successful. Please sign in");
                res.redirect('/signup');                   
            }
        }
    },

    signIn: async (req, res) => {
        req.check("email").notEmpty().trim().withMessage("Email must not empty");
        req.check("pass").notEmpty().trim().withMessage("Password must not empty");

        if (req.body.email.length !== 0) {
            req.check("email").isEmail().trim().withMessage("Wrong email format");
        }

        let errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            let err = errors.array().map(error => error.msg);
            req.flash('errors', err);
            res.redirect('/signin');
        } else {
            let result = await User.findOne({email:req.body.email});

            if (result) {
                if (compareSync(req.body.pass, result.pass)) {
                    req.session.userSession = result;
                    res.redirect('/');
                } else {
                    req.flash('errors', "User not found");
                    res.redirect('/signin');
                }
            } else {
                req.flash('errors', "User not found");
                res.redirect('/signin');
            }
        }
    },

    signOut: (req, res) => {
        delete req.session.userSession;
        res.redirect('/');
    },

    toAllow: (req, res, next) => {
        if (req.session.userSession) {
            next();
        } else {
            req.flash('errors', "This is private page. You need signin");
            res.redirect('/signin');
        }
    }
}