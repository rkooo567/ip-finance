import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './route/routes';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';

// passport
import passport from 'passport';
import LocalStrategy from 'passport-local';


//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

const app = express();
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'ipfinance', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB setup
// Connection URL
const url = process.env.MONGO;
mongoose.connect(
  url, 
  {
    useNewUrlParser: true
  }
);
mongoose.set('debug', true);
console.log("MongoDB is connected");

// Passport authentication config
let Users = require('./model/user');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user) {
        return done(null, false, { error: { 'email': 'is invalid' } });
      }

      if(!user.validatePassword(password)) {
        return done(null, false, { errors: { 'password': 'is invalid' } });
      }

      console.log("user \{email} is sucessfully validated")
      return done(null, user);
    }).catch(done);
}));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
