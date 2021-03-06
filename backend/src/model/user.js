const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Orgs = require('./orgs');


const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
  info: {
    name: String,
    public_address: String,
    coinbase_access_token: String,
  },
  orgs: [{type: Schema.Types.ObjectId, ref: 'Orgs'}]
}); // not use normalization for quick dev

UsersSchema.methods.setPassword = function(password) {
  // set the salt
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.setCoinbaseAccessToken = function(access_token) {
  this.info.coinbase_access_token = access_token;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  // expired in 60 days
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

let Users = mongoose.model('Users', UsersSchema);
module.exports = Users;