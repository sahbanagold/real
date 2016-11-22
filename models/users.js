'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt   = require('bcrypt-nodejs');

const userSchema = new Schema({
  userEmail: { type: String, unique: true},
  name: String,
  isActive: {
              type: String,
              enum: ['Active', 'NonActive']
            },
  encryptedPassword: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  profilePicture: String,
  profilePictureThumb: String
})
// generating a hash
userSchema.methods.generateHash = function(encryptedPassword) {
    return bcrypt.hashSync(encryptedPassword, bcrypt.genSaltSync(8), null);
};
// checking if encryptedPassword is valid
userSchema.methods.validPassword = function(encryptedPassword) {
    return bcrypt.compareSync(encryptedPassword, this.encryptedPassword);
};
const Users = mongoose.model('users', userSchema)
module.exports = Users
