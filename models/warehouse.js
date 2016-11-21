'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const wareHouseSchema =  new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: String,
  profilePicture: String,
  profilePictureThumb: String,
  type: String,
  location: String
}, {
  timestamps: true
})

let wareHouse = mongoose.model('wareHouse', wareHouseSchema)
module.exports = wareHouse
